import { MathUtils, Quaternion, Vector3 } from "three";
import { Component } from "../models/component";
import { getAngleDegreesFromAnotherAngle } from "../utils/angle";
import * as CANNON from 'cannon-es';
import { InputState } from "../models/input-state";


export class ChartacterController extends Component {
    private inputState?: InputState;
    private speed: number;
    constructor(speed: number) {
        super('characterController')
        this.speed = speed;
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
                // const targetAngleDeg = this.getAngleDegrees(xSpeed, -zSpeed);
                const targetAngleDeg = getAngleDegreesFromAnotherAngle(0, 1, xSpeed, -zSpeed);
                const targetAngleRad = MathUtils.degToRad(targetAngleDeg);

                if (parent.physicsBody.velocity.z === 0 && parent.physicsBody.velocity.x === 0) {
                    parent.physicsBody.applyImpulse(new CANNON.Vec3(xSpeed, 0, zSpeed));
                } else {
                    parent.physicsBody.velocity.x = xSpeed;
                    parent.physicsBody.velocity.z = zSpeed;
                }

                // var angleDiff = targetAngle - parent.physicsBody.quaternion.y;
                // angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

                var qy = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetAngleRad);
                parent.physicsBody.quaternion.copy(qy as any);
            }


        } else {
            parent.physicsBody.velocity.x = 0;
            parent.physicsBody.velocity.z = 0;
        }
    }
}

