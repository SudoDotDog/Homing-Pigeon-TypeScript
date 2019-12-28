/**
 * @author WMXPY
 * @namespace Core
 * @description Util
 */

import { IHomingPigeonModule } from "../declare";

export const getModules = (modules: Map<string, IHomingPigeonModule[]>, moduleName: string): IHomingPigeonModule[] => {

    if (modules.has(moduleName)) {
        return modules.get(moduleName) as IHomingPigeonModule[];
    }
    return [];
};
