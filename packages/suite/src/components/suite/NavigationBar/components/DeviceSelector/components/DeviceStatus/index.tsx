import React from 'react';
import { Icon, variables, useTheme, SuiteThemeColors } from '@trezor/components';
import styled from 'styled-components';
import * as deviceUtils from '@suite-utils/device';
import { TrezorDevice } from '@suite-types';
import { Translation } from '@suite-components/Translation';
import StatusLight from '@suite-components/StatusLight';

type Status = 'connected' | 'disconnected' | 'warning';

const getStatusColor = (status: Status, theme: SuiteThemeColors, isBackground?: boolean) => {
    const statusBackgroundColors = {
        connected: theme.BG_LIGHT_GREEN,
        disconnected: theme.BG_LIGHT_RED,
        warning: theme.TYPE_LIGHT_ORANGE,
    };

    const statusColors = {
        connected: theme.TYPE_GREEN,
        disconnected: theme.TYPE_RED,
        warning: theme.TYPE_ORANGE,
    };

    return isBackground ? statusBackgroundColors[status] : statusColors[status];
};

const getStatusForDevice = (device: TrezorDevice) => {
    const deviceStatus = deviceUtils.getStatus(device);
    const needsAttention = deviceUtils.deviceNeedsAttention(deviceStatus);

    if (!device.connected) {
        return 'disconnected';
    }
    if (needsAttention) {
        return 'warning';
    }
    return 'connected';
};

const getTextForStatus = (status: 'connected' | 'disconnected' | 'warning') => {
    switch (status) {
        case 'connected':
            return <Translation id="TR_CONNECTED" />;
        case 'disconnected':
            return <Translation id="TR_DISCONNECTED" />;
        case 'warning':
        default:
            return <Translation id="TR_WARNING" />;
    }
};

const StatusText = styled.div<{ show: boolean; status: Status }>`
    position: absolute;
    top: 5px;
    right: ${({ show }) => (show ? '6px' : '-10px')};
    padding: 3px 6px 2px 24px;
    border-radius: 6px;
    background: linear-gradient(
        90deg,
        ${({ theme, status }) => `${getStatusColor(status, theme, true)}00`} 0%,
        ${({ theme, status }) => getStatusColor(status, theme, true)} 20px,
        ${({ theme, status }) => getStatusColor(status, theme, true)} 100%
    );
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${({ status, theme }) => getStatusColor(status, theme)};
    text-transform: uppercase;
    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 0.5s ease, right 0.5s ease;
`;

const IconWrapper = styled.div`
    display: flex;
    align-self: flex-start;
    margin-top: 4px;
`;

const StyledStatusLight = styled(StatusLight)<{ show: boolean }>`
    top: 12px;
    right: ${({ show }) => (show ? '12px' : '48px')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 0.5s ease, right 0.5s ease;
`;

interface DeviceStatusProps {
    device: TrezorDevice;
    onRefreshClick?: () => void;
    showTextStatus?: boolean;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({
    device,
    onRefreshClick,
    showTextStatus = false,
}) => {
    const status = getStatusForDevice(device);
    const theme = useTheme();

    const lightStatuses = {
        connected: 'ok',
        disconnected: 'error',
        warning: 'warning',
    } as const;

    // if device needs attention and CTA func was passed show refresh button
    if (status === 'warning' && onRefreshClick) {
        return (
            <IconWrapper>
                <Icon
                    onClick={(e: any) => {
                        e.stopPropagation();
                        onRefreshClick();
                    }}
                    icon="REFRESH"
                    size={16}
                    color={getStatusColor(status, theme)}
                />
            </IconWrapper>
        );
    }

    // otherwise show dot icon (green/orange/red)
    return (
        <>
            <StatusText status={status} show={showTextStatus}>
                {getTextForStatus(status)}
            </StatusText>

            <StyledStatusLight status={lightStatuses[status]} show={!showTextStatus} />
        </>
    );
};
