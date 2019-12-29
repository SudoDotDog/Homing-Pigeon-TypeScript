/**
 * @author WMXPY
 * @namespace Core
 * @description Validate
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { ValidateResult } from '../../../src/declare';
import { HomingPigeon } from '../../../src/homing-pigeon';
import { createMockActivity } from '../../mock/activity';

describe('Given [Validate] Core Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-core-validate');

    it('should be able to validate - Happy Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: true,
            shouldProceed: true,
            succeed: {
                [moduleName]: 1,
            },
            failed: {},
            missed: [],
        } as ValidateResult);
    });

    it('should be able to validate multiple - Happy Path Double', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => true,
        }).module(moduleName, {
            validate: () => true,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: true,
            shouldProceed: true,
            succeed: {
                [moduleName]: 2,
            },
            failed: {},
            missed: [],
        } as ValidateResult);
    });

    it('should be able to validate multiple - Mixed Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => true,
        }).module(moduleName, {
            validate: () => false,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: false,
            shouldProceed: true,
            succeed: {
                [moduleName]: 1,
            },
            failed: {
                [moduleName]: 1,
            },
            missed: [],
        } as ValidateResult);
    });

    it('should be able to validate - Sad Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => false,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: false,
            shouldProceed: true,
            succeed: {},
            failed: {
                [moduleName]: 1,
            },
            missed: [],
        } as ValidateResult);
    });

    it('should be able to validate - Sad Required Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            shouldAbort: () => true,
            validate: () => false,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: false,
            shouldProceed: false,
            succeed: {},
            failed: {
                [moduleName]: 1,
            },
            missed: [],
        } as ValidateResult);
    });

    it('should be able to validate - Sad Missed Path', (): void => {

        const moduleName: string = chance.string();

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(chance.string(), {
            shouldAbort: () => true,
            validate: () => false,
            execute: async () => true,
        });

        const validateResult: ValidateResult = instance.validate(createMockActivity(chance, moduleName));

        expect(validateResult).to.be.deep.equal({
            valid: false,
            shouldProceed: false,
            succeed: {},
            failed: {},
            missed: [moduleName],
        } as ValidateResult);
    });
});
