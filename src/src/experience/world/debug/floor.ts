import {Experience} from "../../experience";
import * as CANNON from 'cannon-es';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Raycaster, Vector3 } from "three";
// import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';


export default class Floor {
    experience: Experience;
    scene: any;
    resources: any;
    physicsWord: any;
    model: any;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.physicsWord = this.experience.physicsWold;

        this.createMesh();
        this.createPhysics();
    }

    createMesh() {
        const geometry = new PlaneGeometry( 10, 10 );
        const material = new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} );
        this.model = new Mesh( geometry, material );

        this.model.rotation.x = Math.PI / 2; // make it face up
        this.model.castShadow = true;

        this.scene.add( this.model );
    }

    createPhysics() {
        const mesh: Mesh = this.model;
        mesh.receiveShadow = true;

        // Create a static plane for the ground
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
            shape: new CANNON.Plane(),
        })
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
        this.physicsWord.world.addBody(groundBody);
    }
}