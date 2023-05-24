import { Entity } from "./entity";

export class Component {
    readonly name: string;
    private parent?: Entity;

    constructor(name: string) {
        this.name = name;
    }

    setParent(parent: Entity): void {
        this.parent = parent;
        this.onRegistration();
    }

    getParent(): Entity | undefined {
        return this.parent;
    }

    update(): void { }

    protected onRegistration(): void { }
}