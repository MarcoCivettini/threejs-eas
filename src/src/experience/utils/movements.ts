import * as CANNON from 'cannon-es';
import { MathUtils, Quaternion, Vector3 } from 'three';
import { EventHandler } from './event-handler';
import { getAngleDegreesFromAnotherAngle } from './angle';

export default class BasicCharacterControllerInput {
    left = false;
    right = false;
    up = false;
    down = false;
    run = false;
    constructor() {
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));
    }

    keyUp(event: KeyboardEvent) {
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

    keyDown(event: KeyboardEvent) {
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

export class BasicCharacterController {
    params: any;
    model: CANNON.Body;
    speed: any;
    rotationSmoothing: any;
    inputState: BasicCharacterControllerInput;
    constructor(params: any) {
        this.params = params;
        this.model = params.model;
        this.speed = params.speed;
        this.rotationSmoothing = params.rotationSmoothing;
        this.inputState = new BasicCharacterControllerInput();
    }

    update() {
        this.moveFromKeyboard();
    }

    private moveFromKeyboard(): void {
        let xSpeed = 0;
        let zSpeed = 0;

        if (this.inputState.left || this.inputState.right || this.inputState.up || this.inputState.down) {
            if (this.inputState.left) xSpeed -= this.speed; // Left arrow
            if (this.inputState.up) zSpeed -= this.speed; // Up arrow
            if (this.inputState.right) xSpeed += this.speed; // Right arrow
            if (this.inputState.down) zSpeed += this.speed; // Down arrow

            if (xSpeed || zSpeed) {
                // const targetAngleDeg = this.getAngleDegrees(xSpeed, -zSpeed);
                const targetAngleDeg = getAngleDegreesFromAnotherAngle(0, 1, xSpeed, -zSpeed);
                const targetAngleRad = MathUtils.degToRad(targetAngleDeg);

                if (this.model.velocity.z === 0 && this.model.velocity.x === 0) {
                    this.model.applyImpulse(new CANNON.Vec3(xSpeed, 0, zSpeed));
                } else {
                    this.model.velocity.x = xSpeed;
                    this.model.velocity.z = zSpeed;
                }
                
                // var angleDiff = targetAngle - this.model.quaternion.y;
                // angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

                var qy = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetAngleRad);
                this.model.quaternion.copy(qy as any);
            }


        } else {
            this.model.velocity.x = 0;
            this.model.velocity.z = 0;
        }
    }
}