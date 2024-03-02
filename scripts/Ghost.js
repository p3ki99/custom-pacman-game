import { Wall } from "./Wall.js";

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class Ghost {
    static speed = 5;

    constructor({ name, position, velocity, color, direction, images, mode }) {
        this.name = name;
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.direction = direction;
        this.images = images;
        this.img_index = 0;
        this.mode = mode;

        this.radius = Wall.width / 2;
        this.speed = Ghost.speed;
        this.scared = false;

        this.intervalId = 0;
        this.startAnimation();

        this.scaredAnimation = 0;

        this.inter1 = 0;
        this.inter2 = 0;
    }

    draw() {
        context.drawImage(this.images[this.img_index], this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    setMode(mode) {
        switch (mode) {
            case Mode.NORMAL:
                this.speed = Ghost.speed;
                this.fixPosition();
                break;
            case Mode.SCARED:
                this.speed = 3;
                this.fixPosition();
                this.reverseDirection();
                this.img_index = 8;
                clearTimeout(this.scaredAnimation);
                clearTimeout(this.inter1);
                clearInterval(this.inter2);

                this.inter1 = setTimeout(() => {
                    this.inter2 = setInterval(() => {
                        this.img_index = (this.img_index == 8 || this.img_index == 9) ? 14 : 8;
                    }, 250);
                }, 2500);
                this.scaredAnimation = setTimeout(() => {
                    this.setMode(Mode.NORMAL);
                    this.reverseDirection();
                    clearTimeout(this.inter1);
                    clearInterval(this.inter2);
                }, 5000);


                break;
            case Mode.DEAD:
                clearTimeout(this.scaredAnimation);
                clearTimeout(this.inter1);
                clearInterval(this.inter2);
                this.speed = 10;
                this.fixPosition();
                this.mode = mode;
                this.reverseDirection();
                // clearInterval(this.intervalId);

                break;
            case Mode.HOME:
                this.speed = Ghost.speed;
                this.fixPosition();
                // this.reverseDirection();
                break;
        }

        this.mode = mode;
    }

    startAnimation() {
        this.intervalId = setInterval(() => {
            if (this.mode == Mode.NORMAL || this.mode == Mode.SCARED || this.mode == Mode.HOME) this.img_index % 2 == 1 ? this.img_index-- : this.img_index++;
            else if (this.mode == Mode.DEAD) {

            }
        }, 250);
    }

    stopAnimation() {
        clearInterval(this.intervalId);
        clearTimeout(this.scaredAnimation);
        clearTimeout(this.inter1);
        clearInterval(this.inter2);
    }

    changeDirection(direction) {

        // clearInterval(this.intervalId);

        switch (direction) {
            case Directions.DOWN:
                this.velocity.y = this.speed;
                this.velocity.x = 0;
                if (this.mode == Mode.NORMAL || this.mode == Mode.HOME) this.img_index = 6;
                else if (this.mode == Mode.DEAD) this.img_index = 13;
                break;
            case Directions.UP:
                this.velocity.y = -this.speed;
                this.velocity.x = 0;
                if (this.mode == Mode.NORMAL || this.mode == Mode.HOME) this.img_index = 4;
                else if (this.mode == Mode.DEAD) this.img_index = 12;
                break;
            case Directions.RIGHT:
                this.velocity.y = 0;
                this.velocity.x = this.speed;
                if (this.mode == Mode.NORMAL || this.mode == Mode.HOME) this.img_index = 0;
                else if (this.mode == Mode.DEAD) this.img_index = 10;
                break;
            case Directions.LEFT:
                this.velocity.y = 0;
                this.velocity.x = -this.speed;
                if (this.mode == Mode.NORMAL || this.mode == Mode.HOME) this.img_index = 2;
                else if (this.mode == Mode.DEAD) this.img_index = 11;
                break;
        }

        this.direction = direction;
    }

    reverseDirection() {
        if (this.direction == Directions.UP) this.changeDirection(Directions.DOWN);
        else if (this.direction == Directions.DOWN) this.changeDirection(Directions.UP);
        else if (this.direction == Directions.LEFT) this.changeDirection(Directions.RIGHT);
        else if (this.direction == Directions.RIGHT) this.changeDirection(Directions.LEFT);
    }

    fixPosition() {

        if (this.position.x % this.speed != 0) {
            this.position.x += this.speed - this.position.x % this.speed;
        }

        if (this.position.y % this.speed != 0) {
            this.position.y += this.speed - this.position.y % this.speed;
        }

    }
}

export const Directions = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

export const Mode = {
    NORMAL: 0,
    SCARED: 1,
    DEAD: 2,
    HOME: 3
}