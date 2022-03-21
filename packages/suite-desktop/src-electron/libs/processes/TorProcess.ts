import BaseProcess, { Status } from './BaseProcess';

import { TorController } from '@trezor/request-manager';

// TODO: use DEFAULT_TOR_ADDRESS from request-manager intead of DEFAULT_ADDRESS
// 9050 is the default port of the tor process.
export const DEFAULT_ADDRESS = '127.0.0.1:9050';

class TorProcess extends BaseProcess {
    torController: TorController;

    constructor() {
        super('tor', 'tor');
        this.torController = new TorController({ host: '127.0.0.1', port: 9050 });
    }

    async status(): Promise<Status> {
        try {
            const resp = await this.torController.status();
            if (resp.status === 501 && resp.statusText.startsWith('Tor')) {
                return {
                    service: true,
                    process: true,
                };
            }
        } catch {
            //
        }

        // process
        return {
            service: false,
            process: Boolean(this.process),
        };
    }

    async start(): Promise<void> {
        await super.start(['-f', 'torrc']);
    }
}

export default TorProcess;
