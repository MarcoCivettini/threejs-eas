import * as CANNON from 'cannon-es';
import Experience from '../experience';
import CannonDebugger from 'cannon-es-debugger'


export default class PhysicsWorld {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.world = this.createPhysicWorld();
        this.cannonDebugger = new CannonDebugger(this.experience.scene, this.world);
        this.addDefaultContactMaterial();
        this.objectsToUpdate = [];

    }

    update() {
        // console.log(this.world.bodies);

        for (const object of this.objectsToUpdate) {
            object.mesh.position.copy(object.body.position)
            object.mesh.quaternion.copy(object.body.quaternion)
        }

        this.world.step(1 / 60, this.time.delta, 3);

        this.cannonDebugger.update() 
    }

    addBody(body, mesh) {
        this.world.addBody(body);
        this.objectsToUpdate.push({
            mesh,
            body
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
                friction: 0.001,
                restitution: 0
            }
        )

        this.world.addContactMaterial(defaultContactMaterial);
        this.world.defaultContactMaterial = defaultContactMaterial
    }
}