/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { Activity } from "./activity";
import { executeActivity } from "./core/execute";
import { getModules } from "./core/util";
import { validateActivity } from "./core/validate";
import { ExecuteResult, IHomingPigeonModule, ValidateResult } from "./declare";

export class HomingPigeon {

    public static create() {

        return new HomingPigeon();
    }

    private readonly _modules: Map<string, IHomingPigeonModule[]>;

    private constructor() {

        this._modules = new Map<string, IHomingPigeonModule[]>();
    }

    public get keys(): string[] {
        return [...this._modules.keys()];
    }
    public get size(): number {
        return this._modules.size;
    }

    public get length(): number {

        const keys: string[] = this.keys;
        return keys.reduce((previous: number, current: string) => {
            const modules: IHomingPigeonModule[] = this.getModules(current);
            return previous + modules.length;
        }, 0);
    }

    public module(moduleName: string, instance: IHomingPigeonModule): this {

        const newModules: IHomingPigeonModule[] = [
            ...this.getModules(moduleName),
            instance,
        ];
        return this.replaceModule(moduleName, newModules);
    }

    public replaceModule(moduleName: string, instances: IHomingPigeonModule[]): this {

        this._modules.set(moduleName, instances);
        return this;
    }

    public validate(activity: Activity): ValidateResult {

        return validateActivity(this._modules, activity);
    }

    public async execute(activity: Activity): Promise<ExecuteResult> {

        return await executeActivity(this._modules, activity);
    }

    public getModules(trigger: string): IHomingPigeonModule[] {

        return getModules(this._modules, trigger);
    }
}
