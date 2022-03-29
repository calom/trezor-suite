export const CORE_EVENT = 'CORE_EVENT';
export const RESPONSE_EVENT = 'RESPONSE_EVENT';

export type CoreEvent = {
    event: string;
    type: string;
    payload: any;
    id?: number; // response id in ResponseMessage
    success?: boolean; // response status in ResponseMessage
};

export type PostMessageEvent = MessageEvent<CoreEvent>;

// parse MessageEvent .data into CoreMessage
export const parseMessage = (messageData: any): CoreEvent => {
    const message: CoreEvent = {
        event: messageData.event,
        type: messageData.type,
        payload: messageData.payload,
    };

    if (typeof messageData.id === 'number') {
        message.id = messageData.id;
    }

    if (typeof messageData.success === 'boolean') {
        message.success = messageData.success;
    }

    return message;
};

// common response used straight from npm index (not from Core)
export const ErrorMessage = (error: any) => ({
    success: false,
    payload: {
        error: error.message,
        code: error.code,
    },
});

// REF-TODO: connect has CoreMessage which is the same like CoreEvent defined here
// https://github.com/trezor/connect/blob/develop/src/js/types/params.js#L88
export const ResponseMessage = (id: number, success: boolean, payload: any = null): CoreEvent => ({
    event: RESPONSE_EVENT,
    type: RESPONSE_EVENT,
    id,
    success,
    // convert Error/TypeError object into payload error type (Error object/class is converted to string while sent via postMessage)
    payload: success ? payload : { error: payload.error.message, code: payload.error.code },
});
