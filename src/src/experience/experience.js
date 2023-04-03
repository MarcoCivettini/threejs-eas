import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import * as THREE from 'three';
import Renderer from './renderer.js';
import World from "./world/world";
import Resources from "./utils/resources";
import sources from './sources.js';
import Debug from "./utils/debug";
import PhysicsWorld from "./world/physics-word";

let instance = null;

// Singelton
export default class Experience {
    constructor(canvas) {
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
        this.scene = new THREE.Scene()
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
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update()
        this.world.update();
        this.renderer.update();
        this.physicsWold.update();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        // Travers the whole scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if(value && value.dispose == 'function'){
                        value.dispose();
                    }
                }
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        if(this.debug.active){
            this.debug.ui.destroy();
        }
    }
}