import { UiMessage, UI } from '@trezor/connect';
import { container, showView, postMessage } from './common';
import type { DeviceMessage } from '@trezor/connect';

export const initInvalidPassphraseView = (
    _payload: ReturnType<typeof DeviceMessage>['payload'],
) => {
    showView('invalid-passphrase');

    const retryButton = container.getElementsByClassName('retry')[0] as HTMLButtonElement;
    const useCurrentButton = container.getElementsByClassName('useCurrent')[0] as HTMLButtonElement;

    retryButton.onclick = () => {
        postMessage(UiMessage(UI.INVALID_PASSPHRASE_ACTION, true));
        showView('loader');
    };

    useCurrentButton.onclick = () => {
        postMessage(UiMessage(UI.INVALID_PASSPHRASE_ACTION, false));
        showView('loader');
    };
};
