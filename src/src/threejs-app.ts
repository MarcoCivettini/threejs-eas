import { AmbientLight, AnimationAction, AnimationClip, AnimationMixer, Clock, CylinderGeometry, ExtrudeGeometry, Group, LoopRepeat, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Shape, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


let scene: Scene;
let sword: Group;

let animations: AnimationClip[];
let animationMixer: AnimationMixer;
let animationAction: AnimationAction;

export const initThreejsApp = (canvasId: string): void => {

    const loader = new GLTFLoader();
    loader.load('/sword_animations_sample.glb',
        (gltf) => {
            animations = gltf.animations;

            const canvasRef = document.getElementById(canvasId);
            if (canvasRef == null) {
                throw Error(`Invalid canvas id: ${canvasId}`);
            }

            scene = new Scene();
            const camera = new PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            const renderer = new WebGLRenderer({ canvas: canvasRef });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);

            sword = getSword();

            // attach animations
            sword.animations = animations;
            animationMixer = new AnimationMixer( sword );            

            scene.add(sword);

            const light = new AmbientLight(0x404040); // soft white light
            scene.add(light);

            camera.position.z = 35;
            controls.update();

            const clock = new Clock(true);

            function renderScene() {
                controls.update();
                animationMixer.update(clock.getDelta());
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            }

            renderScene();

        },
        undefined,
        (error) => {
            console.error(error);
        }
    );
}

export const regenerateSword = (): void => {
    scene.remove(sword);
    sword = getSword();
    animationMixer = new AnimationMixer( sword );   
    scene.add(sword);
}

export const setFlipAnimation = (): void => {
    playAnimationByIndex(0);
}

export const setSpinAnimation = (): void => {
    playAnimationByIndex(1);
}

export const stopAnimation = (): void => {
    animationAction?.stop();
}

const playAnimationByIndex = (i: number): void => {
    stopAnimation();
    
    const anim = animations[i];
    animationAction = animationMixer.clipAction( anim );
    animationAction.loop = LoopRepeat;
    animationAction.play();
}

const getRndInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getSword = (): Group => {

    // primitives
    const idealSwordWidth = getRndInteger(2, 3);
    const idealSwordHeight = getRndInteger(10, 20);
    const idealSwordDepth = getRndInteger(1, 2);

    const handleRadius = idealSwordDepth / 2;
    const handleHeight = getRndInteger(5, 7);

    const guardWidth = idealSwordWidth + 1 + 3 * Math.round(Math.random());
    const guardHeight = getRndInteger(1, 1.5);
    const guardDepth = idealSwordDepth + 2 * Math.round(Math.random());

    const bladeWidth = idealSwordWidth;
    const bladeHeight = getRndInteger(idealSwordHeight - handleHeight, 20);
    const bladeDepth = 0.1 + 0.05 * Math.random();

    console.log("primitives ideal", { idealSwordWidth, idealSwordHeight, idealSwordDepth });
    console.log("primitives effective", { handleHeight, guardDepth });

    // meshes
    const handle = getHandle(handleRadius, handleHeight);
    const guard = getGuard(guardWidth, guardHeight, guardDepth);
    const blade = getBlade(bladeWidth, bladeHeight, bladeDepth, Math.random() > 0.5);

    // positioning
    guard.position.y = handleHeight / 2;
    blade.position.y = guard.position.y + guardHeight;

    const group = new Group();
    group.add(handle);
    group.add(guard);
    group.add(blade);
    return group;
}

const getHandle = (radius: number, height: number): Mesh => {
    console.info("handle", { radius, height })

    const r1 = radius;
    const r2 = radius - Math.random() * 0.05;

    const geometry = new CylinderGeometry(r1, r2, height, 10, 1, false);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    return new Mesh(geometry, material);
}

const getGuard = (width: number, height: number, depth: number): Mesh => {
    console.info("guard", { width, height, depth })

    const halfWidth = width / 2;
    const shape = new Shape();
    shape.moveTo(-halfWidth, 0)
    shape.lineTo(halfWidth, 0)
    shape.lineTo(halfWidth, height)
    shape.lineTo(-halfWidth, height)

    // TODO investigate on decorations
    // shape.moveTo(-2, 0)
    // shape.lineTo(2, 0)
    // shape.bezierCurveTo(3, 0, 3, 0, 3, 1);
    // shape.lineTo(-2, 1)

    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: false
    };

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const guard = new Mesh(geometry, material);

    // N.B. center to origin after the extrusion
    guard.position.z = -depth / 2

    return guard;
}

const getBlade = (width: number, height: number, depth: number, pointy: boolean): Mesh => {
    console.info("blade", { width, height, depth, pointy })

    const halfWidth = width / 2;
    const shape = new Shape();
    shape.moveTo(-halfWidth, 0)
    shape.lineTo(halfWidth, 0)

    const offset = Math.random();
    if (pointy) {
        shape.lineTo(halfWidth - offset, height)
        shape.lineTo(0, height + 2 * offset)
        shape.lineTo(-halfWidth + offset, height)
    }
    else {
        shape.lineTo(halfWidth, height)
        shape.lineTo(-halfWidth, height + 3 * offset)
    }

    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: false
    };

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    const material = new MeshBasicMaterial({ color: 0x0000ff });
    const blade = new Mesh(geometry, material);

    // N.B. center to origin after the extrusion
    blade.position.z = -depth / 2

    return blade;
}
