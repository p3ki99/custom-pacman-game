const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
    }

}