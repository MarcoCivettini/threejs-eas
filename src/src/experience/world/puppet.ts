import { Mesh, BoxGeometry, MeshStandardMaterial, Vector3, Scene } from "three";
import { Experience } from "../experience";
import * as CANNON from 'cannon-es';
import PhysicsWorld from "./physics-word";
import { EntityManager } from "./entity-manager";
import { HealthComponent } from "./health-component";

export class Puppet {
    experience: Experience;
    scene: Scene;
    physicsWorld: PhysicsWorld;
    resources: any;
    model: Mesh<BoxGeometry, MeshStandardMaterial>;
    isAttackable = true;
    name: string;

    private healtComponent: HealthComponent;
    private entityManager: EntityManager;

    constructor(position: Vector3, name: string) {
        this.name = name;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.physicsWorld = this.experience.physicsWold;
        this.entityManager = this.experience.entityManager;

        this.model = this.createWall(new Vector3(0.5, 1, 0.5), position);
        this.physicsWorld.addBody(this.createPhysicsBody(this.model), this.model, this);

        // HEALT COMPONENT
        this.healtComponent = new HealthComponent(3);
        this.healtComponent.setParent(this);
        this.healtComponent.onDeath = () => this.onDeath();
        this.scene.add(this.model);

        // this.model = this.resources.items.puppetModel.scene;
        //  this.model.scale.set(0.02,0.02,0.02);
        // this.model.position.copy(new Vector3(0,0,0));
        // this.scene.add(this.model);
        // console.log(this.physicsWorld)
        // this.physicsWorld.addBody(this.createPhysicsBody(position), this.model);

    }

    // createPhysicsBody(position: Vector3) {
    //     const shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    //     const body = new CANNON.Body({
    //         mass: 0,
    //         shape,
    //         material: this.physicsWorld.world.defaultMaterial
    //     })
    //     body.position.copy(new CANNON.Vec3(0,0,3));
    //     return body;
    // }

    createWall(dimension: any, position: any) {
        console.log('aaa');
        const mesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshStandardMaterial({ color: '#eb2ade' })
        );
        mesh.scale.set(dimension.x, dimension.y, dimension.z);


        mesh.position.copy(position) // = 0.5;
        //\mesh.position.z = -2;
        // mesh.position.x = -2;
        mesh.castShadow = true;
        return mesh;
    }

    createPhysicsBody(mesh: any) {
        const { x, y, z } = mesh.scale;
        const shape = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2));
        const body = new CANNON.Body({
            mass: 0,
            shape,
            material: this.physicsWorld.world.defaultMaterial
        })
        body.position.copy(mesh.position);
        return body;
    }

    onHit(): void {
        this.healtComponent.takeDamage(1);
    }

    onDeath(): void {
        console.log('puppet ' + this.name + ' is Death')
        this.scene.remove(this.model);
        this.entityManager.remove(this.model.uuid);
    }

}