import { container, showView } from './common';
import type { DeviceMessage } from '@trezor/connect';

export const passphraseOnDeviceView = (payload: ReturnType<typeof DeviceMessage>['payload']) => {
    showView('passphrase-on-device');

    const deviceName = container.getElementsByClassName('device-name')[0] as HTMLElement;
    deviceName.innerText = payload.device.label;
};
