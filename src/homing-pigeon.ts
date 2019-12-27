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

    private readonly _modules: Map<string, IHomingPigeonModule[]>;

    private constructor() {

        this._modules = new Map<string, IHomingPigeonModule[]>();
    }

    public get length(): number {

        return this._modules.size;
    }

    public module(moduleName: string, instance: IHomingPigeonModule): this {

        this._modules.set(moduleName, [...this.getModules(moduleName), instance]);
        return this;
    }

    public validate(activity: Activity): ValidateResult {

        if (!activity) {
            return {
                valid: false,
                shouldProceed: false,
                succeed: {},
                failed: {},
                missed: [],
            };
        }

        const triggers: string[] = activity.triggers;
        if (!Array.isArray(triggers)) {
            return {
                valid: false,
                shouldProceed: false,
                succeed: {},
                failed: {},
                missed: [],
            };
        }

        let valid: boolean = true;
        const succeed: Record<string, number> = {};
        const failed: Record<string, number> = {};
        for (const trigger of triggers) {

            const targets: IHomingPigeonModule[] = this.getModules(trigger);
            if (targets.length === 0) {

                return {
                    valid: false,
                    shouldProceed: false,
                    succeed,
                    failed,
                    missed: [trigger],
                };
            }

            for (const target of targets) {

                const result: boolean = target.validate(activity);
                if (!result) {

                    failed[trigger] = (failed[trigger] ?? 0) + 1;
                    if (target.shouldAbort && target.shouldAbort(activity)) {
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

                    succeed[trigger] = (succeed[trigger] ?? 0) + 1;
                }
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
                succeed: {},
                validateFailed: validateResult.failed ?? {},
                executeFailed: {},
                errors: {},
            };
        }

        const succeed: Record<string, number> = {};
        const failed: Record<string, number> = {};
        const errors: Record<string, any> = {};

        const succeedTriggers: string[] = Object.keys(validateResult.succeed);
        for (const trigger of succeedTriggers) {

            const targets: IHomingPigeonModule[] = this.getModules(trigger);

            for (const target of targets) {

                try {

                    const result: boolean = await target.execute(activity);

                    if (result) {
                        succeed[trigger] = (succeed[trigger] ?? 0) + 1;
                    } else {
                        failed[trigger] = (failed[trigger] ?? 0) + 1;
                    }
                } catch (error) {

                    failed[trigger] = (failed[trigger] ?? 0) + 1;
                    errors[trigger] = error;
                }
            }
        }

        return {
            proceed: true,
            missed: validateResult.missed,
            succeed,
            validateFailed: validateResult.failed ?? {},
            executeFailed: failed,
            errors,
        };
    }

    public getModules(trigger: string): IHomingPigeonModule[] {

        if (this._modules.has(trigger)) {
            return this._modules.get(trigger) as IHomingPigeonModule[];
        }
        return [];
    }
}
