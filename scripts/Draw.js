import { createImage } from "./maps.js";

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class Draw {

    constructor() {
        this.context = context;

        this.pacmanImg = createImage('images/pacman/pacman_left2.png');
    }

    drawLevelTitle(title, x, y, fillStyle = 'yellow') {
        this.context.fillStyle = fillStyle
        this.context.textAlign = 'center'
        this.context.font = "30px Arial"
        this.context.fillText(title, x, y);
    }

    drawElements(elements) {
        elements.forEach(element => {
            element.draw();
        });
    }

    drawGameOver(x, y, score) {
        this.context.fillStyle = 'red'
        this.context.textAlign = 'center'
        this.context.font = "40px Arial"
        this.context.fillText("GAME OVER :(", x, y + 25);
        this.context.fillText("FINAL SCORE: " + score, x, y + 125);
    }

    drawWin(x, y, score, bonus) {
        this.context.fillStyle = 'yellow'
        this.context.textAlign = 'center'
        this.context.font = "30px Arial"
        this.context.fillText("CONGRATULATIONS!", x, y);
        this.context.fillText("SCORE: " + score, x, y + 100);
        this.context.fillText("BONUS: " + bonus, x, y + 150);
        this.context.fillText("FINAL SCORE: " + (score + bonus), x, y + 200);
    }

    drawHeader(score, lifes, difficulty) {
        this.context.fillStyle = 'yellow'
        this.context.font = "45px Arial"
        this.context.textAlign = 'left';
        this.context.fillText("Score: " + score, 10, 40);

        for (let i = 0; i < lifes - 1; i++) {
            this.context.drawImage(this.pacmanImg, 10 + i * 50, 55, 40, 40);
        }

        const width = canvas.width;
        this.context.textAlign = 'center';
        this.context.font = "40px Arial"
        this.context.fillText("Difficulty: " + difficulty, width - 160, 40);

        this.context.font = "60px Arial"
        this.context.fillText("PACMAN", width / 2, 70);
    }

    drawWhiteBackground() {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, canvas.width, canvas.height);
    }

}