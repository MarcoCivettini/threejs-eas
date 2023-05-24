import { Vector3 } from "three";
import { Experience } from "../experience";
import { Entity } from "../models/entity";
import { EntityManager } from "./entity-manager";
import Player from "./player";
import { EventHandler } from "../utils/event-handler";

export class AiMovementLogic {
    private experience = new Experience();
    entityManager: EntityManager = this.experience.entityManager;
    entityuuid: string;
    constructor(entityuuid: any) {
        this.entityuuid = entityuuid;
    }

    update(): void {
        const player = this.entityManager.entities.find(x => x.instance instanceof Player)?.instance;
        const currentEntity = this.entityManager.entities.find(x => x.mesh.uuid === this.entityuuid)?.instance;

        if (player && currentEntity) {
            const startPosition = currentEntity.model.position.clone() as Vector3;
            startPosition.y = Math.abs(startPosition.y);

            const targetPosition = player.model.position.clone();


            const difference = targetPosition.sub(startPosition);
            const normalizedDiff = difference.normalize();


            if(normalizedDiff.x > 0.01){
                EventHandler.emit('ai:left', false );
                EventHandler.emit('ai:right', true);
            }
            else if(normalizedDiff.x <-0.01){
                EventHandler.emit('ai:right', false);
                EventHandler.emit('ai:left', true);
            }
            else if(normalizedDiff.x >= -0.01 && normalizedDiff.x <= 0.01 ){
                EventHandler.emit('ai:left', false);
                EventHandler.emit('ai:right', false);
            }


            if(normalizedDiff.z > 0.01){
                EventHandler.emit('ai:up', false );
                EventHandler.emit('ai:down', true);
            }
            else if(normalizedDiff.z <-0.01){
                EventHandler.emit('ai:down', false);
                EventHandler.emit('ai:up', true);
            }
            else if(normalizedDiff.z>= -0.01 && normalizedDiff.z <= 0.01 ){
                EventHandler.emit('ai:up', false);
                EventHandler.emit('ai:down', false);
            }
        }

        // console.log('    player', player);
    }
}