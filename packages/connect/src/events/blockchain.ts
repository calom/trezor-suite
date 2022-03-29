import type {
    ServerInfo,
    BlockEvent,
    FiatRatesEvent,
    NotificationEvent,
} from '@trezor/blockchain-link';
import type { CoinInfo } from '../types/coinInfo';

export const BLOCKCHAIN_EVENT = 'BLOCKCHAIN_EVENT';
export const BLOCKCHAIN = {
    CONNECT: 'blockchain-connect',
    ERROR: 'blockchain-error',
    BLOCK: 'blockchain-block',
    NOTIFICATION: 'blockchain-notification',
    FIAT_RATES_UPDATE: 'fiat-rates-update',
} as const;

export interface BlockchainInfo extends ServerInfo {
    coin: CoinInfo;
    cleanUrl?: string;
    misc?: {
        reserve?: string;
    };
}

export interface BlockchainError {
    coin: CoinInfo;
    error: string;
    code?: string;
}

export type BlockchainBlock = BlockEvent['payload'] & {
    coin: CoinInfo;
};

export interface BlockchainNotification {
    coin: CoinInfo;
    notification: NotificationEvent['payload'];
}

export interface BlockchainFiatRatesUpdate {
    coin: CoinInfo;
    rates: FiatRatesEvent['payload'];
}

export type BlockchainEvent =
    | {
          type: typeof BLOCKCHAIN.CONNECT;
          payload: BlockchainInfo;
      }
    | {
          type: typeof BLOCKCHAIN.ERROR;
          payload: BlockchainError;
      }
    | {
          type: typeof BLOCKCHAIN.BLOCK;
          payload: BlockchainBlock;
      }
    | {
          type: typeof BLOCKCHAIN.NOTIFICATION;
          payload: BlockchainNotification;
      }
    | {
          type: typeof BLOCKCHAIN.FIAT_RATES_UPDATE;
          payload: BlockchainFiatRatesUpdate;
      };

// type DetailedEvent<Event> = Event extends { type: any }
//     ? Event extends { payload: any }
//         ? (type: Event['type'], payload: Event['payload']) => any
//         : (type: Event['type']) => any
//     : never;

// // type U = UnionToIntersection<BlockchainEvent & { event: typeof BLOCKCHAIN_EVENT }>;
// type U = DetailedEvent<BlockchainEvent>;
// const foo: U = () => 1;

export const BlockchainMessage = (type: any, payload: any) =>
    ({
        event: BLOCKCHAIN_EVENT,
        type,
        payload,
    } as const);
