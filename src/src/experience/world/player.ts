import { Experience } from "../experience";
import { BasicCharacterController } from '../utils/movements';
import * as CANNON from 'cannon-es';
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial, Group, MeshStandardMaterial, sRGBEncoding, RepeatWrapping } from "three";

export default class Player {
    experience: Experience;
    scene: any;
    resources: any;
    time: any;
    debug: any;
    physicsWord: any;
    speed: number;
    rotationSmoothing: number;
    physicsBody: CANNON.Body;
    characterController: BasicCharacterController;
    model?: Mesh;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.physicsWord = this.experience.physicsWold;

        this.speed = 1;
        this.rotationSmoothing = 0.05;

        this.createPlayer(new Vector3(0.5, 1, 0.5));
        this.physicsBody = this.createPhysicsBody(this.model);
        this.characterController = new BasicCharacterController({ model: this.physicsBody, speed: this.speed, rotationSmoothing: this.rotationSmoothing });
        this.physicsBody.velocity.x = 1;
        // this.physicsBody.applyImpulse(new CANNON.Vec3(1, 0, 0))
        this.physicsWord.addBody(this.physicsBody, this.model);
    }

    createPlayer(dimension: any) {
        const textures = this.createTexture();
        this.model = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ map: textures.color, }))
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

        // this.physicsBody?.velocity.copy( new CANNON.Vec3() );
        // this.physicsBody?.quaternion.set(0, 0, 0, 0);
        // this.physicsBody?.inertia.set( 0, 0, 0 );
        // this.physicsBody?.invInertia.set( 0, 0, 0 );

        this.characterController.update();
    }

    createPhysicsBody(mesh: any) {
        const { x, y, z } = mesh.scale;
        // const shape = new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2));
        // const body = new CANNON.Body({
        //     mass: 20,
        //     shape,
        //     // material: this.physicsWord.world.defaultMaterial
        // })

        var shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({
            mass: 50,
            shape,
            material: this.physicsWord.world.defaultContactMaterial
        });
        body.position.copy(mesh.position);
        return body;
    }

    attachWeapon(weapon: Group): void {
        weapon.position.x = 0.75;
        weapon.rotateY(Math.PI / 2);
        this.model?.add(weapon);
    }

    private createTexture() {
        const textures: any = {};
        textures.color = this.resources.items.testTexture
        textures.color.encoding = sRGBEncoding
        textures.color.repeat.set(0.5, 1)
        textures.color.wrapS = RepeatWrapping
        textures.color.wrapT = RepeatWrapping

        return textures;
        // textures.normal = this.resources.items.grassNormalTexture
        // textures.normal.repeat.set(1.5, 1.5)
        // textures.normal.wrapS = RepeatWrapping
        // textures.normal.wrapT = RepeatWrapping

    }


}