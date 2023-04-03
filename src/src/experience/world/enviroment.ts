import { DirectionalLight, sRGBEncoding, Mesh, MeshStandardMaterial } from "three";
import {Experience} from "../experience";

export default class Environment {
    experience: Experience;
    scene: any;
    resources: any;
    debug: any;
    debugFolder: any;
    sunLight: DirectionalLight;
    environmentMap: { [key: string]: any } = {};

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('enviroment');
        }

        // set sunlight
        this.sunLight = new DirectionalLight('#ffffff', 4)
        this.setSunLightOptions();


        this.setEnviromentMap();
    }


    setSunLightOptions() {
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3, 3, - 2.25)
        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001);

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(-5)
                .max(5)
                .step(0.001)
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(-5)
                .max(5)
                .step(0.001)
        }
    }

    setEnviromentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = .4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child: any) => {
                if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(() => {
                    this.environmentMap.updateMaterials()
                })
        }
    }
}