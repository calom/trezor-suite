import * as http from 'http';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { EventEmitter } from 'events';

import { TorControlPort } from './torControlPort';

interface TorConnectionOptions {
    host: string;
    port: number;
}

interface ConnectArgs {
    url: string;
    identity?: string;
}


const DEFAULT_TOR_HOST = '127.0.0.1';
const DEFAULT_TOR_PORT = 38121;
export const DEFAULT_TOR_ADDRESS = `${DEFAULT_TOR_HOST}:${DEFAULT_TOR_PORT}`;


// TODO: if we endup using this, it should be moved to utils package.
export const timeoutPromise = (timeout: number) =>
  new Promise(resolve => setTimeout(resolve, timeout));

export class TorController extends EventEmitter {

    options: TorConnectionOptions;
    identities: { [key: string]: SocksProxyAgent };
    controlPort: TorControlPort;

    constructor(options: TorConnectionOptions) {
        super();
        this.options = options;
        this.controlPort = new TorControlPort();
        this.identities = {
            default: new SocksProxyAgent({
                host: this.options.host,
                port: this.options.port,
                userId: 'default',
                password: 'default',
            })
        }
    }

    connect(args: ConnectArgs) {
        if (args.identity && !this.identities[args.identity]) {
            // create new identity
            this.identities[args.identity] = new SocksProxyAgent({
                host: this.options.host,
                port: this.options.port,
                userId: args.identity,
                password: args.identity,
            });
        }
        const agent = this.identities[args.identity || 'default'];

        const url = new URL(args.url);

        const opts = {
            protocol: url.protocol,
            host: url.hostname,
            agent,
        }

        return new Promise<any>((resolve, reject) => {
            const req = http.get(opts, res => {
                res.on('data', chunk => {
                    console.warn("Chunk", chunk, typeof chunk)
                    res.destroy();
                    resolve(chunk);
                });
            });

            req.on('error', error => {
                console.error(error);
                reject(error);
            });

            req.end();
        });
    }

    async waitUntilAlive() {
        console.log('waitUntilAlive');
        await (async () => {
            const waitUntilResponse = async () => {
                try {
                    const info = await this.controlPort.getInfo();
                    console.log('info', info);
                    if (info === true) {
                        // It is running so let's not wait more.
                    } else {
                        await timeoutPromise(500);
                        await waitUntilResponse();
                    }
                } catch (error) {
                    console.log('error in waitUntilResponse', error);
                    await timeoutPromise(5 * 1000);
                    await waitUntilResponse();

                }
            }
            await waitUntilResponse();
        })();
    }

    async status() {
        try {
            const isTorRunning = await this.controlPort.getInfo();
            return {
                isRunning: isTorRunning,
            }

        } catch (error) {
            return {
                isRunning: false
            }
        }
    }
}
