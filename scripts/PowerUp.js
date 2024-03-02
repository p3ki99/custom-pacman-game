const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 15;
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }

}