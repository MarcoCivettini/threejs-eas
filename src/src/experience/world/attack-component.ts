import { ArrowHelper, Intersection, Raycaster, Vector3 } from 'three';
import { AnimationComponentName, AttackComponentName } from '../constants/components';
import { Component } from "../models/component";
import { EventHandler } from '../utils/event-handler';
import { getAngleRadFromQuaternion } from '../utils/angle';
import { Experience } from '../experience';
import { AnimationComponent } from './animation-component';
import * as CANNON from 'cannon-es';


export class AttackComponent extends Component {
    private experience = new Experience();
    private physicsWord = this.experience.physicsWold;

    private scene = this.experience.scene;
    private entityManager = this.experience.entityManager;
    private attackAnimationName?: string;

    private attackRange = this.createPhysicsAttackRange();

    constructor() {
        super(AttackComponentName)
    }

    override onRegistration(): void {
        EventHandler.register('attack').subscribe(() => this.attackAction())
    }

    withAnimation(animationName: string): this {
        this.attackAnimationName = animationName;
        return this;
    }

    attackAction(): void {
        // TODO remove any from parent
        const parent = this.getParent() as any;

        if (this.attackAnimationName) {
            const animation = parent.getComponent(AnimationComponentName) as AnimationComponent;
            if (animation.getAnimation(this.attackAnimationName)?.isRunning()) { return; }
            animation.play(this.attackAnimationName);
        }

        const attackLength = 2;
        const raycaster = this.createFrontalRaycaster(parent, attackLength);
        this.addDebugArrow(raycaster, parent.model.position, attackLength);

        const intersects = raycaster.intersectObjects(this.scene.children);
        this.hitAttackableEntities(intersects);
    }

    update(): void {
        const parent = this.getParent() as any;
        if(parent){
        const parentRotationAngle = this.getPrentVisualAngle(parent)
        const positoin = new CANNON.Vec3().copy(parent.physicsBody.position)
        const swordbone = parent.getSwordBone();

    
        positoin.x += parentRotationAngle.x

        positoin.z += parentRotationAngle.z
        // positoin.y += swordbone.position.y;
        // positoin.x -= 0.5;
        // positoin.z -= 0.5;
            // positoin.z += swordbone.position.z;
            // positoin.x += swordbone.position.x;
// console.log(swordbone.position.z);
        const rotation = new CANNON.Quaternion();
        rotation.copy(swordbone.quaternion);
        this.attackRange.position.copy(positoin as any);
        this.attackRange.quaternion.copy(rotation as any);
    }
    }

    private hitAttackableEntities(intersections: Intersection[]): void {
        const attackableEntityIntersected = this.entityManager.entities.filter(e =>
            intersections.find(x => e.mesh.uuid === x.object.uuid && e.instance?.isAttackable)
        );
        attackableEntityIntersected.forEach(x => x.instance?.onHit());

    }

    private getPrentVisualAngle(parent: any): Vector3 {
        const modelRotationRadiant = getAngleRadFromQuaternion(parent.physicsBody.quaternion);
        const xRotation = Math.sin(modelRotationRadiant);
        const zRotation = -Math.cos(modelRotationRadiant);
        return new Vector3(xRotation, 0, zRotation);
    }

    private addDebugArrow(raycaster: Raycaster, position: Vector3, far: number): void {
        const arrow = new ArrowHelper(raycaster.ray.direction, position, far, '#FF0000');
        this.scene.add(arrow);
    }

    private createFrontalRaycaster(parent: any, far: number): Raycaster {
        const parentRotationAngle = this.getPrentVisualAngle(parent);
        const raycaster = new Raycaster();
        raycaster.set(parent.model.position, parentRotationAngle);
        raycaster.far = far;
        return raycaster;
    }


    private createPhysicsAttackRange(): CANNON.Body {
        const shape = new CANNON.Box(new CANNON.Vec3(0.95, 0.05, 0.05));
        // const shape = new CANNON.Box(new CANNON.Vec3(1.5, 0, 1.5));
        var groundBody = new CANNON.Body({
            mass: 0, // Plane is static, so mass is zero
            allowSleep: false,
            collisionResponse: false,
            shape: shape
        });

        groundBody.position.set(0, 0.7, 0); // Set the position of the plane
        groundBody.addEventListener('collide', (e: any) => {
            // if(e.body.id !== this.physicsBody.id){

            console.log('ciao', e)
            // }
            // console.log('player', this.physicsBody);
        }
        );




        this.physicsWord.world.addBody(groundBody);
        return groundBody;
    }

}