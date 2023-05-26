import { MathUtils, Quaternion, Vector3 } from "three";
import { Component } from "../models/component";
import { getAngleDegreesFromAnotherAngle } from "../utils/angle";
import * as CANNON from 'cannon-es';
import { InputState } from "../models/input-state";


export class ChartacterController extends Component {
    private inputState?: InputState;
    private speed: number;
    private targetVelocity = new CANNON.Vec3();
    private currentVelocity = new CANNON.Vec3();
    private targetPosition = new Vector3();
    private targetQuaternion = new Quaternion();
    private currentQuaternion = new Quaternion();
    private readonly rotationSpeed: number = 0.08;
    constructor(speed: number) {
        super('characterController')
        this.speed = speed;
    }

    protected onRegistration(): void {
        const parent = this.getParent() as any;

        this.targetPosition.copy(parent.physicsBody.position)
            .add(new Vector3(0, 0, 0));

        this.currentQuaternion.copy(parent.physicsBody.quaternion);
        this.targetQuaternion.copy(parent.physicsBody.quaternion);
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
                this.setVelocity(parent, xSpeed, zSpeed);
                this.SmoothRotation(parent, xSpeed, zSpeed)
            }


        } else {
            parent.physicsBody.velocity.x = 0;
            parent.physicsBody.velocity.z = 0;
        }
    }

    private setVelocity(parent: any, xSpeed: number, zSpeed: number): void {
        this.targetVelocity.set(xSpeed, parent.physicsBody.velocity.y, zSpeed);

        // Interpolate the current velocity towards the target
        this.currentVelocity.lerp(this.targetVelocity, this.rotationSpeed, this.currentVelocity);
        // Update the physics body's velocity
        parent.physicsBody.velocity.copy(this.currentVelocity);
        parent.physicsBody.applyImpulse(this.currentVelocity);
    }

    private SmoothRotation(parent: any, xSpeed: number, zSpeed: number): void {
        const targetAngleDeg = getAngleDegreesFromAnotherAngle(0, 1, xSpeed, -zSpeed);
        const targetAngleRad = MathUtils.degToRad(targetAngleDeg);
        this.targetQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), targetAngleRad);
        this.currentQuaternion = new Quaternion().slerpQuaternions(this.currentQuaternion, this.targetQuaternion, this.rotationSpeed);
        parent.physicsBody.quaternion.copy(this.currentQuaternion);
    }
}

