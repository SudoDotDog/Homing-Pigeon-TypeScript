/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Declare
 */

import { Activity } from "./activity";

export interface IHomingPigeonModule {

    readonly name: string;

    readonly required?: boolean;

    validate(activity: Activity): boolean;
    execute(activity: Activity): Promise<boolean>;
}

export type ValidateResult = {

    readonly valid: boolean;
    readonly shouldProceed: boolean;

    readonly succeed: string[];
    readonly failed: string[];
    readonly missed: string[];
};

export type ExecuteResult = {

    readonly proceed: boolean;
    readonly missed: string[];
    readonly succeed: string[];
    readonly validateFailed: string[];
    readonly executeFailed: string[];
    readonly errors: Record<string, any>;
};
