import React, { useState } from 'react';
import styled from 'styled-components';
import { P, Button, variables } from '@trezor/components';

import { Translation, Modal } from '@suite-components';
import { useActions } from '@suite-hooks';
import * as metadataActions from '@suite-actions/metadataActions';
import type { Deferred } from '@trezor/utils';
import { MetadataProviderType } from '@suite-types/metadata';
import { isEnabled } from '@suite-utils/features';

const { FONT_SIZE, FONT_WEIGHT, SCREEN_SIZE } = variables;

const Error = styled.div`
    margin-top: 8px;
    font-size: ${FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_RED};
`;

// todo: can't use button from @trezor/components directly, probably inconsistent design again
// background-color is not even in components color palette
const StyledButton = styled(Button)`
    padding: 10px;
    margin: 0 16px;
    font-size: ${FONT_SIZE.NORMAL};
    background-color: ${props => props.theme.BG_GREY};
    font-weight: ${FONT_WEIGHT.DEMI_BOLD};
    height: 42px;

    @media (min-width: ${SCREEN_SIZE.SM}) {
        width: 210px;
    }
`;

// todo: typography shall be unified and these ad hoc styles removed..
const StyledP = styled(P)`
    color: ${props => props.theme.TYPE_DARK_GREY};
    margin-bottom: 25px;
    font-size: ${FONT_SIZE.SMALL};
    font-weight: ${FONT_WEIGHT.REGULAR};
`;

const StyledModal = styled(Modal)`
    width: 600px;
`;

type MetadataProviderProps = {
    onCancel: () => void;
    decision: Deferred<boolean>;
};

const MetadataProvider = ({ onCancel, decision }: MetadataProviderProps) => {
    const [isLoading, setIsLoading] = useState('');
    // error from authorization popup
    const [error, setError] = useState('');
    const { connectProvider } = useActions({ connectProvider: metadataActions.connectProvider });

    const onModalCancel = () => {
        decision.resolve(false);
        onCancel();
    };

    const connect = async (type: MetadataProviderType) => {
        setIsLoading(type);
        const result = await connectProvider(type);
        // window close indicates user action, user knows what happened, no need to show an error message
        if (result === 'window closed') {
            setIsLoading('');
            // stop here, user might have changed his decision and wants to use another provider
            return;
        }
        if (typeof result === 'string') {
            setError(result);
            setIsLoading('');
            return;
        }

        decision.resolve(true);
        onCancel();
    };

    return (
        <StyledModal
            cancelable
            onCancel={onModalCancel}
            heading={<Translation id="METADATA_MODAL_HEADING" />}
            data-test="@modal/metadata-provider"
            bottomBar={
                <>
                    <StyledButton
                        variant="tertiary"
                        onClick={() => connect('dropbox')}
                        isLoading={isLoading === 'dropbox'}
                        isDisabled={!!isLoading}
                        data-test="@modal/metadata-provider/dropbox-button"
                        icon="DROPBOX"
                    >
                        <Translation id="TR_DROPBOX" />
                    </StyledButton>

                    {isEnabled('GOOGLE_DRIVE_SYNC') && (
                        <StyledButton
                            variant="tertiary"
                            onClick={() => connect('google')}
                            isLoading={isLoading === 'google'}
                            isDisabled={!!isLoading}
                            data-test="@modal/metadata-provider/google-button"
                            icon="GOOGLE_DRIVE"
                        >
                            <Translation id="TR_GOOGLE_DRIVE" />
                        </StyledButton>
                    )}

                    {/* desktop only */}
                    {isEnabled('FILE_SYSTEM_SYNC') && (
                        <StyledButton
                            variant="tertiary"
                            onClick={() => connect('fileSystem')}
                            isLoading={isLoading === 'fileSystem'}
                            isDisabled={!!isLoading}
                            data-test="@modal/metadata-provider/file-system-button"
                        >
                            Local file system
                        </StyledButton>
                    )}
                </>
            }
        >
            <StyledP>
                <Translation id="METADATA_MODAL_DESCRIPTION" />
            </StyledP>
            {error && <Error>{error}</Error>}
        </StyledModal>
    );
};

export default MetadataProvider;
