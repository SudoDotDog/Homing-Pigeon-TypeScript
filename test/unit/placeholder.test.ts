/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description Placeholder
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';

describe('placeholder', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon');

    it('placeholder', (): void => {

        expect(chance.string()).to.be.not.equal(chance.string());
    });
});
