import React, { useMemo } from 'react';

import styled from 'styled-components';
import { variables } from '@trezor/components';
import * as routerActions from '@suite-actions/routerActions';
import * as messageSystemActions from '@suite-actions/messageSystemActions';
import { useActions, useSelector } from '@suite-hooks';
import { getTorUrlIfAvailable } from '@suite-utils/tor';
import { Banner } from './Banner';

import type { Message } from '@suite-types/messageSystem';

const BannerOnTop = styled(Banner)`
    position: relative;
    z-index: ${variables.Z_INDEX.BANNER_ON_TOP};
`;

type Props = {
    message: Message;
};

const MessageSystemBanner = ({ message }: Props) => {
    const { cta, variant, id, content, dismissible } = message;

    const { language, tor, torOnionLinks } = useSelector(state => ({
        language: state.suite.settings.language,
        tor: state.suite.tor,
        torOnionLinks: state.suite.settings.torOnionLinks,
    }));

    const { goto, dismissNotification } = useActions({
        goto: routerActions.goto,
        dismissNotification: messageSystemActions.dismissMessage,
    });

    const actionConfig = useMemo(() => {
        if (!cta) return undefined;

        const { action, label, link } = cta;

        let onClick: () => Window | Promise<void> | null;
        if (action === 'internal-link') {
            // @ts-ignore: impossible to add all href options to the message system config json schema
            onClick = () => goto(link);
        } else if (action === 'external-link') {
            onClick = () =>
                window.open(tor && torOnionLinks ? getTorUrlIfAvailable(link) : link, '_blank');
        }

        return {
            label: label[language] || label.en,
            onClick: onClick!,
            'data-test': `@message-system/${id}/cta`,
        };
    }, [id, cta, goto, language, tor, torOnionLinks]);

    const dismissalConfig = useMemo(() => {
        if (!dismissible) return undefined;

        return {
            onClick: () => dismissNotification(id, 'banner'),
            'data-test': `@message-system/${id}/dismiss`,
        };
    }, [id, dismissible, dismissNotification]);

    return (
        <BannerOnTop
            variant={variant}
            body={content[language] || content.en}
            action={actionConfig}
            dismissal={dismissalConfig}
        />
    );
};

export default MessageSystemBanner;
