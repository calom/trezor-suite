import React from 'react';
import styled from 'styled-components';
import { ConfirmOnDevice } from '@trezor/components';
import { Modal, ModalProps } from '@suite-components';
import { Translation } from '@suite-components/Translation';
import DeviceConfirmImage from '@suite-components/images/DeviceConfirmImage';
import { TrezorDevice } from '@suite-types';

const StyledModal = styled(Modal)`
    width: 360px;
`;

interface ConfirmActionProps extends ModalProps {
    device: TrezorDevice;
}

const ConfirmAction = ({ device, ...rest }: ConfirmActionProps) => (
    <StyledModal
        header={
            <ConfirmOnDevice
                title={<Translation id="TR_CONFIRM_ON_TREZOR" />}
                trezorModel={device.features?.major_version === 1 ? 1 : 2}
                animated
            />
        }
        heading={
            <Translation id="TR_CONFIRM_ACTION_ON_YOUR" values={{ deviceLabel: device.label }} />
        }
        data-test="@suite/modal/confirm-action-on-device"
        {...rest}
    >
        <DeviceConfirmImage device={device} />
    </StyledModal>
);

export default ConfirmAction;
