import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDiscovery, useAccountSearch, useSelector } from '@suite-hooks';
import { H2, variables, useTheme, Icon, LoadingContent } from '@trezor/components';
import { Translation, AddAccountButton, LayoutContext } from '@suite-components';

import { sortByCoin, getFailedAccounts, accountSearchFn } from '@wallet-utils/accountUtils';
import { Account } from '@wallet-types';

import AccountSearchBox from './components/AccountSearchBox';
import AccountGroup from './components/AccountGroup';
import AccountItem, { SkeletonAccountItem } from './components/AccountItem';

const Wrapper = styled.div<{ isInline?: boolean }>`
    display: flex;
    flex-direction: column;
    z-index: 4; /*  higher than accounts list to prevent box-shadow overflow */
    width: 100%;

    ${props =>
        !props.isInline &&
        css`
            overflow: auto;
        `}
`;

const MenuHeader = styled.div<{ isInline?: boolean }>`
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    background: ${props => props.theme.BG_WHITE};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    ${props =>
        props.isInline &&
        css`
            padding: 12px 16px;
        `}

    ${props =>
        !props.isInline &&
        css`
            padding: 20px 16px 8px 16px;
            margin-bottom: 8px;
        `}
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AddAccountButtonWrapper = styled.div`
    display: flex;
    margin-left: 16px;
    align-items: flex-start;
    margin-top: 16px;
`;

const Search = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0px;

    background: ${props => props.theme.BG_WHITE};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};
    margin-bottom: 8px;
`;

const Heading = styled(H2)<{ isInline?: boolean }>`
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_DARK_GREY};
    ${props =>
        props.isInline &&
        css`
            font-size: 18px;
        `}
`;

const MenuItemsWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
`;

const ExpandedMobileWrapper = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    background: ${props => props.theme.BG_WHITE};
    z-index: 5;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 10px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0px 16px;
    padding-bottom: 16px;
`;

const Scroll = styled.div<{ isInline?: boolean }>`
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    ${props =>
        !props.isInline &&
        css`
            padding: 0px 8px;
        `}
`;

const NoResults = styled.div`
    display: flex;
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    justify-content: center;
    text-align: center;
    margin: 36px 0px;
`;

