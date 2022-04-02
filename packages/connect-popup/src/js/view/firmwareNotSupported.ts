import { showView } from './common';
import type { UnexpectedDeviceMode } from '@trezor/connect';

export const firmwareNotSupported = (device: UnexpectedDeviceMode['payload']) => {
    const view = showView('firmware-not-supported');
    if (!device.features) return;
    const { features } = device;

    const h3 = view.getElementsByTagName('h3')[0];
    h3.innerHTML = `${features.major_version === 1 ? 'Trezor One' : 'Trezor T'} is not supported`;
};
