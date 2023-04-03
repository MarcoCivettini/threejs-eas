import Experience from "../experience";
import * as THREE from 'three';
import { BasicCharacterController } from './../utils/movements';
import * as CANNON from 'cannon-es';

export default class Player {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.physicsWord = this.experience.physicsWold;

        this.speed = 1;
        this.rotationSmoothing = 0.15;

        this.createPlayer(new THREE.Vector3(0.5, 1, 0.5));
        this.physicsBody = this.createPhysicsBody(this.model);
        this.characterController = new BasicCharacterController({ model: this.physicsBody, speed: this.speed, rotationSmoothing: this.rotationSmoothing  });
         this.physicsBody.velocity.x   = 1;
        // this.physicsBody.applyImpulse(new CANNON.Vec3(1, 0, 0))
        this.physicsWord.addBody(this.physicsBody, this.model);
        
    }

    createPlayer(dimension) {
        this.model = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'darkgreen' }))
        this.model.scale.set(dimension.x, dimension.y, dimension.z);
        this.model.position.y = 5.5;
        
        this.model.castShadow = true;


        // TEST
        // this.model.position.z = -2;
        // this.model.position.x = -2;

        this.scene.add(this.model);

    }

    update() {
        // this.physicsBody.velocity.x = -0.3;
        // this.physicsBody.velocity.z = -0.3;
        this.characterController.update();
    }

    createPhysicsBody(mesh) {
        const {x,y,z} = mesh.scale;
        const shape = new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2));
        const body = new CANNON.Body({
            mass: 20,
            shape,
            // material: this.physicsWord.world.defaultMaterial
        })
        body.position.copy(mesh.position);
        return body;
    }


}