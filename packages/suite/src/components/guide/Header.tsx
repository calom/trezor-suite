import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { darken, transparentize } from 'polished';

import * as guideActions from '@suite-actions/guideActions';
import { useActions, useAnalytics } from '@suite-hooks';
import { Icon, variables, useTheme } from '@trezor/components';
import { HeaderBreadcrumb, ContentScrolledContext } from '@guide-components';

const HeaderWrapper = styled.div<{ noLabel?: boolean; isScrolled: boolean }>`
    display: flex;
    align-items: center;
    padding: 12px 22px;
    position: sticky;
    top: 0;
    background-color: inherit;
    box-shadow: none;
    border-bottom: 1px solid transparent;
    transition: all 0.5s ease;
    white-space: nowrap;

    ${props =>
        props.isScrolled &&
        css`
            box-shadow: 0px 9px 27px 0px ${props => transparentize(0.5, props.theme.STROKE_GREY)};
            border-bottom: 1px solid ${props => props.theme.STROKE_GREY};
        `}

    ${props =>
        props.noLabel &&
        css`
            justify-content: space-between;
        `}
`;

const ActionButton = styled.button`
    border: 0;
    left: auto;
    padding: 8px;
    border-radius: 8px;
    background: ${props => props.theme.BG_WHITE};
    transition: ${props =>
        `background ${props.theme.HOVER_TRANSITION_TIME} ${props.theme.HOVER_TRANSITION_EFFECT}`};
    cursor: pointer;

    :hover,
    :focus {
        background: ${props => darken(props.theme.HOVER_DARKEN_FILTER, props.theme.BG_WHITE)};
    }
`;

const MainLabel = styled.div`
    font-size: ${variables.FONT_SIZE.BIG};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    text-align: left;
    color: ${props => props.theme.TYPE_DARK_GREY};
    width: 100%;
`;

const Label = styled.div`
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    text-align: center;
    color: ${props => props.theme.TYPE_DARK_GREY};
    padding: 0 15px;
    width: 100%;
`;

const StyledIcon = styled(Icon)`
    width: 40px;
    height: 40px;
    flex-grow: 0;

    margin: -8px;
`;

interface Props {
    back?: () => void;
    label?: string | JSX.Element;
    useBreadcrumb?: boolean;
}

export const Header = ({ back, label, useBreadcrumb }: Props) => {
    const theme = useTheme();
    const analytics = useAnalytics();

    const isScrolled = useContext(ContentScrolledContext);

    const { close } = useActions({
        close: guideActions.close,
    });

    return (
        <HeaderWrapper noLabel={!label} isScrolled={isScrolled}>
            {!useBreadcrumb && back && (
                <>
                    <ActionButton
                        onClick={() => {
                            back();
                            analytics.report({
                                type: 'guide/header/navigation',
                                payload: {
                                    type: 'back',
                                },
                            });
                        }}
                        data-test="@guide/button-back"
                    >
                        <StyledIcon
                            icon="ARROW_LEFT_LONG"
                            size={24}
                            color={theme.TYPE_LIGHT_GREY}
                        />
                    </ActionButton>
                    {label && <Label data-test="@guide/label">{label}</Label>}
                </>
            )}
            {!useBreadcrumb && !back && label && <MainLabel>{label}</MainLabel>}

            {useBreadcrumb && <HeaderBreadcrumb />}

            <ActionButton
                onClick={() => {
                    close();
                    analytics.report({
                        type: 'guide/header/navigation',
                        payload: {
                            type: 'close',
                        },
                    });
                }}
                data-test="@guide/button-close"
            >
                <StyledIcon icon="CROSS" size={24} color={theme.TYPE_LIGHT_GREY} />
            </ActionButton>
        </HeaderWrapper>
    );
};
