import { Draw } from "./Draw.js";
import { Level } from "./Level.js";
import { maps } from "./maps.js";
import { showDialog } from "./SaveScore.js";
import { SoundManager } from "./SoundManager.js";

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
    canvas.width = 400;
    canvas.height = 400;
}

initCanvasSize();

export function pauseAnimation(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function pauseAndClear(ms) {
    await pauseAnimation(ms);
    context.clearRect(0, 0, canvas.width, canvas.height);
}

export class Game {

    constructor() {

        this.levels = [];
        for (let i = 0; i < maps.length; i++) this.levels.push(new Level(context, maps[i], this));

        this.lifes = 3;
        this.score = 0;
        this.soundOn = true;
        this.draw = new Draw(context);

        this.difficulty = localStorage.getItem("pacmanDifficulty");
        if (!this.difficulty) this.difficulty = 'easy';

    }


    async start() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.draw.drawLevelTitle("PACMAN GAME", canvas.width / 2, canvas.height / 2);
        SoundManager.startGameSound();
        await pauseAndClear(5500);

        for (let i = 0; i < this.levels.length; i++) {
            initCanvasSize();
            this.draw.drawLevelTitle(`LEVEL ${i + 1}`, canvas.width / 2, canvas.height / 2);
            await pauseAndClear(2000);

            const level = this.levels[i];
            await level.playLevel();

            if (this.lifes == 0) break;
            await pauseAndClear(2000);

        }

        initCanvasSize();

        if (this.lifes == 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            this.draw.drawGameOver(canvas.width / 2, canvas.height / 2 - 100, this.score);
            await pauseAndClear(4000);
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);

            let bonus = 0;
            switch (this.difficulty) {
                case 'easy': bonus = 500; break;
                case 'medium': bonus = 2000; break;
                case 'hard': bonus = 5000; break;
            }
            this.draw.drawWin(canvas.width / 2, canvas.height / 2 - 150, this.score, bonus);

            await pauseAndClear(4000);

            this.score += bonus;
        }

        try {
            localStorage.setItem("score", this.score.toString());
        } catch (e) {
            console.log(e);
        }

        showDialog();
    }
}