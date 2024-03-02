
export class SoundManager {

    constructor() {

    }

    static pacmanChompSound() {
        new Audio('sounds/pacman_chomp.wav').play();
    }

    static startGameSound() {
        new Audio('sounds/pacman_intermission.wav').play();
    }

    static eatGhostSound() {
        new Audio('sounds/pacman_eatghost.wav').play();
    }

    static pacmanDeathSound() {
        new Audio('sounds/pacman_death.wav').play();
    }
}