import * as CANNON from 'cannon-es';
import { Quaternion, Vector3 } from 'three';

export const getAngleDegrees = (x: number, y: number): number => {
    var radians = Math.atan2(y, x)
    var degrees = radians * (180 / Math.PI);
    return degrees < 0 ? degrees + 360 : degrees; // ensure positive value
}

export const getAngleDegreesFromAnotherAngle = (x1: number, y1: number, x2: number, y2: number) => {
    var radians = Math.atan2(y2, x2) - Math.atan2(y1, x1);
    var degrees = radians * (180 / Math.PI);
    return degrees < 0 ? degrees + 360 : degrees; // ensure positive value
}

// Thanks to ChatGPT
export const getAngleRadFromQuaternion = (quaternion: CANNON.Quaternion): number => {
    const xAxis = new CANNON.Vec3(1, 0, 0);
    const yAxis = new CANNON.Vec3(0, 1, 0);

    quaternion.vmult(xAxis, xAxis);
    quaternion.vmult(yAxis, yAxis);

    return Math.atan2(xAxis.z, xAxis.x);
}

export const getAngleRadFromQuaternionThree = (quaternion: Quaternion) => {
    const xAxis = new Quaternion(1, 0, 0, 0);
    const yAxis = new Quaternion(0, 1, 0, 0);

    xAxis.multiply(quaternion);
    yAxis.multiply(quaternion);

    return Math.atan2(xAxis.z, xAxis.x);
};