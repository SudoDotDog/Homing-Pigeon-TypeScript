/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { IHomingPigeonModule } from "./declare";

export class HomingPigeon {

    public static create() {

        return new HomingPigeon();
    }

    private readonly _modules: Map<string, IHomingPigeonModule>;

    private constructor() {

        this._modules = new Map<string, IHomingPigeonModule>();
    }

    public module(instance: IHomingPigeonModule): this {

        if (this._modules.has(instance.name)) {
            throw new Error('[Homing-Pigeon] Duplicated Module Name');
        }

        this._modules.set(instance.name, instance);
        return this;
    }
}
