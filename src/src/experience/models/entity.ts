import { Component } from "./component";

export class Entity {
    private components: Component[] = [];

    registerComponent(component: Component): void {
        this.components.push(component);
        component.setParent(this);
    }

    unregisterComponent(name: string): void {
        const idx = this.components.findIndex(x => x.name === name);
        if (idx != -1) {
            this.components.splice(idx, 1);
        }
    }

    getComponent(name: string): Component | undefined {
        return this.components.find(x => x.name === name);
    }

    update(): void {
        for (const component of this.components) {
            component.update();
        }
    }
}