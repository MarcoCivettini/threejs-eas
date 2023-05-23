import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";
import { Component } from "../models/component";
import { healthComponentName } from "../constants/components";

export class HealthComponent extends Component {
    private maxHealth: number;
    private currentHealth: number;
    private healthBarMesh?: Mesh;

    private readonly healthBarDimension = 1;

    onDeath?: () => void;

    constructor(maxHealth: number) {
        super(healthComponentName);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    setHealth(value: number): void {
        this.currentHealth = value;
    }

    getHealthInPercentage(): number {
        return this.currentHealth / this.maxHealth;
    }

    // TEST FOR PLAYER
    // setBarScale(): void {
    //     if (this.healthBarMesh) {
    //         this.healthBarMesh.scale.x = 2;
    //         this.healthBarMesh.scale.y = 4;
    //         this.healthBarMesh.position.y = 5;
    //     }
    // }

    setParent(parent: any) {
        const geometry = new PlaneGeometry(this.healthBarDimension, 0.075);

        const backgroundMaterial = new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide, depthTest: true, depthWrite: false });
        // backgroundMaterial.depthWrite = false;
        const backgroundMesh = new Mesh(geometry, backgroundMaterial);

        const healthBarMaterial = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide, depthTest: true });
        this.healthBarMesh = new Mesh(geometry, healthBarMaterial);

        backgroundMesh.position.setY(0.8);
        this.healthBarMesh.position.setY(0.8);

        parent.model.add(this.healthBarMesh);
        parent.model.add(backgroundMesh);


        // this.scene.add(mesh);

    }

    takeDamage(damageValue: number): void {
        // console.log('puppet ' + this.name + ' hitted' + ' health remaning ' + this.health + '/' + this.startHealth);
        const currentHealth = this.currentHealth - damageValue ?? 0;
        this.setHealth(currentHealth);
        this.updateMeshBarDimension();

        if (this.currentHealth === 0 && this.onDeath) {
            this.onDeath();
        }
    }

    private updateMeshBarDimension(): void {
        if (this.healthBarMesh) {
            this.healthBarMesh.scale.x = this.getHealthInPercentage();
            // Calculate the offset based on the health percentage
            var offset = (1 - this.getHealthInPercentage()) * this.healthBarDimension; // Adjust the offset as needed

            // Update the position of the health bar
            this.healthBarMesh.position.x = -offset / 2;
        }
    }

}