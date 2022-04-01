import BaseProcess, { Status } from './BaseProcess';

import { TorController } from '@trezor/request-manager';

// TODO: use DEFAULT_TOR_ADDRESS from request-manager intead of DEFAULT_ADDRESS
// 9050 is the default port of the tor process.
const TOR_SUITE_PORT = 38121;
const TOR_SUITE_HOST = '127.0.0.1';
export const TOR_SUITE_ADDRESS = `${TOR_SUITE_HOST}:${TOR_SUITE_PORT}`;

class TorProcess extends BaseProcess {
    torController: TorController;

    constructor() {
        super('tor', 'tor');
        this.torController = new TorController({ host: TOR_SUITE_HOST, port: TOR_SUITE_PORT });
    }

    async status(): Promise<Status> {
        try {
            const { isRunning } = await this.torController.status();
            if (isRunning) {
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
        console.log('start tor');
        // TODO: I do not think this `start` is actually returning a pormise
        const returnFromStart = await super.start(['-f', 'torrc']);
        console.log('returnFromStart', returnFromStart);
        console.log('after start tor');
        const alive = await this.torController.waitUntilAlive();
        console.log('alive', alive);
    }
}

export default TorProcess;
