import { SwordGenerator } from './sword-generator';
import { Vector3 } from "three";
import {Experience} from "../experience";
import { ThirdPersonCamera } from "../utils/third-person-camera";
import Environment from "./enviroment";
import Floor from "./floor";
import Player from './player';
import Wall from './wall';
import { Puppet } from './puppet';

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
            new Wall(new Vector3(-2, 0.5, -2));
            new Wall(new Vector3(2, 0.5, 2));
            new Puppet(new Vector3(0, -3, 2));

            const swordGenerator = new SwordGenerator();
            const sword = swordGenerator.getSword();

            const weaponScale = 0.16;
            sword.scale.set(weaponScale,weaponScale,weaponScale);
            this.player.attachWeapon(sword);
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