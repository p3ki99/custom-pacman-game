import { Draw } from "./Draw.js";
import { generateMapElements } from "./maps.js";
import { Pacman } from "./Pacman.js"
import { Wall } from "./Wall.js";
import { pauseAnimation } from "./Game.js";
import { Keyboard } from "./Keyboard.js";
import { Collision } from "./Collision.js";
import { DirectionChooser } from "./DirectionChooser.js";
import { Directions, Mode, Ghost } from "./Ghost.js";

const canvas = document.getElementById('canvas');

export class Level {

    static header_height = 120;

    constructor(context, map, game) {
        this.context = context;
        this.playing = false;

        this.map = map;
        this.game = game;
        this.pacman = new Pacman({ position: null, velocity: null, direction: null, images: null });

        this.wall = [];
        this.pellets = [];
        this.powerUps = [];
        this.ghosts = [];
        this.door = null;

        this.startPositions = {
            pacman: null,
            blinky: null,
            pinky: null,
            inky: null,
            clyde: null
        };
        this.died = false;
        this.draw = new Draw();

        this.dieAnimation = 0;
        this.executedOnce = false;
    }


    async playLevel() {
        this.playing = true;
        generateMapElements(this.map, this.wall, this.pellets, this.powerUps, this.pacman, this.ghosts, this, this.startPositions, Level.header_height);
        Keyboard.initKeyboardEvents();
        DirectionChooser.game = this.game;
        DirectionChooser.level = this;

        canvas.width = this.map[0].length * Wall.width;
        canvas.height = this.map.length * Wall.height + Level.header_height;

        while (this.playing && this.game.lifes > 0) {
            await animationFrame();
            this.context.clearRect(0, 0, canvas.width, canvas.height);

            this.drawElements();

            if (this.pellets.length == 0) break;

            if (this.died) {

                if (!this.executedOnce) {
                    this.executedOnce = true;
                    this.pacman.initDead();

                    this.dieAnimation = setInterval(() => {
                        if (this.pacman.nextDeadImg()) {
                            this.died = false;

                            this.game.lifes--;
                            this.executedOnce = false;
                            this.resetElements();
                            clearInterval(this.dieAnimation);
                        }
                    }, 100);
                }

                continue;
            }

            this.draw.drawElements(this.ghosts);

            Collision.checkCollisionPacmanWithBoundaries(this.pacman, this.wall);
            Collision.checkCollisionGhostWithStartPosition(this.ghosts, this.startPositions);
            Collision.checkCollisionPacmanWithPowerUps(this.pacman, this.powerUps, this.game, this.ghosts);
            Collision.checkCollisionPacmanWithPellets(this.pacman, this.pellets, this.game);
            Collision.checkPacmanLeftMap(this.pacman, this.map, this.level);
            Collision.checkCollisionGhostsWithBoundaries(this.ghosts, this.wall, this.door);
            Collision.checkGhostsLeftMap(this.ghosts, this.map, this.level);
            Collision.checkCollisionPacmanWithGhosts(this.pacman, this.ghosts, this, this.game);

            this.ghosts.forEach(ghost => {
                ghost.update();
            });

            this.pacman.updateFromKeyboard(this.wall);
            this.pacman.update();
        }

        if (this.pellets.length == 0) {
            // win animation
            await pauseAnimation(1000);

            for (let i = 0; i < 4; i++) {
                this.context.clearRect(0, 0, canvas.width, canvas.height);

                this.draw.drawWhiteBackground();
                this.drawElements();
                await pauseAnimation(300);

                this.context.clearRect(0, 0, canvas.width, canvas.height);

                this.drawElements();
                await pauseAnimation(300);
            }
        }

        // stop intervals
        this.pacman.stopAnimation();
        this.ghosts.forEach(ghost => {
            ghost.stopAnimation();
        });

        Keyboard.resetKeyboard();
        Keyboard.stopKeyboardEvents();
    }

    resetElements() {
        this.pacman.position = { ...this.startPositions.pacman };
        this.pacman.startAnimation();

        Keyboard.resetKeyboard();

        this.ghosts.forEach(ghost => {
            ghost.stopAnimation();
            ghost.position = { ...this.startPositions[ghost.name.toLowerCase()] };
            ghost.velocity = { x: Ghost.speed, y: 0 };
            ghost.direction = Directions.RIGHT;
            ghost.img_index = 0
            ghost.mode = (ghost.name === 'Blinky') ? Mode.NORMAL : Mode.HOME;
            ghost.speed = Ghost.speed;
            ghost.startAnimation();
        });

    }

    drawElements() {
        this.draw.drawHeader(this.game.score, this.game.lifes, this.game.difficulty, this.game.soundOn);
        this.draw.drawElements(this.wall);
        this.draw.drawElements(this.powerUps);
        this.draw.drawElements(this.pellets);
        this.pacman.draw();
    }

}

function animationFrame() {
    let resolve = null
    const promise = new Promise(r => resolve = r)
    window.requestAnimationFrame(resolve)
    return promise
}