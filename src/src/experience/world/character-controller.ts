import { MathUtils, Quaternion, Vector3 } from "three";
import { Component } from "../models/component";
import { getAngleDegrees, getAngleDegreesFromAnotherAngle } from "../utils/angle";
import * as CANNON from 'cannon-es';
import { InputState } from "../models/input-state";


export class ChartacterController extends Component {
    private inputState?: InputState;
    private speed: number;
    currentAngleRad: number = 0;
    currentPosition = new Vector3();
    targetPosition = new Vector3();
    targetVelocity = new CANNON.Vec3();
    currentVelocity = new CANNON.Vec3();
    constructor(speed: number) {
        super('characterController')
        this.speed = speed;


    }

    protected onRegistration(): void {
        const parent = this.getParent() as any;

        this.targetPosition.copy(parent.physicsBody.position)
            .add(new Vector3(0, 0, 0));
    }

    withInputController(inputController: InputState): this {
        this.inputState = inputController;
        return this;
    }

    update() {
        this.move();
    }

    private move(): void {
        if (!this.inputState) { return; }

        const parent = this.getParent() as any;

        let xSpeed = 0;
        let zSpeed = 0;

        if (this.inputState.left || this.inputState.right || this.inputState.up || this.inputState.down) {
            if (this.inputState.left) xSpeed -= this.speed; // Left arrow
            if (this.inputState.up) zSpeed -= this.speed; // Up arrow
            if (this.inputState.right) xSpeed += this.speed; // Right arrow
            if (this.inputState.down) zSpeed += this.speed; // Down arrow

            if (xSpeed || zSpeed) {
                this.targetVelocity.set(xSpeed, parent.physicsBody.velocity.y, zSpeed);


                // const velocityDiff = this.targetVelocity.vsub(this.currentVelocity);

                // Define the interpolation factor (adjust as needed)
                const interpolationFactor = 0.08;

                // Interpolate the current velocity towards the target
                this.currentVelocity.lerp(this.targetVelocity, interpolationFactor, this.currentVelocity);


                // Update the physics body's velocity
                parent.physicsBody.velocity.copy(this.currentVelocity);
                parent.physicsBody.applyImpulse(this.currentVelocity);


                // if (parent.physicsBody.velocity.z === 0 && parent.physicsBody.velocity.x === 0) {
                //     parent.physicsBody.applyImpulse(new CANNON.Vec3(xSpeed, 0, zSpeed));
                // } else {
                //     parent.physicsBody.velocity.x = xSpeed;
                //     parent.physicsBody.velocity.z = zSpeed;
                // }


                // const targetAngleDeg = this.getAngleDegrees(xSpeed, -zSpeed);
                const targetAngleDeg = getAngleDegreesFromAnotherAngle(0, 1, xSpeed, -zSpeed);
                const targetAngleRad = MathUtils.degToRad(targetAngleDeg);


                // if (!this.currentAngleRad) {
                //     this.currentAngleRad = parent.physicsBody.quaternion.y;

                // }

                // Calculate the rotation difference between the current and target angles
                let angleDiff = targetAngleRad - this.currentAngleRad;

                // Normalize the angle difference to be between -π and π
                angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
                console.log(angleDiff);
                // Define the rotation speed (adjust as needed)
                const rotationSpeed = 0.08;

                // Gradually rotate towards the target angle
                if (Math.abs(angleDiff) > rotationSpeed) {
                    const rotationDirection = angleDiff > 0 ? 1 : -1;
                    console.log(rotationSpeed * rotationDirection)
                    this.currentAngleRad += rotationSpeed * rotationDirection;
                } else {
                    this.currentAngleRad = targetAngleRad;
                }

                var qy = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.currentAngleRad);
                parent.physicsBody.quaternion.copy(qy as any);
            }


        } else {
            parent.physicsBody.velocity.x = 0;
            parent.physicsBody.velocity.z = 0;
        }
    }
}

