import { Keyboard } from "./Keyboard.js";
import { Collision } from "./Collision.js";
import { Wall } from "./Wall.js";
import { Directions } from "./Ghost.js";

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class Pacman {
    static speed = 5;

    constructor({ position, velocity, direction, images }) {
        this.position = position;
        this.velocity = velocity;
        this.direction = direction;
        this.images = images;

        this.radius = Wall.width / 2;
        this.img_index = 0;

        this.intervalId = 0;

        this.startAnimation();
    }

    draw() {
        context.drawImage(this.images[this.img_index], this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    updateFromKeyboard(boundaries) {
        let lastSpeed;
        let lastDirection = this.direction;

        if (Keyboard.nextKey === 'w') {
            lastSpeed = this.velocity.x;

            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];

                if (Collision.circleCollidesWithRectangle({
                    circle: { ...this, velocity: { x: 0, y: -Pacman.speed } },
                    rectangle: boundary
                })) {
                    Keyboard.currentKey = Keyboard.lastKey;
                    this.velocity.x = lastSpeed;
                    this.velocity.y = 0;
                    this.direction = lastDirection;
                    break;
                } else {
                    Keyboard.currentKey = Keyboard.nextKey;
                    this.velocity.x = 0;
                    this.velocity.y = -Pacman.speed;
                    this.direction = Directions.UP;
                }
            }

        } else if (Keyboard.nextKey === 's') {
            lastSpeed = this.velocity.x;

            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];

                if (Collision.circleCollidesWithRectangle({
                    circle: { ...this, velocity: { x: 0, y: Pacman.speed } },
                    rectangle: boundary
                })) {
                    this.velocity.x = lastSpeed;
                    this.velocity.y = 0;
                    Keyboard.currentKey = Keyboard.lastKey;
                    this.direction = lastDirection;
                    break;
                } else {
                    Keyboard.currentKey = Keyboard.nextKey;
                    this.velocity.x = 0;
                    this.velocity.y = Pacman.speed;
                    this.direction = Directions.DOWN;
                }
            }

        } else if (Keyboard.nextKey === 'a') {
            lastSpeed = this.velocity.y;

            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];

                if (Collision.circleCollidesWithRectangle({
                    circle: { ...this, velocity: { x: -Pacman.speed, y: 0 } },
                    rectangle: boundary
                })) {
                    this.velocity.x = 0;
                    this.velocity.y = lastSpeed;
                    Keyboard.currentKey = Keyboard.lastKey;
                    this.direction = lastDirection;
                    break;
                } else {
                    Keyboard.currentKey = Keyboard.nextKey;
                    this.velocity.x = -Pacman.speed;
                    this.velocity.y = 0;
                    this.direction = Directions.LEFT;
                }
            }

        } else if (Keyboard.nextKey === 'd') {
            lastSpeed = this.velocity.y;

            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];

                if (Collision.circleCollidesWithRectangle({
                    circle: { ...this, velocity: { x: Pacman.speed, y: 0 } },
                    rectangle: boundary
                })) {
                    this.velocity.x = 0;
                    this.velocity.y = lastSpeed;
                    Keyboard.currentKey = Keyboard.lastKey;
                    this.direction = lastDirection;
                    break;
                } else {
                    Keyboard.currentKey = Keyboard.nextKey;
                    this.velocity.x = Pacman.speed;
                    this.velocity.y = 0;
                    this.direction = Directions.RIGHT;
                }
            }

        }

        if (lastDirection != this.direction) {
            switch (this.direction) {
                case Directions.RIGHT:
                    this.img_index = 0;
                    break;
                case Directions.LEFT:
                    this.img_index = 2;
                    break;
                case Directions.UP:
                    this.img_index = 4;
                    break;
                case Directions.DOWN:
                    this.img_index = 6;
                    break;
            }
        }

    }

    initDead() {
        clearInterval(this.intervalId);

        this.img_index = 8;
    }

    nextDeadImg() {
        this.img_index++;
        if (this.img_index % this.images.length == 0) {
            this.img_index = 0;
            return true;
        }

        return false;
    }

    startAnimation() {

        this.img_index = 0;
        this.velocity = {
            x: Pacman.speed,
            y: 0
        };
        this.direction = Directions.RIGHT;

        this.intervalId = setInterval(() => {
            this.img_index % 2 == 1 ? this.img_index-- : this.img_index++;
        }, 100);
    }

    stopAnimation() {
        clearInterval(this.intervalId);
    }
}
