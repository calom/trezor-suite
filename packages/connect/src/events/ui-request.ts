/*
 * messages to UI emitted as UI_EVENT
 */

import { IFRAME, POPUP } from '../constants';
import type { Messages } from '@trezor/transport';
import type { ConnectSettings, Device, CoinInfo, BitcoinNetworkInfo } from '../types';
import type { DiscoveryAccountType, DiscoveryAccount, SelectFeeLevel } from '../types/account';
import type { TransportInfo } from './transport';

export const UI_EVENT = 'UI_EVENT';
export const UI_REQUEST = {
    TRANSPORT: 'ui-no_transport',
    BOOTLOADER: 'ui-device_bootloader_mode',
    NOT_IN_BOOTLOADER: 'ui-device_not_in_bootloader_mode',
    REQUIRE_MODE: 'ui-device_require_mode',
    INITIALIZE: 'ui-device_not_initialized',
    SEEDLESS: 'ui-device_seedless',
    FIRMWARE_OLD: 'ui-device_firmware_old',
    FIRMWARE_OUTDATED: 'ui-device_firmware_outdated',
    FIRMWARE_NOT_SUPPORTED: 'ui-device_firmware_unsupported',
    FIRMWARE_NOT_COMPATIBLE: 'ui-device_firmware_not_compatible',
    FIRMWARE_NOT_INSTALLED: 'ui-device_firmware_not_installed',
    FIRMWARE_PROGRESS: 'ui-firmware-progress',
    DEVICE_NEEDS_BACKUP: 'ui-device_needs_backup',

    REQUEST_UI_WINDOW: 'ui-request_window',
    CLOSE_UI_WINDOW: 'ui-close_window',

    REQUEST_PERMISSION: 'ui-request_permission',
    REQUEST_CONFIRMATION: 'ui-request_confirmation',
    REQUEST_PIN: 'ui-request_pin',
    INVALID_PIN: 'ui-invalid_pin',
    REQUEST_PASSPHRASE: 'ui-request_passphrase',
    REQUEST_PASSPHRASE_ON_DEVICE: 'ui-request_passphrase_on_device',
    INVALID_PASSPHRASE: 'ui-invalid_passphrase',
    CONNECT: 'ui-connect',
    LOADING: 'ui-loading',
    SET_OPERATION: 'ui-set_operation',
    SELECT_DEVICE: 'ui-select_device',
    SELECT_ACCOUNT: 'ui-select_account',
    CHANGE_ACCOUNT: 'ui-change_account',
    SELECT_FEE: 'ui-select_fee',
    UPDATE_CUSTOM_FEE: 'ui-update_custom_fee',
    INSUFFICIENT_FUNDS: 'ui-insufficient_funds',
    REQUEST_BUTTON: 'ui-button',
    REQUEST_WORD: 'ui-request_word',

    LOGIN_CHALLENGE_REQUEST: 'ui-login_challenge_request',
    CUSTOM_MESSAGE_REQUEST: 'ui-custom_request',
    BUNDLE_PROGRESS: 'ui-bundle_progress',
    ADDRESS_VALIDATION: 'ui-address_validation',
    IFRAME_FAILURE: 'ui-iframe_failure',
} as const;

export interface MessageWithoutPayload {
    type:
        | typeof UI_REQUEST.REQUEST_UI_WINDOW
        | typeof UI_REQUEST.IFRAME_FAILURE
        | typeof POPUP.CANCEL_POPUP_REQUEST
        | typeof POPUP.LOADED
        | typeof UI_REQUEST.TRANSPORT
        | typeof UI_REQUEST.CHANGE_ACCOUNT
        | typeof UI_REQUEST.INSUFFICIENT_FUNDS
        | typeof UI_REQUEST.CLOSE_UI_WINDOW
        | typeof UI_REQUEST.LOGIN_CHALLENGE_REQUEST;
    payload?: typeof undefined;
}

export type DeviceUiMessage =
    | {
          type: typeof UI_REQUEST.REQUEST_PIN;
          payload: {
              device: Device;
              type: Messages.PinMatrixRequestType;
          };
      }
    | {
          type: typeof UI_REQUEST.REQUEST_WORD;
          payload: {
              device: Device;
              type: Messages.WordRequestType;
          };
      }
    | {
          type:
              | typeof UI_REQUEST.INVALID_PIN
              | typeof UI_REQUEST.REQUEST_PASSPHRASE_ON_DEVICE
              | typeof UI_REQUEST.REQUEST_PASSPHRASE
              | typeof UI_REQUEST.INVALID_PASSPHRASE;
          payload: {
              device: Device;
              type?: typeof undefined;
          };
      };

export interface ButtonRequestData {
    type: 'address';
    serializedPath: string;
    address: string;
}

