import * as CANNON from 'cannon-es';

export default class BasicCharacterControllerInput {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.run = false;

        window.addEventListener("keydown", (event) => this.keyDown(event.key));
        window.addEventListener("keyup", (event) => this.keyUp(event.key));
    }

    keyUp(key) {
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

    keyDown(key) {
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
        }
    }
}

export class BasicCharacterController {
    constructor(params) {
        this.params = params;
        this.model = params.model;
        this.speed = params.speed;
        this.rotationSmoothing = params.rotationSmoothing;
        this.inputState = new BasicCharacterControllerInput();
    }

    update() {
        let xSpeed = 0;
        let zSpeed = 0;
        // let targetAngle = this.model.rotation.y;

        if (this.inputState.left || this.inputState.right || this.inputState.up || this.inputState.down) {
            if (this.inputState.left) xSpeed -= this.speed; // Left arrow
            if (this.inputState.up) zSpeed -= this.speed; // Up arrow
            if (this.inputState.right) xSpeed += this.speed; // Right arrow
            if (this.inputState.down) zSpeed += this.speed; // Down arrow

            if (xSpeed || zSpeed) {
                // targetAngle = Math.atan2(-xSpeed, -zSpeed);
                if (this.model.velocity.z === 0 && this.model.velocity.x === 0) {
                    this.model.applyImpulse(new CANNON.Vec3(xSpeed, 0, zSpeed));
                } else {
                    this.model.velocity.x = xSpeed;
                    this.model.velocity.z = zSpeed;
                }
                // this.model.velocity.x += xSpeed;
                // this.model.velocity.z += zSpeed;
            }

            // var angleDiff = targetAngle - this.model.rotation.y;
            // angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

            //   this.model.rotation.y += angleDiff * this.rotationSmoothing;
        } else {
            this.model.velocity.x = 0;
            this.model.velocity.z = 0;
        }
    }
}