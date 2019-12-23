/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { Activity } from "./activity";
import { ExecuteResult, IHomingPigeonModule, ValidateResult } from "./declare";

export class HomingPigeon {

    public static create() {

        return new HomingPigeon();
    }

    private readonly _modules: Map<string, IHomingPigeonModule>;

    private constructor() {

        this._modules = new Map<string, IHomingPigeonModule>();
    }

    public get length(): number {

        return this._modules.size;
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
            return {
                valid: false,
                shouldProceed: false,
                succeed: [],
                failed: [],
                missed: [],
            };
        }

        let valid: boolean = true;
        const succeed: string[] = [];
        const failed: string[] = [];
        for (const trigger of triggers) {

            const target: IHomingPigeonModule | undefined = this._modules.get(trigger);
            if (!target) {

                return {
                    valid: false,
                    shouldProceed: false,
                    succeed,
                    failed,
                    missed: [trigger],
                };
            }

            const result: boolean = target.validate(activity);
            if (!result) {

                failed.push(trigger);
                if (target.required) {
                    return {
                        valid: false,
                        shouldProceed: false,
                        succeed,
                        failed,
                        missed: [],
                    };
                }
                valid = false;
            } else {

                succeed.push(trigger);
            }
        }

        return {
            valid,
            shouldProceed: true,
            succeed,
            failed,
            missed: [],
        };
    }

    public async execute(activity: Activity): Promise<ExecuteResult> {

        const validateResult: ValidateResult = this.validate(activity);
        if (!validateResult.shouldProceed) {

            return {
                proceed: false,
                missed: validateResult.missed,
                succeed: [],
                validateFailed: validateResult.failed ?? [],
                executeFailed: [],
                errors: {},
            };
        }

        const succeed: string[] = [];
        const failed: string[] = [];
        const errors: Record<string, any> = {};

        for (const trigger of validateResult.succeed) {

            const target: IHomingPigeonModule = this.assertModule(trigger);

            try {

                const result: boolean = await target.execute(activity);

                if (result) {
                    succeed.push(trigger);
                } else {
                    failed.push(trigger);
                }
            } catch (error) {

                failed.push(trigger);
                errors[trigger] = error;
            }
        }

        return {
            proceed: true,
            missed: validateResult.missed,
            succeed,
            validateFailed: validateResult.failed ?? [],
            executeFailed: failed,
            errors,
        };
    }

    public assertModule(trigger: string): IHomingPigeonModule {

        if (this._modules.has(trigger)) {
            return this._modules.get(trigger) as IHomingPigeonModule;
        }
        throw new Error('[Homing-Pigeon] Undefined Module');
    }
}