// ButtonRequest_FirmwareUpdate is a artificial button request thrown by "uploadFirmware" method
// at the beginning of the uploading process
export interface ButtonRequestMessage {
    type: typeof UI_REQUEST.REQUEST_BUTTON;
    payload: Omit<Messages.ButtonRequest, 'code'> & {
        code?: Messages.ButtonRequest['code'] | 'ButtonRequest_FirmwareUpdate';
        device: Device;
        data?: ButtonRequestData;
    };
}

export interface AddressValidationMessage {
    type: typeof UI_REQUEST.ADDRESS_VALIDATION;
    payload?: ButtonRequestData;
}

export interface IFrameError {
    type: typeof IFRAME.ERROR;
    payload: {
        error: string;
        code?: string;
    };
}

export type IFrameLoaded = {
    type: typeof IFRAME.LOADED;
    payload: {
        useBroadcastChannel: boolean;
    };
};

export interface PopupInit {
    type: typeof POPUP.INIT;
    payload: {
        settings: ConnectSettings; // those are settings from window.opener
        useBroadcastChannel: boolean;
    };
}

export interface PopupError {
    type: typeof POPUP.ERROR;
    payload: {
        error: string;
    };
}

export interface PopupHandshake {
    type: typeof POPUP.HANDSHAKE;
    payload?: {
        settings: ConnectSettings; // those are settings from the iframe, they could be different from window.opener settings
        method?: string;
        transport?: TransportInfo;
    };
}

export interface RequestPermission {
    type: typeof UI_REQUEST.REQUEST_PERMISSION;
    payload: {
        permissions: string[];
        device: Device;
    };
}

export interface RequestConfirmation {
    type: typeof UI_REQUEST.REQUEST_CONFIRMATION;
    payload: {
        view: string;
        label?: string;
        customConfirmButton?: {
            className: string;
            label: string;
        };
        customCancelButton?: {
            className: string;
            label: string;
        };
    };
}

export interface SelectDevice {
    type: typeof UI_REQUEST.SELECT_DEVICE;
    payload: {
        devices: Device[];
        webusb: boolean;
    };
}

export interface UnexpectedDeviceMode {
    type:
        | typeof UI_REQUEST.BOOTLOADER
        | typeof UI_REQUEST.NOT_IN_BOOTLOADER
        | typeof UI_REQUEST.INITIALIZE
        | typeof UI_REQUEST.SEEDLESS
        | typeof UI_REQUEST.DEVICE_NEEDS_BACKUP;
    payload: Device;
}

export interface FirmwareException {
    type:
        | typeof UI_REQUEST.FIRMWARE_OLD
        | typeof UI_REQUEST.FIRMWARE_OUTDATED
        | typeof UI_REQUEST.FIRMWARE_NOT_SUPPORTED
        | typeof UI_REQUEST.FIRMWARE_NOT_COMPATIBLE
        | typeof UI_REQUEST.FIRMWARE_NOT_INSTALLED;
    payload: Device;
}

export interface SelectAccount {
    type: typeof UI_REQUEST.SELECT_ACCOUNT;
    payload: {
        type: 'start' | 'progress' | 'end';
        coinInfo: CoinInfo;
        accountTypes?: DiscoveryAccountType[];
        defaultAccountType?: DiscoveryAccountType;
        accounts?: DiscoveryAccount[];
        preventEmpty?: boolean;
    };
}

export interface SelectFee {
    type: typeof UI_REQUEST.SELECT_FEE;
    payload: {
        coinInfo: BitcoinNetworkInfo;
        feeLevels: SelectFeeLevel[];
    };
}

export interface UpdateCustomFee {
    type: typeof UI_REQUEST.UPDATE_CUSTOM_FEE;
    payload: {
        coinInfo: BitcoinNetworkInfo;
        feeLevels: SelectFeeLevel[];
    };
}

export interface BundleProgress<R> {
    type: typeof UI_REQUEST.BUNDLE_PROGRESS;
    payload: {
        progress: number;
        response: R;
        error?: string;
    };
}

export interface FirmwareProgress {
    type: typeof UI_REQUEST.FIRMWARE_PROGRESS;
    payload: {
        device: Device;
        progress: number;
    };
}

/*
 * Callback message for CustomMessage method used as sent and received message
 */
export interface CustomMessageRequest {
    type: typeof UI_REQUEST.CUSTOM_MESSAGE_REQUEST;
    payload: {
        type: string;
        message: object;
    };
}

export type UiEvent =
    | MessageWithoutPayload
    | DeviceUiMessage
    | ButtonRequestMessage
    | PopupHandshake
    | RequestPermission
    | RequestConfirmation
    | SelectDevice
    | UnexpectedDeviceMode
    | SelectAccount
    | SelectFee
    | UpdateCustomFee
    | BundleProgress<any>
    | FirmwareProgress
    | CustomMessageRequest;

export const UiMessage = (type: any, payload?: any) => ({
    event: UI_EVENT,
    type,
    payload,
});
