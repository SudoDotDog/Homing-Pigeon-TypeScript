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
};

export const createValidateResult = (valid: boolean, shouldProceed: boolean): ValidateResult => {

    return {
        valid,
        shouldProceed,
    };
};
