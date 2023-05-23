import { Component } from "./component";

export class Entity {
    private components: Component[] = [];

    registerComponent(component: Component): void {
        this.components.push(component);
        component.setParent(this);
    }

    getComponent(name: string): Component | undefined {
        return this.components.find(x => x.name === name);
    }
}