import { Wall } from "./Wall.js";
import { Directions, Mode } from "./Ghost.js";

export class DirectionChooser {
    static game;
    static level;

    static chooseDirectionForGhost(ghost, possibleDirections) {
        const pacman = DirectionChooser.level.pacman;

        if (ghost.mode == Mode.DEAD) {
            return DirectionChooser.lowestDistance(ghost, { position: DirectionChooser.level.startPositions.pinky }, possibleDirections)
        } else if (ghost.mode == Mode.SCARED) {
            return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        } else if (ghost.mode == Mode.HOME) {
            return DirectionChooser.lowestDistance(ghost, { position: DirectionChooser.level.startPositions.blinky }, possibleDirections)

        }

        if (DirectionChooser.game.difficulty === 'easy') {
            return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        } else if (DirectionChooser.game.difficulty === 'medium') {

            switch (ghost.name) {
                case 'Blinky':
                    return DirectionChooser.lowestDistance(ghost, pacman, possibleDirections);
                case 'Pinky':
                    return this.pacmanDirectionWithOffset(ghost, pacman, possibleDirections, 5);
                case 'Inky':
                    return this.pacmanRandomDirectionWithOffset(ghost, pacman, possibleDirections, 3);
                default:
                    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            }


        } else {
            switch (ghost.name) {
                case 'Blinky':
                    return DirectionChooser.lowestDistance(ghost, pacman, possibleDirections);
                case 'Pinky':
                    return this.pacmanDirectionWithOffset(ghost, pacman, possibleDirections, 5);
                case 'Inky':
                    return this.pacmanRandomDirectionWithOffset(ghost, pacman, possibleDirections, 3);
                case 'Clyde':
                    return this.pacmanRandomDirectionWithOffset(ghost, pacman, possibleDirections, 2);
            }
        }

    }


    static lowestDistance(ghost, target, possibleDirections) {
        const target_position = target.position;
        const ghost_position = ghost.position;

        const distX = Math.abs(target_position.x - ghost_position.x);
        const distY = Math.abs(target_position.y - ghost_position.y);

        if (distX >= distY) {

            if (target_position.x > ghost_position.x) {
                if (possibleDirections.includes(Directions.RIGHT)) {
                    return Directions.RIGHT;
                }
            }

            if (target_position.x < ghost_position.x) {
                if (possibleDirections.includes(Directions.LEFT)) {
                    return Directions.LEFT;
                }
            }
        }

        if (target_position.y > ghost_position.y) {
            if (possibleDirections.includes(Directions.DOWN)) {
                return Directions.DOWN;
            }
        }

        if (target_position.y <= ghost_position.y) {
            if (possibleDirections.includes(Directions.UP)) {
                return Directions.UP;
            }
        }

        if (target_position.x > ghost_position.x) {
            if (possibleDirections.includes(Directions.RIGHT)) {
                return Directions.RIGHT;
            }
        }

        if (target_position.x < ghost_position.x) {
            if (possibleDirections.includes(Directions.LEFT)) {
                return Directions.LEFT;
            }
        }
        
        return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    }

    static pacmanDirectionWithOffset(ghost, pacman, possibleDirections, offset) {
        const target = {
            position: {
                x: pacman.position.x,
                y: pacman.position.y
            }
        }

        switch (pacman.direction) {
            case Directions.UP:
                target.position.y -= Wall.height * offset;
                break;
            case Directions.DOWN:
                target.position.y += Wall.height * offset;
                break;
            case Directions.LEFT:
                target.position.x -= Wall.width * offset;
                break;
            case Directions.RIGHT:
                target.position.x += Wall.width * offset;
                break;
        }


        return DirectionChooser.lowestDistance(ghost, target, possibleDirections)
    }

    static pacmanRandomDirectionWithOffset(ghost, pacman, possibleDirections, offset) {
        const target = {
            position: {
                x: pacman.position.x,
                y: pacman.position.y
            }
        }

        const rnd = Math.floor(Math.random() * 4);

        switch (rnd) {
            case 0:
                target.position.y -= Wall.height * offset;
                break;
            case 1:
                target.position.y += Wall.height * offset;
                break;
            case 2:
                target.position.x -= Wall.width * offset;
                break;
            case 3:
                target.position.x += Wall.width * offset;
                break;
        }

        return DirectionChooser.lowestDistance(ghost, target, possibleDirections)
    }
}