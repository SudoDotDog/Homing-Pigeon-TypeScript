/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { HomingPigeon } from '../../src/homing-pigeon';

describe('Given {HomingPigeon} Class', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon');

    it('should be able to build', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();

        instance.module({
            name: moduleName,
            validate: () => true,
            execute: async () => true,
        });

        expect(instance).to.be.lengthOf(1);
    });
});
