import { Mesh, BoxGeometry, MeshStandardMaterial, Vector3 } from "three";
import { Experience } from "../experience";
import * as CANNON from 'cannon-es';

export class Puppet{
    experience: Experience;
    scene: any;
    physicsWord: any;
    resources: any;
    model: Mesh<BoxGeometry, MeshStandardMaterial>;


    constructor(position: Vector3) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.physicsWord = this.experience.physicsWold;


        // this.model = this.createWall(new Vector3(2, 1 , 1), position);
        this.model = this.resources.items.puppetModel.scene;
        // console.log('model', this.model)
         this.model.scale.set(0.02,0.02,0.02);
        this.model.position.copy(position);
        this.scene.add(this.model);
        // this.physicsWord.addBody(this.createPhysicsBody(this.model), this.model);

    }

    createWall(dimension: any, position: any) {
        const mesh = new Mesh(
            new BoxGeometry(1,1,1),
            new MeshStandardMaterial({ color: '#BBBBBB' })
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
            material: this.physicsWord.world.defaultMaterial
        })
        body.position.copy(mesh.position);
        return body;
    }

}