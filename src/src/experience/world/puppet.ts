import { Mesh, BoxGeometry, MeshStandardMaterial, Vector3, Scene } from "three";
import { Experience } from "../experience";
import * as CANNON from 'cannon-es';
import PhysicsWorld from "./physics-word";

export class Puppet{
    experience: Experience;
    scene: Scene;
    physicsWorld: PhysicsWorld;
    resources: any;
    model: Mesh<BoxGeometry, MeshStandardMaterial>;


    constructor(position: Vector3) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.physicsWorld = this.experience.physicsWold;


        // this.model = this.createWall(new Vector3(2, 1 , 1), position);
        this.model = this.resources.items.puppetModel.scene;
        // console.log('model', this.model)
         this.model.scale.set(0.02,0.02,0.02);
        this.model.position.copy(new Vector3(0,-5,0));
        this.scene.add(this.model);
        console.log(this.physicsWorld)
        this.physicsWorld.addBody(this.createPhysicsBody(position), this.model);

    }

    createPhysicsBody(position: Vector3) {
        const shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
        const body = new CANNON.Body({
            mass: 0,
            shape,
            material: this.physicsWorld.world.defaultMaterial
        })
        body.position.copy(new CANNON.Vec3(0,0,3));
        return body;
    }

}