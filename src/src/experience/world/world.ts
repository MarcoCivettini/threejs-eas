import { SwordGenerator } from './sword-generator';
import { Vector3 } from "three";
import { Experience } from "../experience";
import { ThirdPersonCamera } from "../utils/third-person-camera";
import Environment from "./enviroment";
import Floor from "./floor";
import Player from './player';
import Wall from './wall';
import { Puppet } from './puppet';
import { EntityManager } from './entity-manager';
import { Entity } from '../models/entity';
import { AiMovementLogic } from './ai-movement-logic';

export default class World {
    experience: Experience;
    scene: any;
    resources: any;
    floor?: Floor;
    player?: Player;
    enviroment?: Environment;
    thirdPersonCamera?: ThirdPersonCamera;
    wall?: Wall;
    private entityManager: EntityManager;
    private aiMovementLogic?: AiMovementLogic;
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.entityManager = this.experience.entityManager;


        this.resources.on(('ready'), () => {

            // Setup
            this.floor = new Floor();
            this.player = new Player();
            this.enviroment = new Environment();
            this.thirdPersonCamera = new ThirdPersonCamera({ model: this.player.model, camera: this.experience.camera });
            new Wall(new Vector3(-2, 0.5, -2));
            new Wall(new Vector3(2, 0.5, 2));
            // new Puppet(new Vector3(0, -0.5, 9), 'Puppet1');
           const puppet =  new Puppet(new Vector3(0, 0.5, -2), 'Puppet2');
            this.aiMovementLogic = new AiMovementLogic(puppet.model.uuid);


            const swordGenerator = new SwordGenerator();
            const sword = swordGenerator.getSword();

            const weaponScale = 0.16;
            sword.scale.set(weaponScale, weaponScale, weaponScale);
            this.player.attachWeapon(sword);
        })
    }

    update() {
        for (const entity of this.entityManager.entities) {
            if (entity?.instance instanceof Entity) {
                entity?.instance?.update();
            }
        }

        this.aiMovementLogic?.update();

        if (this.thirdPersonCamera) {
            this.thirdPersonCamera.update();
        }
    }
}