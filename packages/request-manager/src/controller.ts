import * as http from 'http';
import * as SocksProxyAgent from 'socks-proxy-agent';
import { EventEmitter } from 'events';

interface TorConnectionOptions {
    host: string;
    port: number;
}

interface ConnectArgs {
    url: string;
    identity?: string;
}

export class TorController extends EventEmitter {

    options: TorConnectionOptions;
    identities: { [key: string]: ReturnType<typeof SocksProxyAgent> };

    constructor(options: TorConnectionOptions) {
        super();
        this.options = options;
        this.identities = {
            default: SocksProxyAgent({
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
            this.identities[args.identity] = SocksProxyAgent({
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
}
