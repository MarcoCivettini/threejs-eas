import { ArrowHelper, Intersection, Raycaster, Vector3 } from 'three';
import { AnimationComponentName, AttackComponentName } from '../constants/components';
import { Component } from "../models/component";
import { EventHandler } from '../utils/event-handler';
import { getAngleRadFromQuaternion } from '../utils/angle';
import { Experience } from '../experience';
import { AnimationComponent } from './animation-component';


export class AttackComponent extends Component {
    private experience = new Experience();
    private scene = this.experience.scene;
    private entityManager = this.experience.entityManager;
    private attackAnimationName?: string;

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

}