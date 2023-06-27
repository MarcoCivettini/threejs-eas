import * as CANNON from 'cannon-es';
import { Experience } from '../experience';
import CannonDebugger from 'cannon-es-debugger'
import { EntityManager } from './entity-manager';
import { Mesh } from 'three';


export default class PhysicsWorld {
    experience: Experience;
    time: any;
    world: CANNON.World;
    cannonDebugger: any;
    entityManager: EntityManager;
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.world = this.createPhysicWorld();
        this.entityManager = this.experience.entityManager;
        this.cannonDebugger = CannonDebugger(this.experience.scene, this.world);
        this.addDefaultContactMaterial();
        // this.objectsToUpdate = [];

    }

    update() {
        // console.log(this.world.bodies);

        for (const object of this.entityManager.entities) {
            object.mesh.position.copy(object.body.position as any);
            object.mesh.quaternion.copy(object.body.quaternion as any);
        }

        this.world.step(1 / 60, this.time.delta, 3);

        //  this.cannonDebugger.update()
    }

    addBody(body: CANNON.Body, mesh: Mesh, instance: any) {
        this.world.addBody(body);
        this.entityManager.add({
            body, mesh, instance
        })
    }

    createPhysicWorld() {
        const world = new CANNON.World();
        world.broadphase = new CANNON.SAPBroadphase(world);
        world.gravity.set(0, -9.82, 0);
        world.allowSleep = true;
        return world;
    }

    addDefaultContactMaterial() {
        const defaultMaterial = new CANNON.Material('default');

        const defaultContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0,
                restitution: 0
            }
        )

        this.world.addContactMaterial(defaultContactMaterial);
        this.world.defaultContactMaterial = defaultContactMaterial
    }
}