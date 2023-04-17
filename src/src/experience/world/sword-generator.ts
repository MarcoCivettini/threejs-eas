import { CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Shape } from 'three';
import { Experience } from './../experience';
export class SwordGenerator {
    private experience: Experience;
    private resources: any;

    constructor(params?: any) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
    }

    getSword(): Group {

        // primitives
        const idealSwordWidth = this.getRndInteger(2, 3);
        const idealSwordHeight = this.getRndInteger(10, 20);
        const idealSwordDepth = this.getRndInteger(1, 2);

        const handleRadius = idealSwordDepth / 2;
        const handleHeight = this.getRndInteger(5, 7);

        const guardWidth = idealSwordWidth + 1 + 3 * Math.round(Math.random());
        const guardHeight = this.getRndInteger(1, 1.5);
        const guardDepth = idealSwordDepth + 2 * Math.round(Math.random());

        const bladeWidth = idealSwordWidth;
        const bladeHeight = this.getRndInteger(idealSwordHeight - handleHeight, 20);
        const bladeDepth = 0.1 + 0.05 * Math.random();

        // console.log("primitives ideal", { idealSwordWidth, idealSwordHeight, idealSwordDepth });
        // console.log("primitives effective", { handleHeight, guardDepth });

        // meshes
        const handle = this.getHandle(handleRadius, handleHeight);
        const guard = this.getGuard(guardWidth, guardHeight, guardDepth);
        const blade = this.getBlade(bladeWidth, bladeHeight, bladeDepth, Math.random() > 0.5);

        // positioning
        guard.position.y = handleHeight / 2;
        blade.position.y = guard.position.y + guardHeight;

        const group = new Group();
        group.add(handle);
        group.add(guard);
        group.add(blade);
        return group;
    }

    private getHandle(radius: number, height: number): Mesh {
        // console.info("handle", { radius, height })

        const r1 = radius;
        const r2 = radius - Math.random() * 0.05;

        const geometry = new CylinderGeometry(r1, r2, height, 10, 1, false);
        const material = new MeshBasicMaterial({ color: '#000000' });
        return new Mesh(geometry, material);
    }

    private getGuard(width: number, height: number, depth: number): Mesh {
        // console.info("guard", { width, height, depth })

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

        const guardColor = this.resources.items.grassColorTexture

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        const material = new MeshStandardMaterial({ map: guardColor });
        const guard = new Mesh(geometry, material);

        // N.B. center to origin after the extrusion
        guard.position.z = -depth / 2

        return guard;
    }

    private getBlade(width: number, height: number, depth: number, pointy: boolean): Mesh {
        // console.info("blade", { width, height, depth, pointy })

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

        const textureColor = this.resources.items.steelColorTexture

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        const material = new MeshStandardMaterial({
            map: textureColor,
            roughness: 0.1
        });
        const blade = new Mesh(geometry, material);

        // N.B. center to origin after the extrusion
        blade.position.z = -depth / 2

        return blade;
    }

    private getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}