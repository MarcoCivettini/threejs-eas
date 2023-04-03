import EventEmitter from "./eventEmitter";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        // Options
        this.sources = sources
        console.log(this.sources);

        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loadByGltf(source);
            } else if (source.type === 'texture') {
                this.loadByTexture(source);
            } else if (source.type === 'cubeTexture') {
                this.loadByCubeTexture(source);
            }
        }
    }

    loadByGltf(source) {
        this.loaders.gltfLoader.load(
            source.path,
            (file) => {
                this.sourceLoaded(source, file);
            }
        )
    }
    loadByTexture(source) {
        this.loaders.textureLoader.load(
            source.path,
            (file) => {
                this.sourceLoaded(source, file);
            }
        )
    }
    loadByCubeTexture(source) {
        this.loaders.cubeTextureLoader.load(
            source.path,
            (file) => {
                this.sourceLoaded(source, file);
            }
        )
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}