import Experience from "../experience";
import * as THREE from 'three';
import * as CANNON from 'cannon-es';


export default class Wall {
    experience: Experience;
    scene: any;
    physicsWord: any;
    model: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;


    constructor(position: any) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.physicsWord = this.experience.physicsWold;


        this.model = this.createWall(new THREE.Vector3(2, 1 , 1), position);
        this.scene.add(this.model);
        this.physicsWord.addBody(this.createPhysicsBody(this.model), this.model);

    }

    createWall(dimension: any, position: any) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshStandardMaterial({ color: '#BBBBBB' })
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