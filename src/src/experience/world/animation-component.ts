import { AnimationMixer, AnimationAction, LoopOnce } from "three";
import { Experience } from "../experience";
import Time from "../utils/time";
import { Component } from "../models/component";
import { AnimationComponentName } from "../constants/components";

export class AnimationComponent extends Component {

    private mixer?: AnimationMixer;
    private actions: Map<string, AnimationAction> = new Map();
    private currentAnimaition?: AnimationAction = undefined;
    private experience = new Experience();
    private time: Time = this.experience.time;

    constructor() { super(AnimationComponentName); }

    onRegistration(): void {
        const parent = this.getParent() as any;
        if (parent) {
            this.mixer = new AnimationMixer(parent.model)
        }
    }

    update(): void {
        if (this.mixer) {
            this.mixer.update(this.time.delta * 0.001);
        }
    }

    registerAnimation(name: string, animationResource: any): this {
        if (this.mixer) {
            const animation = this.mixer.clipAction(animationResource);
            this.actions.set(name, animation);
        }
        return this;
    }

    play(animationName: string): void {
        const newAction = this.actions.get(animationName);
        const oldAction = this.currentAnimaition;
        if (newAction) {
            newAction.reset();
            newAction.setLoop(LoopOnce, 0);
            newAction.play();
            if (oldAction) {
                newAction.crossFadeFrom(oldAction, 0.1, false);
            }
            this.currentAnimaition = newAction;
        }
    }

    stop() {
        this.currentAnimaition?.stop();
    }

    getAnimation(name: string): AnimationAction | undefined {
        return this.actions.get(name);
    }

}
