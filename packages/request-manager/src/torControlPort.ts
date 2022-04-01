import net, { Socket } from 'net';

const TOR_SUITE_CONTROL_PORT_HOST = '127.0.0.1';
const TOR_SUITE_CONTROL_PORT = 38122;

 export class TorControlPort {
    socket: Socket;
    isSocketConnected = false;

    constructor() {
        console.log('TorControlPort contructor');
        this.socket = new net.Socket();
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.isSocketConnected) {
                resolve(true);
            }

            // Establish a TCP connection
            this.socket.connect(TOR_SUITE_CONTROL_PORT, TOR_SUITE_CONTROL_PORT_HOST);

            this.socket.on('connect', () => {
                console.log('connect');
                this.isSocketConnected =  true;
                resolve(true);
            });

            this.socket.on('close', error => {
                console.log('error', error);
                reject(error);
            });

            this.socket.on('timeout', () => {
                console.log('timeout');
            });

            this.socket.on('data', data => {
                console.log('data', data);
            });

            this.socket.on('end', (error: unknown) => {
                console.log('end', error);
                reject(error);
            });

            this.socket.on('error', error => {
                console.log('error', error);
                reject(error);
            });
        })
    }

    authenticate() {
    }

    async getInfo() {
        console.log('getInfo');
        console.log('this.isSocketConnected', this.isSocketConnected);
        if (!this.isSocketConnected) {
            await this.connect();
        }
        return new Promise((resolve) => {
            // TODO: AUTHENTICATE has to be extended to use CookieAuthentication
            // so only suite is able to access the ControlPort.
            this.socket.write('AUTHENTICATE\n', () => {
                console.log('autenticate callback!!!');
                resolve(this.socket.write('GETINFO circuit-status\n'));
            });
        });
    }

}