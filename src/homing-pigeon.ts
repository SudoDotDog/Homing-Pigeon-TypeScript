/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { Activity } from "./activity";
import { createValidateResult, IHomingPigeonModule, ValidateResult } from "./declare";

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

    public validate(activity: Activity): ValidateResult {

        const triggers: string[] = activity.triggers;
        if (!Array.isArray(triggers)) {
            return createValidateResult(false, false);
        }

        let shouldProceed: boolean = true;
        for (const trigger of triggers) {

            const target: IHomingPigeonModule | undefined = this._modules.get(trigger);
            if (!target) {
                return createValidateResult(false, false);
            }
            const result: boolean = target.validate(activity);
            if (!result) {
                if (target.required) {
                    return createValidateResult(false, false);
                }
                shouldProceed = false;
            }
        }

        return createValidateResult(true, shouldProceed);
    }

    public async execute(activity: Activity): Promise<boolean> {

        return true;
    }
}
