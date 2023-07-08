import { Clock } from "three";
import EventEmitter from "./eventEmitter";

export default class Time extends EventEmitter {
    start: number;
    current: any;
    elapsed: number;
    delta: number;
    clock: Clock;
    clockDelta: number;

    constructor() {
        super();

        this.clock = new Clock();
        this.clockDelta = this.clock.getDelta();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16; // Default fps screen

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.clockDelta = this.clock.getDelta(); 
        this.current = currentTime;
        this.elapsed = this.current  - this.start;
        this.trigger('tick');
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}