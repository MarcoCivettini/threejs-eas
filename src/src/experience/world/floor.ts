import {Experience} from "../experience";
import * as CANNON from 'cannon-es';
import { Mesh, Raycaster, Vector3 } from "three";
// import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier';


export default class Floor {
    Experience: Experience;
    scene: any;
    resources: any;
    physicsWord: any;
    resource: any;
    model: any;
    constructor() {
        this.Experience = new Experience();
        this.scene = this.Experience.scene;
        this.resources = this.Experience.resources;
        this.physicsWord = this.Experience.physicsWold;

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

        const mesh = this.model.children[0];
        console.log('mesh', this.model);
        // const terrainShape = new CANNON.Trimesh.createMeshShape(this.model.children[0].geometry);

        // const simplifyModifier = new SimplifyModifier();
        // const simplifiedGeometry = simplifyModifier.modify(mesh.geometry, 1);
        console.log(mesh.geometry.index.array.length);
        const shape = this.createShapeFromGeometry(mesh);
        
        // this.createShapeFromGeometry1(this.model.children[2]);
        // for(let i = 1; i < this.model.children.length; i++){
        //     this.terrainObjectToShape(this.model.children[i]);

        // }

        // this.terrainObjectToShape(this.model.children[4]);

        const body = new CANNON.Body({
            mass: 0,
            // shape,
            // material: this.physicsWord.world.defaultMaterial
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

        if(geometry == null){
            console.log('errore', mesh);
            return;}
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
                    matrix[x + dimension][-z + dimension] = (intersects[0].point.y * yScale) + 5.85;
                } else {
                    matrix[x + dimension][-z + dimension] = 0;
                }
            }
        }

        const terrainShape = new CANNON.Heightfield(matrix,);

        return terrainShape;
    }

    createShapeFromGeometry1(geometry: any) {
                // const simplifyModifier = new SimplifyModifier();
        // const simplifiedGeometry = simplifyModifier.modify(mesh.geometry, 1);

        // Get the vertices and indices of the geometry
        const positions = geometry.attributes.position.array;
        // console.log('pos', geometry.attributes.position.array[0])
        // console.log('normal', geometry.attributes.normal.array[0])

        const indices = geometry.index.array;

        // Convert the positions and indices to cannon-es vectors and arrays
        const vertices = [];
        const scale = 15;
        for (let i = 0; i < positions.length; i += 3) {
            const vertex = new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2]);
            vertices.push(vertex);
        }
        const faces = [];
        for (let i = 0; i < indices.length; i += 3) {
            const face = [indices[i], indices[i + 1], indices[i + 2]];
            faces.push(face);
        }

        // console.log(vertices, faces);


        // Create a CANNON.ConvexPolyhedron shape from the vertices and faces
        const shape = new CANNON.ConvexPolyhedron({ vertices: vertices, faces: faces });

        return shape;
    }



}