const AccountsMenu = () => {
    const theme = useTheme();
    const { discovery, getDiscoveryStatus, isDiscoveryRunning } = useDiscovery();
    const { device, accounts, selectedAccount } = useSelector(state => ({
        device: state.suite.device,
        accounts: state.wallet.accounts,
        selectedAccount: state.wallet.selectedAccount,
    }));
    const { params } = selectedAccount;
    const { isMenuInline } = React.useContext(LayoutContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [animatedIcon, setAnimatedIcon] = useState(false);
    const { coinFilter, searchString } = useAccountSearch();

    const discoveryStatus = getDiscoveryStatus();
    const discoveryInProgress = discoveryStatus && discoveryStatus.status === 'loading';

    const selectedItemRef = useCallback((_item: HTMLDivElement | null) => {
        // TODO: scroll to selected item
    }, []);

    if (!device || !discovery) {
        // TODO: default empty state while retrieving data from the device
        return (
            <Wrapper isInline={isMenuInline}>
                <Scroll isInline={isMenuInline}>
                    <MenuHeader isInline={isMenuInline}>
                        <Heading noMargin isInline={isMenuInline}>
                            <Translation id="TR_MY_ACCOUNTS" />
                        </Heading>
                        {!isMenuInline && <AccountSearchBox isMobile={isMenuInline} />}
                    </MenuHeader>
                    {!isMenuInline && <SkeletonAccountItem />}
                </Scroll>
            </Wrapper>
        );
    }

    const isOpened = (group: Account['accountType']) =>
        params ? params.accountType === group : false;

    const isSelected = (account: Account) =>
        params &&
        account.symbol === params.symbol &&
        account.accountType === params.accountType &&
        account.index === params.accountIndex;

    const failed = getFailedAccounts(discovery);

    const list = sortByCoin(accounts.filter(a => a.deviceState === device.state).concat(failed));
    const filteredAccounts =
        searchString || coinFilter
            ? list.filter(a => accountSearchFn(a, searchString, coinFilter))
            : list;
    // always show first "normal" account even if they are empty
    const normalAccounts = filteredAccounts.filter(
        a => a.accountType === 'normal' && (a.index === 0 || !a.empty || a.visible),
    );
    const taprootAccounts = filteredAccounts.filter(
        a => a.accountType === 'taproot' && (!a.empty || a.visible),
    );
    const segwitAccounts = filteredAccounts.filter(
        a => a.accountType === 'segwit' && (!a.empty || a.visible),
    );
    const legacyAccounts = filteredAccounts.filter(
        a => a.accountType === 'legacy' && (!a.empty || a.visible),
    );

    // cardano ledger accounts
    const ledgerAccounts = filteredAccounts.filter(
        a => a.accountType === 'ledger' && (!a.empty || a.visible),
    );
    // const uniqueNetworks = [...new Set(filteredAccounts.map(item => item.symbol))];

    const buildGroup = (type: Account['accountType'], accounts: Account[]) => {
        const groupHasBalance = accounts.find(a => a.availableBalance !== '0');

        if (!accounts.length) {
            // show skeleton in 'normal' group while we wait for a discovery of first account
            return <>{discoveryInProgress && type === 'normal' && <SkeletonAccountItem />}</>;
        }

        return (
            <AccountGroup
                key={type}
                type={type}
                hasBalance={!!groupHasBalance}
                keepOpened={isOpened(type) || (!!searchString && searchString.length > 0)}
            >
                {accounts.map(account => {
                    const selected = !!isSelected(account);
                    const forwardedRef = selected ? selectedItemRef : undefined;
                    return (
                        <AccountItem
                            key={`${account.descriptor}-${account.symbol}`}
                            ref={forwardedRef}
                            account={account}
                            selected={selected}
                            closeMenu={() => setIsExpanded(false)}
                        />
                    );
                })}
                {discoveryInProgress && <SkeletonAccountItem />}
            </AccountGroup>
        );
    };

    const listedAccountsLength =
        normalAccounts.length +
        segwitAccounts.length +
        legacyAccounts.length +
        ledgerAccounts.length;

    const accountsComponent =
        listedAccountsLength > 0 || !searchString ? (
            <>
                {buildGroup('normal', normalAccounts)}
                {buildGroup('taproot', taprootAccounts)}
                {buildGroup('segwit', segwitAccounts)}
                {buildGroup('legacy', legacyAccounts)}
                {buildGroup('ledger', ledgerAccounts)}
            </>
        ) : (
            <NoResults>
                <Translation id="TR_ACCOUNT_SEARCH_NO_RESULTS" />
            </NoResults>
        );

    if (isMenuInline) {
        return (
            <>
                <Wrapper isInline={isMenuInline}>
                    <MenuHeader
                        isInline={isMenuInline}
                        onClick={() => {
                            if (isMenuInline) {
                                setIsExpanded(!isExpanded);
                                setAnimatedIcon(true);
                            }
                        }}
                    >
                        <Row>
                            <Heading noMargin isInline={isMenuInline}>
                                <Translation id="TR_MY_ACCOUNTS" />
                            </Heading>
                            <Icon
                                canAnimate={animatedIcon}
                                isActive={isExpanded}
                                size={20}
                                color={theme.TYPE_LIGHT_GREY}
                                onClick={() => {
                                    setIsExpanded(!isExpanded);
                                    setAnimatedIcon(true);
                                }}
                                icon="ARROW_DOWN"
                            />
                        </Row>
                    </MenuHeader>
                </Wrapper>
                {isExpanded && (
                    <MenuItemsWrapper>
                        <ExpandedMobileWrapper>
                            <Search>
                                <AccountSearchBox isMobile />
                                <AddAccountButtonWrapper>
                                    <AddAccountButton
                                        device={device}
                                        closeMenu={() => setIsExpanded(false)}
                                        noButtonLabel
                                    />
                                </AddAccountButtonWrapper>
                            </Search>
                            {accountsComponent}
                        </ExpandedMobileWrapper>
                    </MenuItemsWrapper>
                )}
            </>
        );
    }

    return (
        <Wrapper>
            <Scroll>
                <MenuHeader>
                    <Row>
                        <Heading noMargin>
                            <LoadingContent isLoading={isDiscoveryRunning}>
                                <Translation id="TR_MY_ACCOUNTS" />
                            </LoadingContent>
                        </Heading>
                        <AddAccountButton device={device} noButtonLabel />
                    </Row>
                    <AccountSearchBox />
                </MenuHeader>
                {accountsComponent}
            </Scroll>
        </Wrapper>
    );
};

export default AccountsMenu;
