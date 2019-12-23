/**
 * @author WMXPY
 * @namespace HomingPigeon
 * @description HomingPigeon Execute
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { ExecuteResult } from '../../../src/declare';
import { HomingPigeon } from '../../../src/homing-pigeon';
import { createMockActivity } from '../../mock/activity';

describe('Given {HomingPigeon} Class - [Execute] Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-validate');

    it('should be able to execute - Happy Path', async (): Promise<void> => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module({
            name: moduleName,
            validate: () => true,
            execute: async () => true,
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: [moduleName],
            validateFailed: [],
            executeFailed: [],
            errors: {},
        } as ExecuteResult);
    });
});
