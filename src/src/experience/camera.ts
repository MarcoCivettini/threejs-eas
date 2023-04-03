import {Experience} from "./experience";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PerspectiveCamera } from "three";


export default class Camera {
    experience: Experience;
    sizes: any;
    scene: any;
    canvas: any;
    instance: PerspectiveCamera;
    controls?: OrbitControls;

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        // set camera instance
        this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
        // this.setInstance();
        // this.setOrbitControls();
    }

    // setInstance() {
    //     this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
    //     this.instance.position.set(6, 4, 8)
    //     this.scene.add(this.instance)
    // }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(){
        // this.controls.update()
    }

}