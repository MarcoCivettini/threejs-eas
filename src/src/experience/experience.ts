import {  Mesh, PerspectiveCamera, Scene } from "three";
import Camera from "./camera";
import Renderer from "./renderer";
import sources from "./sources";
import Debug from "./utils/debug";
import Resources from "./utils/resources";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import PhysicsWorld from "./world/physics-word";
import World from "./world/world";
import { EntityManager } from "./world/entity-manager";

let instance: Experience | null = null;

// Singelton
export class Experience {
    canvas?: HTMLElement;
    debug: any;
    sizes: any;
    time: any;
    scene: any;
    resources: any;
    camera: any;
    renderer: any;
    world: any;
    physicsWold: any;
    entityManager: EntityManager = new EntityManager();

    constructor(canvas?: HTMLElement) {
        if (instance) {
            return instance
        }
        instance = this
        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer()
        this.world = new World();
        this.physicsWold = new PhysicsWorld();

        this.sizes.on('resize', () => {
            this.resize();
        })

        this.time.on('tick', () => {
            this.update();
        })

        if (this.debug.active) {

            const debugObject = {
                destroy: () => {
                    this.destroy();
                }
            }
            this.debug.ui.add(debugObject, 'destroy')
        }
    }

    resize() {
        // this.camera?.resize();
        this.renderer?.resize();
    }

    update() {
        if(this.camera){
            this.camera.update();
        }
        this.world?.update();
        this.renderer?.update();
        this.physicsWold?.update();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        // Travers the whole scene
        this.scene.traverse((child: any) => {
            if (child instanceof Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && value.dispose == 'function') {
                        value.dispose();
                    }
                }
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }
}