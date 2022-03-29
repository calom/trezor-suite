export const TRANSPORT_EVENT = 'TRANSPORT_EVENT';
export const TRANSPORT = {
    START: 'transport-start',
    ERROR: 'transport-error',
    UPDATE: 'transport-update',
    STREAM: 'transport-stream',
    REQUEST: 'transport-request_device',
    DISABLE_WEBUSB: 'transport-disable_webusb',
    START_PENDING: 'transport-start_pending',
} as const;

export interface BridgeInfo {
    version: number[];
    directory: string;
    packages: Array<{
        name: string;
        platform: string[];
        url: string;
        signature?: string;
        preferred?: boolean;
    }>;
    changelog: string;
}

export interface UdevInfo {
    directory: string;
    packages: Array<{
        name: string;
        platform: string[];
        url: string;
        signature?: string;
        preferred?: boolean;
    }>;
}

export interface TransportInfo {
    type: string;
    version: string;
    outdated: boolean;
    bridge?: BridgeInfo;
    udev?: UdevInfo;
}

export type TransportEvent =
    | {
          type: typeof TRANSPORT.START;
          payload: TransportInfo;
      }
    | {
          type: typeof TRANSPORT.ERROR;
          payload: {
              error: string;
              code?: string;
              bridge?: BridgeInfo;
              udev?: UdevInfo;
          };
      };

export const TransportMessage = (type: any, payload: any) => {
    if (type === TRANSPORT.ERROR) {
        if (typeof payload.error !== 'string') {
            const e: any = payload.error;
            // convert Error/TypeError object into payload error type (Error object/class is converted to string while sent via postMessage)
            payload = {
                ...payload,
                error: e.message,
                code: e.code,
            };
        }
    }
    return {
        event: TRANSPORT_EVENT,
        type,
        payload,
    } as const;
};
