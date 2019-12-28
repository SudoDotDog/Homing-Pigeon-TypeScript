/**
 * @author WMXPY
 * @namespace Core
 * @description Execute
 */

import { Activity } from "../activity";
import { ExecuteResult, IHomingPigeonModule, ValidateResult } from "../declare";
import { getModules } from "./util";
import { validateActivity } from "./validate";

export const executeActivity = async (modules: Map<string, IHomingPigeonModule[]>, activity: Activity): Promise<ExecuteResult> => {

    const validateResult: ValidateResult = validateActivity(modules, activity);
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

        const targets: IHomingPigeonModule[] = getModules(modules, trigger);

        for (const target of targets) {

            if (!target.validate(activity)) {
                continue;
            }

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
};
