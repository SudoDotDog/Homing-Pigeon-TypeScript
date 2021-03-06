/**
 * @author WMXPY
 * @namespace Core
 * @description Execute
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { ExecuteResult } from '../../../src/declare';
import { HomingPigeon } from '../../../src/homing-pigeon';
import { createMockActivity } from '../../mock/activity';

describe('Given [Execute] Core Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-core-execute');

    it('should be able to execute - Happy Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return true;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(1);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {
                [moduleName]: 1,
            },
            validateFailed: {},
            executeFailed: {},
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Happy Path Double', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return true;
            },
        }).module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return true;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(2);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {
                [moduleName]: 2,
            },
            validateFailed: {},
            executeFailed: {},
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Mixed Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return true;
            },
        }).module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return false;
            },
        }).module(moduleName, {
            validate: () => false,
            execute: async () => {
                count++;
                return false;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(2);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {
                [moduleName]: 1,
            },
            validateFailed: {
                [moduleName]: 1,
            },
            executeFailed: {
                [moduleName]: 1,
            },
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Validate Failed Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => false,
            execute: async () => {
                count++;
                return true;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(0);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {},
            validateFailed: {
                [moduleName]: 1,
            },
            executeFailed: {},
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Required Validate Failed Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            shouldAbort: () => true,
            validate: () => false,
            execute: async () => {
                count++;
                return true;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(0);
        expect(executeResult).to.be.deep.equal({
            proceed: false,
            missed: [],
            succeed: {},
            validateFailed: {
                [moduleName]: 1,
            },
            executeFailed: {},
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Execute Failed Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                return false;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(1);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {},
            validateFailed: {},
            executeFailed: {
                [moduleName]: 1,
            },
            errors: {},
        } as ExecuteResult);
    });

    it('should be able to execute - Error Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        const message: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(moduleName, {
            validate: () => true,
            execute: async () => {
                count++;
                throw message;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(1);
        expect(executeResult).to.be.deep.equal({
            proceed: true,
            missed: [],
            succeed: {},
            validateFailed: {},
            executeFailed: {
                [moduleName]: 1,
            },
            errors: {
                [moduleName]: message,
            },
        } as ExecuteResult);
    });

    it('should be able to execute - Missed Path', async (): Promise<void> => {

        const moduleName: string = chance.string();
        let count: number = 0;

        const instance: HomingPigeon = HomingPigeon.create();
        instance.module(chance.string(), {
            validate: () => true,
            execute: async () => {
                count++;
                return true;
            },
        });

        const executeResult: ExecuteResult = await instance.execute(createMockActivity(chance, moduleName));

        expect(count).to.be.equal(0);
        expect(executeResult).to.be.deep.equal({
            proceed: false,
            missed: [moduleName],
            succeed: {},
            validateFailed: {},
            executeFailed: {},
            errors: {},
        } as ExecuteResult);
    });
});
