import EventEmitter from "./eventEmitter";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


export default class Resources extends EventEmitter {
    sources: any;
    items: {[key: string]: any} = {};
    toLoad: any;
    loaded: number;
    loaders: {[key: string]: any} = {};
    constructor(sources: any) {
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

    loadByGltf(source: any) {
        this.loaders.gltfLoader.load(
            source.path,
            (file: any) => {
                this.sourceLoaded(source, file);
            }
        )
    }
    loadByTexture(source: any) {
        this.loaders.textureLoader.load(
            source.path,
            (file: any) => {
                this.sourceLoaded(source, file);
            }
        )
    }
    loadByCubeTexture(source: any) {
        this.loaders.cubeTextureLoader.load(
            source.path,
            (file: any) => {
                this.sourceLoaded(source, file);
            }
        )
    }

    sourceLoaded(source: any, file: any) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}