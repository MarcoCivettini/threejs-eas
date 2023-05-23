import { Mesh, BoxGeometry, MeshStandardMaterial, Vector3, Scene } from "three";
import { Experience } from "../experience";
import * as CANNON from 'cannon-es';
import PhysicsWorld from "./physics-word";
import { EntityManager } from "./entity-manager";
import { HealthComponent } from "./health-component";
import { Entity } from "../models/entity";
import { healthComponentName } from "../constants/components";

export class Puppet extends Entity {
    model: Mesh;
    isAttackable = true;
    name: string;

    private experience: Experience = new Experience();
    private scene: Scene = this.experience.scene;
    private entityManager: EntityManager;
    private physicsWorld: PhysicsWorld = this.experience.physicsWold;

    constructor(position: Vector3, name: string) {
        super();
        this.name = name;
        this.entityManager = this.experience.entityManager;

        this.model = this.createWall(new Vector3(0.5, 1, 0.5), position);
        this.physicsWorld.addBody(this.createPhysicsBody(this.model), this.model, this);

        this.registerHealthComponent();

        this.scene.add(this.model);
    }

    private createWall(dimension: any, position: any): Mesh {
        const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: '#eb2ade' }));
        mesh.scale.set(dimension.x, dimension.y, dimension.z);
        mesh.position.copy(position) // = 0.5;
        mesh.castShadow = true;
        return mesh;
    }

    private createPhysicsBody(mesh: any): CANNON.Body {
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
        const healthComponent = this.getComponent(healthComponentName) as HealthComponent;
        healthComponent.takeDamage(1);
    }

    onDeath(): void {
        console.log('puppet ' + this.name + ' is Death')
        this.scene.remove(this.model);
        this.entityManager.remove(this.model.uuid);
    }

    private registerHealthComponent(): void {
        const healthComponent = new HealthComponent(3);
        healthComponent.onDeath = () => this.onDeath();
        this.registerComponent(healthComponent);
    }

}