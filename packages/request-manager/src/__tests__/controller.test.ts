import { TorController } from '../controller';

describe('TorController', () => {
    it('identities', async () => {
        const ctrl = new TorController({ host: '127.0.0.1', port: 9050 });
        const identityA = await ctrl.connect({ url: 'http://checkip.amazonaws.com/', identity: 'default' });
        const identityB = await ctrl.connect({ url: 'http://checkip.amazonaws.com/', identity: 'user' });
        const identityA2 = await ctrl.connect({ url: 'http://checkip.amazonaws.com/', identity: 'default' });

        for (let i = 0; i < 10; i++) {
            const start = Date.now();
            // eslint-disable-next-line no-await-in-loop
            await ctrl.connect({ url: 'http://checkip.amazonaws.com/', identity: `user-${  i}` });
            console.log(`identity user-${  i}`, Date.now() - start);
        }

        expect(identityA).toEqual(identityA2);
        expect(identityA).not.toEqual(identityB);
    
        console.log('IP A', identityA.toString(), 'IP B', identityB.toString());
    }, 60000);
});
