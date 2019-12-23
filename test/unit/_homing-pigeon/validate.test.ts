/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon Validate
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';

describe('Given {HomingPigeon} Class - [Validate] Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-validate');

    it('should be able to validate', (): void => {

        expect(chance.string()).to.be.not.equal(chance.string());
    });
});
