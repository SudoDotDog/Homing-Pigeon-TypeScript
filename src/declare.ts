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

    readonly failed?: string[];
    readonly missed?: string[];
};

export type ExecuteResult = {

    readonly proceed: boolean;
    readonly succeed: string[];
    readonly failed: string[];
    readonly errors: Record<string, any>;
};

export const createProceedExecuteResult = (succeed: string[], failed: string[], errors: Record<string, any>): ExecuteResult => {

    return {
        proceed: true,
        succeed,
        failed,
        errors,
    };
};

export const createAbortedExecuteResult = (): ExecuteResult => {

    return {
        proceed: false,
        succeed: [],
        failed: [],
        errors: {},
    };
};
