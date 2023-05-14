import { AnimationAction, ArrowHelper, LoopOnce, Raycaster } from 'three';
import { Experience } from '../experience';
import { BasicCharacterController } from '../utils/movements';
import * as CANNON from 'cannon-es';
import { Vector3, Mesh, Group, AnimationMixer } from 'three';
import { EventHandler } from '../utils/event-handler';
import { getAngleRadFromQuaternion } from '../utils/angle';
import PhysicsWorld from './physics-word';
import { EntityManager } from './entity-manager';

export default class Player {
    experience: Experience;
    scene: any;
    resources: any;
    playerResource: any;
    time: any;
    debug: any;
    physicsWord: PhysicsWorld;
    speed: number;
    rotationSmoothing: number;
    physicsBody: CANNON.Body;
    characterController: BasicCharacterController;
    model: Mesh;
    animation: any;
    private entityManager: EntityManager;
    // raycaster: Raycaster;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.playerResource = this.resources.items.playerModel;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.physicsWord = this.experience.physicsWold;
        this.entityManager = this.experience.entityManager;
        this.speed = 1;
        this.rotationSmoothing = 0.05;

        // this.model = this.createPlayer(new Vector3(0.5, 1, 0.5));
        this.model = this.createPlayer(new Vector3(0.2, 0.2, 0.2));

        // N.B. quickfix for the player / physics spacing
        const armature = this.model.children[0];
        armature.position.y -= 1.5;

        this.physicsBody = this.createPhysicsBody(this.model);
        this.characterController = new BasicCharacterController({ model: this.physicsBody, speed: this.speed, rotationSmoothing: this.rotationSmoothing });
        this.physicsBody.velocity.x = 1;
        this.scene.add(this.model);

        this.physicsWord.addBody(this.physicsBody, this.model, this);
        this.animation = this.setAnimation();

        EventHandler.register('attack').subscribe(() => this.attackAction())
    }

    update(): void {
        this.animation.mixer.update(this.time.delta * 0.001);
        this.characterController.update();
    }

    attachWeapon(weapon: Group): void {
        // TODO improve this correct bone research
        const bone = this.model.children[0].children[0].children[0].children[0];
        // clear bone from existing items from mesh
        bone.remove(bone.children[1]);
        bone.remove(bone.children[0]);

        // weapon.position.x = 0.75;
        weapon.rotateY(Math.PI / 2);

        bone.add(weapon)
    }

    private createPlayer(dimension: any): Mesh {
        // const textures = this.createTexture();
        // const model = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ map: textures.color, }))
        const model = this.playerResource.scene;
        model?.scale.set(dimension.x, dimension.y, dimension.z);
        model.position.y = 5.5;
        model.position.z = 6;

        model.traverse((child: any) => {
            if (child instanceof Mesh) {
                child.castShadow = true
            }
        })

        return model;
    }

    private createPhysicsBody(mesh: Mesh): CANNON.Body {
        const shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({
            mass: 50,
            shape,
            material: this.physicsWord.world.defaultMaterial,
        });
        body.position.copy(mesh.position as any);
        return body;
    }

    // TODO move setAnimation into Animation.ts
    private setAnimation(): any {
        console.log(this.playerResource.animations);
        const animation: any = {};
        animation.mixer = new AnimationMixer(this.model);
        animation.actions = {}
        animation.actions.attack1 = animation.mixer.clipAction(this.playerResource.animations[0]);
        animation.actions.attack2 = animation.mixer.clipAction(this.playerResource.animations[1]);
        animation.actions.spin = animation.mixer.clipAction(this.playerResource.animations[2]);

        animation.actions.current = undefined;
        // animation.actions.current.play();


        animation.play = (name: string) => {
            const newAction: AnimationAction = animation.actions[name];
            const oldAction = animation.actions.current;
            newAction.reset();
            newAction.play();
            if (oldAction) {
                newAction.crossFadeFrom(oldAction, 0.1, false);
            }
            animation.actions.current = newAction;
        }

        animation.stop = () => {
            animation.actions.current?.stop();
        }

        // if (this.debug.active) {
        //     const debugObject = {
        //         playIdle: () => { animation.play('idle') },
        //         playRunning: () => { animation.play('run') },
        //         playWalking: () => { animation.play('walk') }
        //     }
        //     this.debugFolder.add(debugObject, 'playIdle');
        //     this.debugFolder.add(debugObject, 'playRunning');
        //     this.debugFolder.add(debugObject, 'playWalking');
        // }
        return animation;
    }



    private playAnimation(actionName: string) {
        const newAction = this.animation.actions[actionName];
        const oldAction = this.animation.actions.current;
        newAction.reset();
        newAction.setLoop(LoopOnce, 0);
        if (newAction !== oldAction) {
            this.animation.play(actionName)
        }
    }

    private stopAnimation(): void {
        if (this.animation.actions.current) {
            this.animation.stop();
            this.animation.actions.current = undefined;
        }
    }


    private attackAction(): void {
        if (this.animation.actions.attack1.isRunning()) {
            return;
        }
        this.playAnimation('attack1');
        const raycaster = new Raycaster();

        const modelRotationRadiant = getAngleRadFromQuaternion(this.physicsBody.quaternion);
        const xRotation = Math.sin(modelRotationRadiant);
        const zRotation = -Math.cos(modelRotationRadiant);

        raycaster.set(this.model.position, new Vector3(xRotation, 0, zRotation));
        raycaster.far = 2;
        const arrow = new ArrowHelper(raycaster.ray.direction, this.model.position, 2, '#FF0000');
        this.scene.add(arrow);
        const intersects = raycaster.intersectObjects(this.scene.children);
        intersects.forEach(element => {
            const entity = this.entityManager.entities.find(x => x.mesh.uuid === element.object.uuid)
            if (!entity) { return; }

            if (entity.instance?.isAttackable) {
                entity.instance?.onHit();
            }
        });
        console.log(intersects);


    }

}
