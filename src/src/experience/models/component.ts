import { Entity } from "./entity";

export class Component {
    readonly name: string;
    private parent?: Entity;

    constructor(name: string) {
        this.name = name;
    }

    setParent(parent: Entity): void {
        this.parent = parent;
    }

    getParent(): Entity | undefined{
        return this.parent;
    }
}