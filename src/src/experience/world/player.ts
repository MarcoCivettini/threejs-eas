import { Experience } from '../experience';
import * as CANNON from 'cannon-es';
import { Vector3, Mesh, Group } from 'three';
import PhysicsWorld from './physics-word';
import { Entity } from '../models/entity';
import { AttackComponent } from './attack-component';
import { AnimationComponent } from './animation-component';
import { ChartacterController } from './character-controller';
import { KeyboardInputController } from './keyboard-input-controller';
// import { HealthComponent } from './health-component';

export default class Player extends Entity {
    experience: Experience;
    scene: any;
    playerResource: any;
    physicsWord: PhysicsWorld;
    rotationSmoothing: number;
    physicsBody: CANNON.Body;
    model: Mesh;
    animation: any;

    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.playerResource = this.experience.resources.items.playerModel;
        this.physicsWord = this.experience.physicsWold;
        this.rotationSmoothing = 0.05;

        this.model = this.createPlayer(new Vector3(0.2, 0.2, 0.2));

        // N.B. quickfix for the player / physics spacing
        const armature = this.model.children[0];
        armature.position.y -= 1.5;

        this.physicsBody = this.createPhysicsBody(this.model);
        this.physicsBody.velocity.x = 1;

        // this.healtComponent = new HealthComponent(3);
        // this.healtComponent.setParent(this);
        // // this.healtComponent.onDeath = () => this.onDeath();
        // // this.healtComponent.setBarScale();
        // this.scene.add(this.model);


        this.scene.add(this.model);

        this.physicsWord.addBody(this.physicsBody, this.model, this);

        const characterController = new ChartacterController(1.5).withInputController(new KeyboardInputController());
        this.registerComponent(characterController);

        const attackComponent = new AttackComponent().withAnimation('attack1');
        this.registerComponent(attackComponent);

        const animationComponent = new AnimationComponent();
        this.registerComponent(animationComponent);
        animationComponent.registerAnimation('attack1', this.playerResource.animations[0]);

    }

    update(): void {
        super.update();
    }

    attachWeapon(weapon: Group): void {
        // TODO improve this correct bone research
        const bone = this.model.children[0].children[0].children[0].children[0];
        // clear bone from existing items from mesh
        bone.remove(bone.children[1]);
        bone.remove(bone.children[0]);

        weapon.rotateY(Math.PI / 2);

        bone.add(weapon)
    }

    private createPlayer(dimension: any): Mesh {
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
}


