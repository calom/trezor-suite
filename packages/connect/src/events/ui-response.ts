import type { CustomMessageRequest } from './ui-request';
import type { Device } from '../types/device';

/*
 * messages from UI sent by popup or using .uiResponse method
 */

export const UI_RESPONSE = {
    RECEIVE_PERMISSION: 'ui-receive_permission',
    RECEIVE_CONFIRMATION: 'ui-receive_confirmation',
    RECEIVE_PIN: 'ui-receive_pin',
    RECEIVE_PASSPHRASE: 'ui-receive_passphrase',
    RECEIVE_DEVICE: 'ui-receive_device',
    RECEIVE_ACCOUNT: 'ui-receive_account',
    RECEIVE_FEE: 'ui-receive_fee',
    RECEIVE_WORD: 'ui-receive_word',
    INVALID_PASSPHRASE_ACTION: 'ui-invalid_passphrase_action',
    CHANGE_SETTINGS: 'ui-change_settings',
    CUSTOM_MESSAGE_RESPONSE: 'ui-custom_response',
    LOGIN_CHALLENGE_RESPONSE: 'ui-login_challenge_response',
} as const;

export interface ReceivePermission {
    type: typeof UI_RESPONSE.RECEIVE_PERMISSION;
    payload: {
        granted: boolean;
        remember: boolean;
    };
}

export interface ReceiveConfirmation {
    type: typeof UI_RESPONSE.RECEIVE_CONFIRMATION;
    payload: boolean;
}

export interface ReceiveDevice {
    type: typeof UI_RESPONSE.RECEIVE_DEVICE;
    payload: {
        device: Device;
        remember: boolean;
    };
}

export interface ReceivePin {
    type: typeof UI_RESPONSE.RECEIVE_PIN;
    payload: string;
}

export interface ReceiveWord {
    type: typeof UI_RESPONSE.RECEIVE_WORD;
    payload: string;
}

export interface ReceivePassphrase {
    type: typeof UI_RESPONSE.RECEIVE_PASSPHRASE;
    payload: {
        save: boolean;
        value: string;
        passphraseOnDevice?: boolean;
    };
}

export interface ReceivePassphraseAction {
    type: typeof UI_RESPONSE.INVALID_PASSPHRASE_ACTION;
    payload: boolean;
}

export interface ReceiveAccount {
    type: typeof UI_RESPONSE.RECEIVE_ACCOUNT;
    payload?: number;
}

export interface ReceiveFee {
    type: typeof UI_RESPONSE.RECEIVE_FEE;
    payload:
        | {
              type: 'compose-custom';
              value: number;
          }
        | {
              type: 'change-account';
          }
        | {
              type: 'send';
              value: string;
          };
}

export type UiResponse =
    | ReceivePermission
    | ReceiveConfirmation
    | ReceiveDevice
    | ReceivePin
    | ReceiveWord
    | ReceivePassphrase
    | ReceivePassphraseAction
    | ReceiveAccount
    | ReceiveFee
    | CustomMessageRequest;
