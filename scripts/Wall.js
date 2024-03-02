const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export class Wall {
    static width = 60;
    static height = 60;

    constructor( { position, image } ) {
        this.position = position
        this.width = Wall.width;
        this.height = Wall.height;
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

}