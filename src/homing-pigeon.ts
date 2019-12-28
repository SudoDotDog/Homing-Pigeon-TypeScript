/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 */

import { Activity } from "./activity";
import { executeActivity } from "./core/execute";
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

    public get length(): number {

        return this._modules.size;
    }

    public module(moduleName: string, instance: IHomingPigeonModule): this {

        this._modules.set(moduleName, [...this.getModules(moduleName), instance]);
        return this;
    }

    public validate(activity: Activity): ValidateResult {

        return validateActivity(this._modules, activity);
    }

    public async execute(activity: Activity): Promise<ExecuteResult> {

        return await executeActivity(this._modules, activity);
    }

    public getModules(trigger: string): IHomingPigeonModule[] {

        if (this._modules.has(trigger)) {
            return this._modules.get(trigger) as IHomingPigeonModule[];
        }
        return [];
    }
}
