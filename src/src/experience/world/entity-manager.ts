import * as CANNON from 'cannon-es';
import { Mesh } from 'three';

export class EntityManager {
    private _entities: Entity[] = [];

    get entities(): Entity[] { return this._entities; }

    add(entity: Entity): void {
        this._entities.push(entity);
    }

    remove(meshUUID: string): void{
        const index = this._entities.findIndex(x => x.mesh.uuid === meshUUID); 
        if(index > -1){
            this.entities.slice(index, 1);
        }       
    }
}

interface Entity{
    body: CANNON.Body;
    mesh: Mesh;
    instance: any;
}