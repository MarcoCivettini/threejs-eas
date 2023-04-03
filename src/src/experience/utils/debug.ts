
import * as lil from 'lil-gui';
export default class Debug {
    active: boolean;
    ui?: lil.GUI;

    constructor() {
        this.active = window.location.hash === '#Debug';

        if (this.active) {
            this.ui = new lil.GUI();
        }
    }

}