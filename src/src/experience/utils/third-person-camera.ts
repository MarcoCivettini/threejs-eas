import { Vector3 } from 'three';
import {Experience} from '../experience';

export class ThirdPersonCamera {
    expirience: any;
    time: any;
    model: any;
    camera: any;
    modelPreviousPosition: Vector3;
    currentPosition: Vector3;
    constructor(params: any) {
        this.expirience = new Experience();
        this.time = this.expirience.time;
        this.model = params.model;
        this.camera = params.camera;
        this.modelPreviousPosition = new Vector3();
        this.modelPreviousPosition.copy(this.model.position);

        this.currentPosition = this.getCameraOffset();
    }

    update() {

        this.camera.instance.lookAt(this.model.position);
        const idealOffset = this.getCameraOffset();
        const t = 1.0 - Math.pow(0.001, this.time.delta * 0.001);
        this.currentPosition.lerp(idealOffset, t);


        this.camera.instance.position.copy(this.currentPosition);
    }

    getCameraOffset() {
        const idealOffset = new Vector3(0, 5, 13);
        // idealOffset.applyQuaternion(this.model.quaternion);
        idealOffset.add(this.model.position);
        return idealOffset;
    }
}