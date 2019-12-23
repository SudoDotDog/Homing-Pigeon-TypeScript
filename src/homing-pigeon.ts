/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { Activity } from "./activity";
import { createAbortedExecuteResult, ExecuteResult, IHomingPigeonModule, ValidateResult } from "./declare";

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
            return { valid: false, shouldProceed: false };
        }

        let shouldProceed: boolean = true;
        const failed: string[] = [];
        for (const trigger of triggers) {

            const target: IHomingPigeonModule | undefined = this._modules.get(trigger);
            if (!target) {
                return { valid: false, shouldProceed: false, missed: [trigger] };
            }
            const result: boolean = target.validate(activity);
            if (!result) {
                if (target.required) {
                    return { valid: false, shouldProceed: false, failed: [trigger] };
                }
                shouldProceed = false;
                failed.push(trigger);
            }
        }

        return {
            valid: true,
            shouldProceed,
            failed,
        };
    }

    public async execute(activity: Activity): Promise<ExecuteResult> {

        const validateResult: ValidateResult = this.validate(activity);
        if (!validateResult.shouldProceed) {
            return createAbortedExecuteResult();
        }

        const succeed: string[] = [];
        const failed: string[] = [];
        const errors: Record<string, any> = [];


    }
}
