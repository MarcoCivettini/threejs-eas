import { InputState } from "../models/input-state";
import { EventHandler } from "../utils/event-handler";
import EventEmitter from "../utils/eventEmitter";

export class AiInputController implements InputState {
    left: boolean = false;
    right: boolean = false;
    up: boolean = false;
    down: boolean = false;
    run: boolean = false;

    constructor() {
        EventHandler.register('ai:up').subscribe((val: boolean) => this.up = val)
        EventHandler.register('ai:down').subscribe((val: boolean) => this.down = val)
        EventHandler.register('ai:left').subscribe((val: boolean) => this.left = val)
        EventHandler.register('ai:right').subscribe((val: boolean) => this.right = val)
    }

}