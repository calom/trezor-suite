/**
 * Tor feature (toggle, configure)
 */
import { session } from 'electron';
import TorProcess from '../libs/processes/TorProcess';
import { onionDomain } from '../config';
import { app, ipcMain } from '../typed-electron';
import { Module } from './index';

const TOR_SUITE_PORT = 38121;
const TOR_SUITE_HOST = '127.0.0.1';
export const TOR_SUITE_ADDRESS = `${TOR_SUITE_HOST}:${TOR_SUITE_PORT}`;

const init: Module = async ({ mainWindow, store, interceptor }) => {
    const { logger } = global;
    const tor = new TorProcess();

    /**
     * Merges given TorSettings with settings already present in the store,
     * persists the result and returns it.
     */
    const persistSettings = (options: Partial<TorSettings>): TorSettings => {
        const newSettings = { ...store.getTorSettings(), ...options };
        store.setTorSettings(newSettings);
        return newSettings;
    };

    const setProxy = (rule: string) => {
        logger.info('tor', `Setting proxy rules to "${rule}"`);
        session.defaultSession.setProxy({
            proxyRules: rule,
        });
    };

    const setupTor = async (settings: TorSettings) => {
        console.log('setupTor');
        // Start (or stop) the bundled tor only if address is the default one.
        // Otherwise the user must run the process themselves.
        const shouldRunTor = settings.running;
        console.log('settings TOR', settings);
        const torStatus = await tor.status();
        console.log('torStatus', torStatus);
        if (shouldRunTor && !torStatus.service) {
            await tor.start();
        } else {
            await tor.stop();
        }

        // Start (or stop) routing all communication through tor.
        if (settings.running) {
            // setProxy(`socks5://${settings.address}`);
            setProxy(`socks5://${TOR_SUITE_ADDRESS}`);
        } else {
            setProxy('');
        }

        // Notify the renderer.
        mainWindow.webContents.send('tor/status', settings.running);
    };

    ipcMain.on('tor/toggle', async (_, start) => {
        logger.info('tor', `Toggling ${start ? 'ON' : 'OFF'}`);
        const settings = persistSettings({ running: start });
        await setupTor(settings);
    });

    ipcMain.on('tor/set-address', async (_, address) => {
        if (store.getTorSettings().address !== address) {
            logger.debug('tor', `Changed address to ${address}`);
            const settings = persistSettings({ address });
            await setupTor(settings);
        }
    });

    ipcMain.on('tor/get-status', () => {
        logger.debug('tor', `Getting status (${store.getTorSettings().running ? 'ON' : 'OFF'})`);
        mainWindow.webContents.send('tor/status', store.getTorSettings().running);
    });

    ipcMain.handle('tor/get-address', () => {
        logger.debug('tor', `Getting address (${store.getTorSettings().address})`);
        return store.getTorSettings().address;
    });

    interceptor.onBeforeRequest(details => {
        const { hostname, protocol } = new URL(details.url);

        // Redirect outgoing trezor.io requests to .onion domain
        if (
            store.getTorSettings().running &&
            hostname.endsWith('trezor.io') &&
            protocol === 'https:'
        ) {
            logger.info('tor', `Rewriting ${details.url} to .onion URL`);
            return {
                redirectURL: details.url.replace(
                    /https:\/\/(([a-z0-9]+\.)*)trezor\.io(.*)/,
                    `http://$1${onionDomain}$3`,
                ),
            };
        }
    });

    app.on('before-quit', () => {
        logger.info('tor', 'Stopping (app quit)');
        tor.stop();
    });

    if (app.commandLine.hasSwitch('tor')) {
        logger.info('tor', 'Tor enabled by command line option.');
        persistSettings({ running: true });
    }

    await setupTor(store.getTorSettings());
};

export default init;
