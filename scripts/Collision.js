import { Wall } from "./Wall.js";
import { Directions, Mode } from "./Ghost.js";
import { SoundManager } from "./SoundManager.js";
import { DirectionChooser } from "./DirectionChooser.js";
import { Level } from "./Level.js";

export class Collision {

    static circleCollidesWithRectangle({ circle, rectangle }) {
        return (
            circle.position.y - circle.radius + circle.velocity.y < rectangle.position.y + rectangle.height &&
            circle.position.y + circle.radius + circle.velocity.y > rectangle.position.y &&
            circle.position.x + circle.radius + circle.velocity.x > rectangle.position.x &&
            circle.position.x - circle.radius + circle.velocity.x < rectangle.position.x + rectangle.width
        )
    }

    static checkCollisionPacmanWithBoundaries(pacman, boundaries) {
        boundaries.forEach(boundary => {

            if (
                Collision.circleCollidesWithRectangle({
                    circle: pacman,
                    rectangle: boundary
                })
            ) {
                pacman.velocity.x = 0;
                pacman.velocity.y = 0;
            }
        })
    }

    static checkCollisionPacmanWithPellets(pacman, pellets, game) {
        for (let i = pellets.length - 1; i >= 0; i--) {
            const pellet = pellets[i];

            if (Math.hypot(pellet.position.x - pacman.position.x, pellet.position.y - pacman.position.y) < pellet.radius + pacman.radius) {
                pellets.splice(i, 1);
                game.score += 10;
                SoundManager.pacmanChompSound();
            }
        }

    }

    static checkCollisionPacmanWithPowerUps(pacman, powerUps, game, ghosts) {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];

            if (Math.hypot(powerUp.position.x - pacman.position.x, powerUp.position.y - pacman.position.y) < powerUp.radius + pacman.radius) {
                powerUps.splice(i, 1);

                game.score += 50;
                ghosts.forEach(ghost => {
                    if (ghost.mode != Mode.DEAD && ghost.mode != Mode.HOME) ghost.setMode(Mode.SCARED);
                });
            }
        }

    }

    static checkCollisionPacmanWithGhosts(pacman, ghosts, level, game) {

        for (let i = ghosts.length - 1; i >= 0; i--) {
            const ghost = ghosts[i];

            if (Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius) {

                if (ghost.mode == Mode.SCARED) {
                    ghost.setMode(Mode.DEAD);
                    game.score += 50;
                    SoundManager.eatGhostSound();
                } else if (ghost.mode == Mode.NORMAL || ghost.mode == Mode.HOME) {
                    level.died = true;
                    SoundManager.pacmanDeathSound();
                }

            }
        }
    }

    static checkPacmanLeftMap(pacman, map) {
        if (pacman.position.x < 0) {
            pacman.position.x = map[0].length * Wall.width;
        } else if (pacman.position.x > map[0].length * Wall.width) {
            pacman.position.x = 0;
        }

        if (pacman.position.y < 0 + Level.header_height) {
            pacman.position.y = Level.header_height + map.length * Wall.height;
        } else if (pacman.position.y > map.length * Wall.height + Level.header_height) {
            pacman.position.y = Level.header_height;
        }
    }

    static checkCollisionGhostsWithBoundaries(ghosts, boundaries, door) {

        ghosts.forEach(ghost => {

            const collisions = [];

            switch (ghost.direction) {
                case Directions.UP:
                    collisions.push(Directions.DOWN);
                    break;
                case Directions.DOWN:
                    collisions.push(Directions.UP);
                    break;
                case Directions.LEFT:
                    collisions.push(Directions.RIGHT);
                    break;
                case Directions.RIGHT:
                    collisions.push(Directions.LEFT);
                    break;
            }


            boundaries.forEach(boundary => {

                if (!collisions.includes(Directions.RIGHT) && this.circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: { x: ghost.speed, y: 0 } },
                    rectangle: boundary
                })) {
                    collisions.push(Directions.RIGHT);
                }

                if (!collisions.includes(Directions.LEFT) && this.circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: { x: -ghost.speed, y: 0 } },
                    rectangle: boundary
                })) {
                    collisions.push(Directions.LEFT);
                }

                if (!collisions.includes(Directions.UP) && this.circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: { x: 0, y: -ghost.speed } },
                    rectangle: boundary
                })) {

                    if (boundary == door && (ghost.mode == Mode.DEAD || ghost.mode == Mode.HOME)) {

                    }
                    else collisions.push(Directions.UP);
                }

                if (!collisions.includes(Directions.DOWN) && this.circleCollidesWithRectangle({
                    circle: { ...ghost, velocity: { x: 0, y: ghost.speed } },
                    rectangle: boundary
                })) {
                    if (boundary == door && (ghost.mode == Mode.DEAD || ghost.mode == Mode.HOME)) {

                    }
                    else collisions.push(Directions.DOWN);
                }

            });

            let possibleDirections = [Directions.UP, Directions.DOWN, Directions.RIGHT, Directions.LEFT];

            possibleDirections = possibleDirections.filter(direction => {
                return !collisions.includes(direction);
            });

            const direction = DirectionChooser.chooseDirectionForGhost(ghost, possibleDirections);

            if (direction == undefined) {
                ghost.reverseDirection();
            }

            else if (ghost.direction != direction) {
                ghost.changeDirection(direction);
            }

        });
    }

    static checkCollisionGhostWithStartPosition(ghosts, startPositions) {

        ghosts.forEach(ghost => {
            if (ghost.mode == Mode.DEAD && ghost.position.x == startPositions.pinky.x && ghost.position.y == startPositions.pinky.y) {
                ghost.setMode(Mode.HOME);
            } else if (ghost.mode == Mode.HOME && ghost.position.x == startPositions.blinky.x && ghost.position.y == startPositions.blinky.y) {
                ghost.setMode(Mode.NORMAL);
            }

        });
    }

    static checkCollisionGostsWithDoor(ghosts, door) {
        ghosts.forEach(ghost => {

            if (
                Collision.circleCollidesWithRectangle({
                    circle: ghost,
                    rectangle: door
                })
            ) {

            }

            if (ghost.mode == Mode.DEAD && ghost.position.x == startPositions.pinky.x && ghost.position.y == startPositions.pinky.y) {
                ghost.setMode(Mode.HOME);
            } else if (ghost.mode == Mode.HOME && ghost.position.x == startPositions.blinky.x && ghost.position.y == startPositions.blinky.y) {
                ghost.setMode(Mode.NORMAL);
            }

        });
    }

    static checkGhostsLeftMap(ghosts, map) {

        ghosts.forEach(ghost => {
            if (ghost.position.x < 0) {
                ghost.position.x = map[0].length * Wall.width;
            } else if (ghost.position.x > map[0].length * Wall.width) {
                ghost.position.x = 0;
            }

            if (ghost.position.y < 0 + Level.header_height) {
                ghost.position.y = Level.header_height + map.length * Wall.height;
            } else if (ghost.position.y > map.length * Wall.height + Level.header_height) {
                ghost.position.y = Level.header_height;
            }
        });

    }

}