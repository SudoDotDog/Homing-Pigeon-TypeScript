/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Declare
 */

import { Activity } from "./activity";

export interface IHomingPigeonModule {

    shouldAbort?(activity: Activity): boolean;
    validate(activity: Activity): boolean;
    execute(activity: Activity): Promise<boolean>;
}

export type ValidateResult = {

    readonly valid: boolean;
    readonly shouldProceed: boolean;

    readonly succeed: Record<string, number>;
    readonly failed: Record<string, number>;

    readonly missed: string[];
};

export type ExecuteResult = {

    readonly proceed: boolean;

    readonly succeed: Record<string, number>;
    readonly validateFailed: Record<string, number>;
    readonly executeFailed: Record<string, number>;

    readonly missed: string[];
    readonly errors: Record<string, any>;
};
