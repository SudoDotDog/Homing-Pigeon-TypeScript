/**
 * @author WMXPY
 * @namespace Homing Pigeon
 * @description Util
 */

import { IHomingPigeonModule } from "./declare";

export const getModules = (
    modules: Map<string, IHomingPigeonModule[]>,
    moduleName: string,
    defaultValue: IHomingPigeonModule[] = [],
): IHomingPigeonModule[] => {

    if (modules.has(moduleName)) {
        return modules.get(moduleName) as IHomingPigeonModule[];
    }
    return defaultValue;
};
