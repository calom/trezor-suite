import { EventEmitter } from 'events';
import { createDeferred, Deferred } from '@trezor/utils/lib/createDeferred';
import { CustomError } from './constants/errors';
import { MESSAGES, RESPONSES } from './constants';
import type { BlockchainSettings } from './types';
import type * as ResponseTypes from './types/responses';
import type * as MessageTypes from './types/messages';
import type { Events } from './types/events';

const workerWrapper = (factory: BlockchainSettings['worker']): Worker => {
    if (typeof factory === 'function') return factory();
    if (typeof factory === 'string' && typeof Worker !== 'undefined') return new Worker(factory);
    // use custom worker
    throw new CustomError('worker_not_found');
};

// initialize worker communication, raise error if worker not found
const initWorker = (settings: BlockchainSettings) => {
    const dfd: Deferred<Worker> = createDeferred(-1);
    const worker = workerWrapper(settings.worker);

    if (typeof worker !== 'object' || typeof worker.postMessage !== 'function') {
        throw new CustomError('worker_invalid');
    }

    const timeout = setTimeout(() => {
        worker.onmessage = null;
        worker.onerror = null;
        dfd.reject(new CustomError('worker_timeout'));
    }, settings.timeout || 30000);

    worker.onmessage = (message: any) => {
        if (message.data.type !== MESSAGES.HANDSHAKE) return;
        clearTimeout(timeout);
        worker.postMessage({
            type: MESSAGES.HANDSHAKE,
            settings: Object.assign(settings, { worker: undefined }), // worker is not serialized
        });
        dfd.resolve(worker);
    };

    worker.onerror = (error: any) => {
        clearTimeout(timeout);
        worker.onmessage = null;
        worker.onerror = null;
        try {
            worker.terminate();
        } catch (error) {
            // empty
        }

        const message = error.message
            ? `Worker runtime error: Line ${error.lineno} in ${error.filename}: ${error.message}`
            : 'Worker handshake error';
        dfd.reject(new CustomError('worker_runtime', message));
    };

    return dfd.promise;
};

declare interface BlockchainLink {
    on<K extends keyof Events>(type: K, listener: (event: Events[K]) => void): this;
    off<K extends keyof Events>(type: K, listener: (event: Events[K]) => void): this;
    emit<K extends keyof Events>(type: K, ...args: Events[K][]): boolean;
}

class BlockchainLink extends EventEmitter {
    settings: BlockchainSettings;

    messageId = 0;

    worker: Worker | undefined;

    deferred: Deferred<any>[] = [];

    private throttleBlockEvent: ReturnType<typeof setTimeout> | undefined;
    private throttleBlockEventTimeout: number;

    constructor(settings: BlockchainSettings) {
        super();
        this.settings = settings;
        this.throttleBlockEventTimeout =
            typeof settings.throttleBlockEvent === 'number' ? settings.throttleBlockEvent : 500;
    }

    async getWorker(): Promise<Worker> {
        if (!this.worker) {
            this.worker = await initWorker(this.settings);
            this.worker.onmessage = this.onMessage.bind(this);
            this.worker.onerror = this.onError.bind(this);
        }
        return this.worker;
    }

    // Sending messages to worker
    async sendMessage<R>(message: any): Promise<R> {
        const worker = await this.getWorker();
        const dfd = createDeferred(this.messageId);
        this.deferred.push(dfd);
        worker.postMessage({ id: this.messageId, ...message });
        this.messageId++;
        return dfd.promise as Promise<R>;
    }

    connect(): Promise<void> {
        return this.sendMessage({
            type: MESSAGES.CONNECT,
        });
    }

