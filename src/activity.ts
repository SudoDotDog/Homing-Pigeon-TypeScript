/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Activity
 */

export type Activity = {

    readonly triggers: string[];

    readonly to: Record<string, any>;
    readonly identifier: string;

    readonly title: string;
    readonly content: string;
    readonly link: string;

    readonly extras?: Record<string, any>;
};
