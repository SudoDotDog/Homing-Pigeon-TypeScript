/**
 * @author WMXPY
 * @namespace Core
 * @description Validate
 */

import { Activity } from "../activity";
import { IHomingPigeonModule } from "../declare";
import { getModules } from "./util";

export const validateActivity = (modules: Map<string, IHomingPigeonModule[]>, activity: Activity) => {

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

        const targets: IHomingPigeonModule[] = getModules(modules, trigger);
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
};
