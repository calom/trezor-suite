import React from 'react';
import { findRouteByName } from '@suite-utils/router';
import styled, { css } from 'styled-components';
import { variables, HoverAnimation } from '@trezor/components';
import { Translation } from '@suite-components';
import { MAIN_MENU_ITEMS } from '@suite-constants/menu';
import { useAnalytics, useActions, useSelector, useAccountSearch } from '@suite-hooks';
import * as routerActions from '@suite-actions/routerActions';
import { transparentize } from 'polished';

interface ComponentProps {
    isActive: boolean;
    isDisabled?: boolean;
}

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
`;

const MobileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 16px;
    flex: 1;

    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};
`;

const MenuItem = styled.div<ComponentProps>`
    display: flex;
    font-size: 16px;
    cursor: ${props => (!props.isDisabled && !props.isActive ? 'pointer' : 'default')};

    & + & {
        margin-left: 36px;
    }
`;

const MobileMenuItem = styled.div<ComponentProps>`
    display: flex;
    padding: 20px 24px;
    font-size: ${props => (props.isActive ? '20px' : '16px')};
    cursor: ${props => (!props.isDisabled && !props.isActive ? 'pointer' : 'default')};

    ${props =>
        props.isActive &&
        css`
            font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
        `}

    & + & {
        border-top: 1px solid ${props => props.theme.STROKE_GREY};
    }
`;

const ItemTitleWrapper = styled.span`
    position: relative;
`;

const ItemTitle = styled.span<ComponentProps>`
    color: ${props => transparentize(0.3, props.theme.TYPE_DARK_GREY)};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    font-size: ${variables.FONT_SIZE.NORMAL};
    line-height: 24px;

    ${props =>
        props.isActive &&
        css`
            color: ${props => props.theme.TYPE_DARK_GREY};
            font-size: ${variables.FONT_SIZE.H3};
        `}

    ${props =>
        props.isDisabled &&
        css`
            cursor: default;
        `}
`;

const NewBadge = styled.span`
    position: absolute;
    top: -14px;
    right: -30px;
    padding: 3px 3px 2px 3px;
    background: ${props => props.theme.BG_LIGHT_GREEN};
    color: ${props => props.theme.TYPE_GREEN};
    letter-spacing: 0.2px;
    text-transform: UPPERCASE;
    font-size: 12px;
    display: flex;
    cursor: default;
    align-items: center;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    border-radius: 4px;
`;

interface Props {
    closeMainNavigation?: () => void;
    isMobileLayout?: boolean;
}

const MainNavigation = (props: Props) => {
    const analytics = useAnalytics();
    const { setCoinFilter, setSearchString } = useAccountSearch();
    const activeApp = useSelector(state => state.router.app);
    const { goto } = useActions({
        goto: routerActions.goto,
    });

    const gotoWithReport = (routeName: typeof MAIN_MENU_ITEMS[number]['route']) => {
        switch (routeName) {
            case 'suite-index':
                analytics.report({ type: 'menu/goto/suite-index' });
                break;
            case 'wallet-index':
                setCoinFilter(undefined);
                setSearchString(undefined);
                analytics.report({ type: 'menu/goto/wallet-index' });
                break;
            default:
            // no default
        }
        goto(routeName);
    };

    const WrapperComponent = props.isMobileLayout ? MobileWrapper : Wrapper;
    const MenuItemComponent = props.isMobileLayout ? MobileMenuItem : MenuItem;

    return (
        <WrapperComponent>
            {MAIN_MENU_ITEMS.map(item => {
                const { route, translationId, isDisabled } = item;
                const routeObj = findRouteByName(route);
                const isActive = routeObj ? routeObj.app === activeApp : false;
                return (
                    <MenuItemComponent
                        key={route}
                        data-test={`@suite/menu/${route}`}
                        onClick={() => {
                            if (!isDisabled) {
                                gotoWithReport(route);
                                if (props.closeMainNavigation) {
                                    props.closeMainNavigation();
                                }
                            }
                        }}
                        isActive={isActive}
                        isDisabled={isDisabled}
                    >
                        <ItemTitleWrapper>
                            <HoverAnimation isHoverable={!isActive}>
                                <ItemTitle isActive={isActive} isDisabled={isDisabled}>
                                    <Translation id={translationId} />
                                </ItemTitle>
                            </HoverAnimation>
                            {/* if the button is disabled, display "SOON" badge */}
                            {isDisabled && <NewBadge>soon</NewBadge>}
                        </ItemTitleWrapper>
                    </MenuItemComponent>
                );
            })}
        </WrapperComponent>
    );
};

export default MainNavigation;
