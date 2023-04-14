import * as CANNON from 'cannon-es';
import { Euler, Quaternion, Vector3 } from 'three';

export default class BasicCharacterControllerInput {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    run: boolean;
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.run = false;

        window.addEventListener("keydown", (event) => this.keyDown(event.key));
        window.addEventListener("keyup", (event) => this.keyUp(event.key));
    }

    keyUp(key: string) {
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

    keyDown(key: string) {
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
        const leftTorque = new CANNON.Vec3(0, Math.PI / 2, 0);
        const rightTorque = new CANNON.Vec3(5, -5, 0);
        const bodyQuaternion = new Quaternion();
        // let targetAngle = this.model.quaternion.y;

        if (this.inputState.left || this.inputState.right || this.inputState.up || this.inputState.down) {
            if (this.inputState.left) xSpeed -= this.speed; // Left arrow
            if (this.inputState.up) zSpeed -= this.speed; // Up arrow
            if (this.inputState.right) xSpeed += this.speed; // Right arrow
            if (this.inputState.down) zSpeed += this.speed; // Down arrow

            if (xSpeed || zSpeed) {
                const targetAngle = Math.atan2(-xSpeed, -zSpeed);
                if (this.model.velocity.z === 0 && this.model.velocity.x === 0) {
                    this.model.applyImpulse(new CANNON.Vec3(xSpeed, 0, zSpeed));
                } else {
                    this.model.velocity.x = xSpeed;
                    this.model.velocity.z = zSpeed;
                }

                // var q1 = new CANNON.Quaternion();
                // var v1 = new CANNON.Vec3( 0, 1, 0 );
                // q1.setFromAxisAngle(v1,Math.PI * Math.random());
                // this.model.quaternion.set(q1.x,q1.y,q1.z,q1.w);

                // if(this.inputState.up){
                //     const torque = new CANNON.Vec3(0, 0, Math.PI)
                //     this.model.applyTorque(torque);
                    
                //     // this.model.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), 0);
                // }
                // if(this.inputState.left){
                //     console.log(this.model.position.y ,Math.PI/ 2)
                //     if(this.model.quaternion.y < Math.PI / 2){
                //     const torque = new CANNON.Vec3(0, 100, 0)
                //     this.model.applyTorque(torque);
                //     }

                    // this.model.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/ 2);
                // }
                // if(this.inputState.down){
                //     this.model.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI);
                // }
                // if(this.inputState.right){
                //     this.model.quaternion.setFromAxisAngle(new CANNON.Vec3(0,-1,0), Math.PI / 2);
                // }

                // this.model.velocity.x += xSpeed;
                // this.model.velocity.z += zSpeed;
            var angleDiff = targetAngle - this.model.quaternion.y;
            angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

                this.model.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), targetAngle);
            //     this.model.applyForce()
            // //   this.model.rotation.y += angleDiff * this.rotationSmoothing;
         }


        } else {
            this.model.velocity.x = 0;
            this.model.velocity.z = 0;
        }
    }
}