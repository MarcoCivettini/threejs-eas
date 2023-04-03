import { WebGLRenderer, sRGBEncoding, CineonToneMapping, PCFSoftShadowMap } from "three";
import {Experience} from "./experience";


export default class Renderer {
    experience: Experience;
    canvas: any;
    sizes: any;
    scene: any;
    camera: any;
    instance: WebGLRenderer;
    constructor() {

        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        // create renderer instance
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.setRendererOptions();
    }

    setRendererOptions() {
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = sRGBEncoding
        this.instance.toneMapping = CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFSoftShadowMap
        this.instance.setClearColor('#211d20');
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }


    update() {
        this.instance.render(this.scene, this.camera.instance);
    }

}