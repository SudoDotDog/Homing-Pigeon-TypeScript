/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Activity
 */

export type ActivityFile = {

    readonly filename: string;
    readonly contentType?: string;
    readonly encoding?: string;
} & ({
    readonly content: string;
} | {
    readonly path: string;
});

export type Activity = {

    readonly triggers: string[];

    readonly to: Record<string, any>;
    readonly identifier: string;

    readonly title: string; // Short Description with No Details
    readonly subject: string; // Description with Simple Details
    readonly link: string;
    readonly content: string;

    readonly files?: ActivityFile[];
    readonly extras?: Record<string, any>;
};
