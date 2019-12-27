/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Activity
 * @override Mock
 */

import { Activity } from "../../src/activity";

export const createMockActivity = (chance: Chance.Chance, ...triggers: string[]): Activity => {

    return {

        triggers,

        to: {},
        identifier: chance.string(),

        title: chance.sentence(),
        subject: chance.sentence(),
        content: chance.string(),
        link: chance.url(),
    };
};
