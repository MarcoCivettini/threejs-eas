import { InputState } from "../models/input-state";
import { EventHandler } from "../utils/event-handler";

export class KeyboardInputController implements InputState {
    left: boolean = false;
    right: boolean = false;
    up: boolean = false;
    down: boolean = false;
    run: boolean = false;

    constructor() {
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));
    }

    private keyUp(event: KeyboardEvent) {
        event.preventDefault();
        const key = event.key;
        switch (key.toLowerCase()) {
            case 'a': // left arrow
                this.left = false;
                break;
            case 'w': // up arrow
                this.up = false;
                break;
            case 'd': // right arrow
                this.right = false;
                break;
            case 's': // down arrow
                this.down = false;
                break;
            case 'shift':
                this.run = false;
                break;
        }
    }

    private keyDown(event: KeyboardEvent) {
        event.preventDefault();
        const key = event.key;
        switch (key.toLowerCase()) {
            case 'a': // left arrow
                this.left = true;
                break;
            case 'w': // up arrow
                this.up = true;
                break;
            case 'd': // right arrow
                this.right = true;
                break;
            case 's': // down arrow
                this.down = true;
                break;
            case 'shift':
                this.run = true;
                break;
            case ' ':
                EventHandler.emit('attack');
                break;
        }
    }
}