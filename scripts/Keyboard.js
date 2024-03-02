
export class Keyboard {

    static lastKey = 'd';
    static nextKey = 'd';
    static currentKey = 'd'

    constructor() {

    }

    static keydown(key) {
        switch (key.code) {
            case 'KeyW':
            case 'ArrowUp':
                Keyboard.lastKey = Keyboard.currentKey;
                Keyboard.nextKey = 'w';
                break;
            case 'KeyA':
            case 'ArrowLeft':
                Keyboard.lastKey = Keyboard.currentKey;
                Keyboard.nextKey = 'a';
                break;
            case 'KeyS':
            case 'ArrowDown':
                Keyboard.lastKey = Keyboard.currentKey;
                Keyboard.nextKey = 's';
                break;
            case 'KeyD':
            case 'ArrowRight':
                Keyboard.lastKey = Keyboard.currentKey;
                Keyboard.nextKey = 'd';
                break;
        }
    }

    static initKeyboardEvents() {
        window.addEventListener('keydown', Keyboard.keydown);
    }

    static stopKeyboardEvents() {
        window.removeEventListener('keydown', Keyboard.keydown);
    }

    static resetKeyboard() {
        Keyboard.lastKey = 'd';
        Keyboard.nextKey = 'd';
        Keyboard.currentKey = 'd';
    }
}

