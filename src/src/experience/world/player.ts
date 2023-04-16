import { Experience } from '../experience';
import { BasicCharacterController } from '../utils/movements';
import * as CANNON from 'cannon-es';
import { Vector3, Mesh, Group, sRGBEncoding, RepeatWrapping, AnimationMixer } from 'three';

export default class Player {
    experience: Experience;
    scene: any;
    resources: any;
    playerResource: any;
    time: any;
    debug: any;
    physicsWord: any;
    speed: number;
    rotationSmoothing: number;
    physicsBody: CANNON.Body;
    characterController: BasicCharacterController;
    model: Mesh;
    animation: any;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.playerResource = this.resources.items.playerModel;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.physicsWord = this.experience.physicsWold;

        this.speed = 1;
        this.rotationSmoothing = 0.05;

        // this.model = this.createPlayer(new Vector3(0.5, 1, 0.5));
        this.model = this.createPlayer(new Vector3(0.2, 0.2, 0.2));
        this.physicsBody = this.createPhysicsBody(this.model);
        this.characterController = new BasicCharacterController({ model: this.physicsBody, speed: this.speed, rotationSmoothing: this.rotationSmoothing });
        this.physicsBody.velocity.x = 1;
        this.scene.add(this.model);

        this.physicsWord.addBody(this.physicsBody, this.model);
        this.animation = this.setAnimation();
    }

    update(): void {
        this.animation.mixer.update(this.time.delta * 0.001);
        this.characterController.update();
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
        var shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({
            mass: 50,
            shape,
            material: this.physicsWord.world.defaultContactMaterial
        });
        body.position.copy(mesh.position as any);
        return body;
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

    private setAnimation(): any {
        console.log(this.playerResource.animations);
        const animation: any = {};
        animation.mixer = new AnimationMixer(this.model);
        animation.actions = {}
        animation.actions.attack1 = animation.mixer.clipAction(this.playerResource.animations[0]);
        animation.actions.attack2 = animation.mixer.clipAction(this.playerResource.animations[1]);
        animation.actions.spin = animation.mixer.clipAction(this.playerResource.animations[2]);
        animation.actions.spin1 = animation.mixer.clipAction(this.playerResource.animations[3]);

        animation.actions.current = animation.actions.attack1;
        animation.actions.current.play();


        animation.play = (name: string) => {
            const newAction = animation.actions[name];
            const oldAction = animation.actions.current;
            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 0.1);
            animation.actions.current = newAction;
        }

        animation.stop = () => {
            animation.actions.current.stop();
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

    
    
    playAnimation(actionName: string) {
        if(!actionName){
            console.log('resetg');
            this.animation.stop();
        }
        const newAction = this.animation.actions[actionName];
        const oldAction = this.animation.actions.current;
        if (newAction !== oldAction) {
            this.animation.play(actionName)
        }
    }


}