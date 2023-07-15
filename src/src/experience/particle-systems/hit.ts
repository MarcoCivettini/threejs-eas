import { v4 as uuidv4 } from 'uuid';
import { BufferGeometry, Float32BufferAttribute, Object3D, Points, PointsMaterial, Scene, Vector3 } from "three";
import { Entity } from "../models/entity";
import { Experience } from "../experience";
import { Component } from "../models/component";

// TODO update models/entity and use an interface otherwise we need to pick between Object3d, Component and Entity
export class HitParticleSystem extends Component {
    
    uuid: string;
    experience: Experience;

    initialVectors: number[] = [];
    desiredVectors: number[] = [];

    geometry: BufferGeometry;
    points: Points;

    scene: Scene;
    effectDuration: number; // in seconds

    constructor(position: Vector3, particlesAmount: number, effectDuration: number, uuid: string = uuidv4()) {
        super(uuid);
        this.uuid = uuid;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.effectDuration = effectDuration;

        for (let i = 0; i < particlesAmount; i++) {
            var sign = Math.random() < 0.5 ? -1 : 1; 
            this.initialVectors.push(
                position.x,
                position.y,
                position.z
            );
            this.desiredVectors.push(
                position.x + (3 + Math.random()) * Math.random() * sign,
                position.y + (3 + Math.random()) * Math.random(),
                position.z
            );
        }

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute('position', new Float32BufferAttribute(this.initialVectors, 3));
        
        const material = new PointsMaterial({ color: 0xff2414, size: .5 });
        this.points = new Points(this.geometry, material);
        this.scene.add(this.points);
    }

    // TODO update to automatically pass the delta
    update() {
        const delta = this.experience.time.clockDelta;
        if (this.effectDuration > 0) {
            const position = this.geometry.getAttribute('position') as Float32BufferAttribute;
            const vertices = position.array as number[];
            const iterations = vertices.length / 3;

            for (let i = 0; i < iterations; i++) {
                const xi = i * 3;
                const yi = i * 3 + 1;

                // TODO verify the multiplier to be used
                vertices[xi] += ( this.desiredVectors[xi] ) * 1 * delta;
                vertices[yi] += ( this.desiredVectors[yi] ) * 1 * delta;
            }
            
            position.needsUpdate = true;
            this.effectDuration -= delta ;
        }
        else {
            const parent = this.getParent();
            parent?.unregisterComponent(this.uuid);

            this.scene.remove(this.points);
        }
    }

    destroy() {
        this.scene.remove(this.points);
    }
}