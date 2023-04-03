import Experience from "../experience";
import { ThirdPersonCamera } from "../utils/third-person-camera";
import Environment from "./enviroment";
import Floor from "./floor";
import Player from './player';
import Wall from './wall';
import * as THREE from 'three';


export default class World {
    experience: Experience;
    scene: any;
    resources: any;
    floor?: Floor;
    player?: Player;
    enviroment?: Environment;
    thirdPersonCamera?: ThirdPersonCamera;
    wall?: Wall;
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on(('ready'), () => {

            // Setup
            this.floor = new Floor();
            this.player = new Player();
            this.enviroment = new Environment();
            this.thirdPersonCamera = new ThirdPersonCamera({ model: this.player.model, camera: this.experience.camera });
            this.wall = new Wall(new THREE.Vector3(-2, 0.5, -2));
            this.wall = new Wall(new THREE.Vector3(2, 0.5, 2));
        })
    }

    update() {
        if (this.player) {
            this.player.update();
        }

        if (this.thirdPersonCamera) {
            this.thirdPersonCamera.update();
        }
    }
}