import { Experience } from "../experience";
import * as CANNON from 'cannon-es';
import { Mesh, Raycaster, Vector3 } from "three";
import PhysicsWorld from "./physics-word";
// import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';


export default class Floor {
    experience: Experience;
    scene: any;
    resources: any;
    physicsWord: PhysicsWorld;
    resource: any;
    model: any;
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.physicsWord = this.experience.physicsWold;

        this.resource = this.resources.items.floorModel;
        this.setModel();
        this.createPhysicsWorld();
    }
    setModel() {
        this.model = this.resource.scene;
        this.scene.add(this.model);

        this.model.traverse((child: any) => {
            if (child instanceof Mesh) {
                child.castShadow = true
            }
        })

    }

    createPhysicsWorld() {
        const mesh: Mesh = this.model.children[54];
        mesh.receiveShadow = true;
        const shape = this.createShapeFromGeometry(mesh);

        const body = new CANNON.Body({
            mass: 0,
        });


        body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            -Math.PI / 2
        )

        body.position.x = -15
        body.position.z = 15

        body.addShape(shape);
        this.physicsWord.world.addBody(body);

    }

    terrainObjectToShape(mesh: any) {
        // console.log(mesh);
        // if(!mesh?.childrend?.length){return;}
        let geometry = null;
        if (mesh.geometry != null) {
            geometry = mesh.geometry;

        } else {
            geometry = mesh.children[0].geometry;
        }

        if (geometry == null) {
            console.log('errore', mesh);
            return;
        }
        // console.log('pos', geometry)
        // console.log('normal', geometry.attributes.normal.array[0])
        const shape = this.createShapeFromGeometry(mesh)
        const body = new CANNON.Body({
            mass: 0,
            shape,
            // material: this.physicsWord.world.defaultMaterial
        });
        body.position.copy(mesh.position);
        body.quaternion.copy(mesh.quaternion);
        this.physicsWord.world.addBody(body);

        this.scene.add(mesh);
    }

    createShapeFromGeometry(mesh: any) {
        const matrix: number[][] = [];
        const scale = mesh.scale.x;
        const yScale = mesh.scale.y;
        const dimension = scale;


        for (let x = -dimension; x <= dimension; x++) {
            matrix.push([]);
            for (let z = -dimension; z <= dimension; z++) {
                const origin = new Vector3(x / scale, 1, z / scale).applyMatrix4(mesh.matrixWorld);
                const direction = new Vector3(0, -1, 0).transformDirection(mesh.matrixWorld);
                const raycaster = new Raycaster(origin, direction);
                const intersects = raycaster.intersectObject(mesh, false);

                if (intersects.length > 0) {
                    matrix[x + dimension][-z + dimension] = (intersects[0].point.y * yScale);
                } else {
                    matrix[x + dimension][-z + dimension] = 0;
                }
            }
        }

        const terrainShape = new CANNON.Heightfield(matrix,);

        return terrainShape;
    }


}