    /** Get general information about the network, like current block-height, name, smallest possible division, etc. */
    getInfo(): Promise<ResponseTypes.GetInfo['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_INFO,
        });
    }

    /** Get hash of a block of given height. */
    getBlockHash(
        payload: MessageTypes.GetBlockHash['payload'],
    ): Promise<ResponseTypes.GetBlockHash['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_BLOCK_HASH,
            payload,
        });
    }

    /** Get info about an account, eg. derived addresses, balance, transaction history etc. */
    getAccountInfo(
        payload: MessageTypes.GetAccountInfo['payload'],
    ): Promise<ResponseTypes.GetAccountInfo['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_ACCOUNT_INFO,
            payload,
        });
    }

    /** Get unspent inputs for given account. Works only for bitcoin(like) networks. */
    getAccountUtxo(
        payload: MessageTypes.GetAccountUtxo['payload'],
    ): Promise<ResponseTypes.GetAccountUtxo['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_ACCOUNT_UTXO,
            payload,
        });
    }

    /**
     * Get info about a given transaction.
     * Return value of this method is not identical across networks.
     * this method exposes raw response from the BE.
     */
    getTransaction(
        payload: MessageTypes.GetTransaction['payload'],
    ): Promise<ResponseTypes.GetTransaction['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_TRANSACTION,
            payload,
        });
    }

    /**
     * Get historical progression of given account's balance
     * Used for rendering a graph in Suite's dashboard.
     */
    getAccountBalanceHistory(
        payload: MessageTypes.GetAccountBalanceHistory['payload'],
    ): Promise<ResponseTypes.GetAccountBalanceHistory['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_ACCOUNT_BALANCE_HISTORY,
            payload,
        });
    }

    getCurrentFiatRates(
        payload: MessageTypes.GetCurrentFiatRates['payload'],
    ): Promise<ResponseTypes.GetCurrentFiatRates['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_CURRENT_FIAT_RATES,
            payload,
        });
    }

    /** Get historical fiat rates. Only some backends support this. */
    getFiatRatesForTimestamps(
        payload: MessageTypes.GetFiatRatesForTimestamps['payload'],
    ): Promise<ResponseTypes.GetFiatRatesForTimestamps['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_FIAT_RATES_FOR_TIMESTAMPS,
            payload,
        });
    }

    /** Get fiat currencies for which rates are available. */
    getFiatRatesTickersList(
        payload: MessageTypes.GetFiatRatesTickersList['payload'],
    ): Promise<ResponseTypes.GetFiatRatesTickersList['payload']> {
        return this.sendMessage({
            type: MESSAGES.GET_FIAT_RATES_TICKERS_LIST,
            payload,
        });
    }

    /** Get ‘recommended’ fee value inferred from current traffic in the network. */
    estimateFee(
        payload: MessageTypes.EstimateFee['payload'],
    ): Promise<ResponseTypes.EstimateFee['payload']> {
        return this.sendMessage({
            type: MESSAGES.ESTIMATE_FEE,
            payload,
        });
    }

    /**
     * Subscribe for live changes in
     * - blockchain i.e new blocks mined.
     * - accounts, addresses i.e. new transactions broadcasted or mined.
     * - fiatRates
     * - connection to BE (CONNECT, DISCONNECT)
     *
     * Handling subscription state is left to the user. Hence the purpose of CONNECT and DISCONNECT notifications.
     */
    subscribe(
        payload: MessageTypes.Subscribe['payload'],
    ): Promise<ResponseTypes.Subscribe['payload']> {
        return this.sendMessage({
            type: MESSAGES.SUBSCRIBE,
            payload,
        });
    }

    /** Discard a subscription. */
    unsubscribe(
        payload: MessageTypes.Unsubscribe['payload'],
    ): Promise<ResponseTypes.Unsubscribe['payload']> {
        return this.sendMessage({
            type: MESSAGES.UNSUBSCRIBE,
            payload,
        });
    }

    /** Broadcast a transaction to the network. */
    pushTransaction(
        payload: MessageTypes.PushTransaction['payload'],
    ): Promise<ResponseTypes.PushTransaction['payload']> {
        return this.sendMessage({
            type: MESSAGES.PUSH_TRANSACTION,
            payload,
        });
    }

    // eslint-disable-next-line require-await
    async disconnect(): Promise<boolean> {
        if (!this.worker) return true;
        return this.sendMessage({
            type: MESSAGES.DISCONNECT,
        });
    }

    // worker messages handler
    onMessage: (event: { data: ResponseTypes.Response }) => void = event => {
        if (!event.data) return;
        const { data } = event;

        if (data.id === -1) {
            this.onEvent(data);
            return;
        }

        const dfd = this.deferred.find(d => d.id === data.id);
        if (!dfd) {
            return;
        }
        if (data.type === RESPONSES.ERROR) {
            dfd.reject(new CustomError(data.payload.code, data.payload.message));
        } else {
            dfd.resolve(data.payload);
        }
        this.deferred = this.deferred.filter(d => d !== dfd);
    };

    onEvent: (data: ResponseTypes.Response) => void = data => {
        if (data.type === RESPONSES.CONNECTED) {
            this.emit('connected');
        }
        if (data.type === RESPONSES.DISCONNECTED) {
            this.emit('disconnected');
        }
        if (data.type === RESPONSES.NOTIFICATION) {
            const notification = data.payload;
            if (notification.type === 'block') {
                // throttle block events
                if (this.throttleBlockEvent) clearTimeout(this.throttleBlockEvent);
                this.throttleBlockEvent = setTimeout(() => {
                    this.emit(notification.type, notification.payload);
                    this.throttleBlockEvent = undefined;
                }, this.throttleBlockEventTimeout);
            } else {
                this.emit(notification.type, notification.payload);
            }
        }
    };

    onError: (error: { message?: string; lineno: number; filename: string }) => void = error => {
        const message = error.message
            ? `Worker runtime error: Line ${error.lineno} in ${error.filename}: ${error.message}`
            : 'Worker handshake error';
        const e = new CustomError('worker_runtime', message);
        // reject all pending responses
        this.deferred.forEach(d => {
            d.reject(e);
        });
        this.deferred = [];
    };

    dispose() {
        this.removeAllListeners();
        const { worker } = this;
        if (worker) {
            worker.terminate();
            delete this.worker;
        }
    }
}

export default BlockchainLink;

// reexport types
export type { Message } from './types/messages';
export type { Response, BlockEvent, NotificationEvent, FiatRatesEvent } from './types/responses';
export type {
    Address,
    AccountAddresses,
    AccountInfo,
    BlockchainSettings,
    FiatRates,
    ServerInfo,
    SubscriptionAccountInfo,
    Target,
    TokenInfo,
    TokenTransfer,
    Transaction,
    TransactionDetail,
    TypedRawTransaction,
    Utxo,
} from './types/common';
