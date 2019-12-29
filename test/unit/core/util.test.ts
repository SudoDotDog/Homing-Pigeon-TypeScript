/**
 * @author WMXPY
 * @namespace Core
 * @description Util
 * @override Unit
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { getModules } from '../../../src/core/util';
import { IHomingPigeonModule } from '../../../src/declare';

describe('Given [Util] Core Function', (): void => {

    const chance: Chance.Chance = new Chance('homing-pigeon-core-util');

    it('should be able to get module', (): void => {

        const moduleName: string = chance.string();

        const modules: Map<string, IHomingPigeonModule[]> = new Map<string, IHomingPigeonModule[]>();

        modules.set(moduleName, [{
            validate: () => true,
            execute: async () => true,
        }]);

        const result: IHomingPigeonModule[] = getModules(modules, moduleName);

        expect(result).to.be.lengthOf(1);
    });

    it('should be able to get module thats empty', (): void => {

        const moduleName: string = chance.string();

        const modules: Map<string, IHomingPigeonModule[]> = new Map<string, IHomingPigeonModule[]>();

        modules.set(moduleName, [{
            validate: () => true,
            execute: async () => true,
        }]);

        const result: IHomingPigeonModule[] = getModules(modules, chance.string());

        expect(result).to.be.lengthOf(0);
    });
});
