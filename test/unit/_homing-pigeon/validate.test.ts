/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon Validate
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { ValidateResult } from '../../../src/declare';
import { HomingPigeon } from '../../../src/homing-pigeon';
import { createMockActivity } from '../../mock/activity';

describe('Given {HomingPigeon} Class - [Validate] Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-validate');

    it('should be able to validate - Happy Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module({
            name: moduleName,
            validate: () => true,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: true,
            shouldProceed: true,
            succeed: [moduleName],
            failed: [],
            missed: [],
        } as ValidateResult);
    });
});
