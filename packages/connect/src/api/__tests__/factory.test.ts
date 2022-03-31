import { factory } from '../factory';

describe('api/factory', () => {
    it('call', () => {
        // const call: any = (...args: any[]) => {
        //     // @ts-ignore
        //     // eslint-disable-next-line no-caller, no-restricted-properties
        //     console.warn('CALL', ...args);
        // };

        // const api = factory({ call });
        // api.applyFlags({ flags: 1 });

        console.log('API', factory);

        expect(1).toBe(1);
    });
});
