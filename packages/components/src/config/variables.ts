import { IconType, CoinType } from '../support/types';

export const SCREEN_SIZE = {
    UNAVAILABLE: '260px',
    SM: '576px', // phones
    MD: '768px', // tablets
    LG: '992px', // laptops/desktops
    XL: '1200px', // extra Large laptops/desktops
} as const;

// Temporary solution to enable the simultaious use of above and below breakpoints, ideally SCREEN SIZE should be just numbers IMO
const HELPER_SCREEN_SIZE = {
    SM: '575px', // phones
    MD: '767px', // tablets
    LG: '991px', // laptops/desktops
    XL: '1199px', // extra Large laptops/desktops
};

export const SCREEN_QUERY = {
    MOBILE: `@media (max-width: ${HELPER_SCREEN_SIZE.SM})`,
    ABOVE_MOBILE: `@media (min-width: ${SCREEN_SIZE.SM})`,
    BELOW_TABLET: `@media (max-width: ${HELPER_SCREEN_SIZE.MD})`,
    ABOVE_TABLET: `@media (min-width: ${SCREEN_SIZE.MD})`,
    BELOW_LAPTOP: `@media (max-width: ${HELPER_SCREEN_SIZE.LG})`,
    ABOVE_LAPTOP: `@media (min-width: ${SCREEN_SIZE.LG})`,
    BELOW_DESKTOP: `@media (min-width: ${HELPER_SCREEN_SIZE.XL})`,
    ABOVE_DESKTOP: `@media (min-width: ${SCREEN_SIZE.XL})`,
} as const;

export const LAYOUT_SIZE = {
    MENU_SECONDARY_WIDTH: '300px',
    GUIDE_PANEL_WIDTH: '350px',
    GUIDE_PANEL_CONTENT_WIDTH: '305px',
} as const;

export const Z_INDEX = {
    MODAL: 10000,
    BANNER: 3,
    BANNER_ON_TOP: 10001,
    NAVIGATION_BAR: 30,
    DISCOVERY_PROGRESS: 29, // should be below NAVIGATION_BAR
    GUIDE_PANEL: 11,
    GUIDE_PANEL_BESIDE_MODAL: 10002,
    GUIDE_BUTTON: 10,
    GUIDE_BUTTON_BESIDE_MODAL: 10001,
    DROPDOWN_MENU: 10003, // should lay above GUIDE_PANEL
    TOAST_CONTAINER: 10003, // should lay above GUIDE_PANEL
} as const;

export const FONT_SIZE = {
    BIG: '18px',
    NORMAL: '16px',
    SMALL: '14px',
    TINY: '12px',
    BUTTON: '14px',
    H1: '36px',
    H2: '24px',
    H3: '20px',
} as const;

export const NEUE_FONT_SIZE = {
    NANO: '10px',
    TINY: '12px',
    SMALL: '14px',
    NORMAL: '16px',
    H1: '24px',
    H2: '20px',
} as const;

export const FONT_WEIGHT = {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    DEMI_BOLD: 600,
    BOLD: 700,
} as const;

export const FONT_FAMILY = {
    TTHOVES: 'TT Hoves',
} as const;

export const COINS: CoinType[] = [
    'ada',
    'bch',
    'btc',
    'test',
    'btg',
    'dash',
    'dgb',
    'doge',
    'etc',
    'eth',
    'ltc',
    'nmc',
    'tada',
    'trop',
    'txrp',
    'vtc',
    'xrp',
    'zec',
];

export const ICONS: IconType[] = [
    'APP',
    'ARROW_DOWN',
    'ARROW_UP',
    'ARROW_LEFT',
    'ARROW_LEFT_LONG',
    'ARROW_RIGHT',
    'ARROW_RIGHT_LONG',
    'ARTICLE',
    'ATTACHMENT',
    'BROADCAST',
    'CHECK',
    'CHECK_ACTIVE',
    'COIN',
    'COINS',
    'COPY',
    'CROSS',
    'DASHBOARD',
    'DEVICE',
    'EXCHANGE',
    'INFO',
    'INFO_ACTIVE',
    'LOG',
    'LIGHTBULB',
    'MENU',
    'MORE',
    'NON_SUITE',
    'PASSWORDS',
    'PLUS',
    'QR',
    'QUESTION',
    'QUESTION_ACTIVE',
    'RECEIVE',
    'REFRESH',
    'SEARCH',
    'SEND',
    'SETTINGS',
    'SIGN',
    'SIGNATURE',
    'SORT',
    'SUPPORT',
    'TIPS',
    'TRANSACTIONS',
    'TREZOR',
    'WALLET',
    'WALLET_HIDDEN',
    'EXTERNAL_LINK',
    'T1',
    'T2',
    'BACK',
    'BACKEND',
    'SHOW',
    'HIDE',
    'DOWNLOAD',
    'EDIT',
    'WARNING',
    'WARNING_ACTIVE',
    'LABEL',
    'LABEL_ACTIVE',
    'TODO',
    'DISCREET',
    'PIN',
    'BACKUP',
    'COLLAPSE',
    'NOTIFICATION',
    'SHOP',
    'UP',
    'DOWN',
    'CANCEL',
    'GRID',
    'TABLE',
    'ASTERISK',
    'EJECT',
    'RBF',
    'TRANSFER',
    'LOCK',
    'LOCK_ACTIVE',
    'CLOCK',
    'CALENDAR',
    'PDF',
    'CSV',
    'BINARY',
    'IMAGE',
    'MEDIUM',
    'TAG',
    'GAS',
    'DATA',
    'BANK',
    'BUY',
    'CREDIT_CARD',
    'TREZOR_LOGO',
    'FEEDBACK',
    'OS_LINUX',
    'OS_LINUX_ARM64',
    'OS_MAC',
    'OS_WINDOWS',
    'TRADE',
    'TOR',
    'RECOVER',
    'NEW',
    'SEED_SINGLE',
    'SEED_SHAMIR',
    'HOLOGRAM',
    'PACKAGE',
    'VERIFIED',
    'ANCHOR',
    'PENCIL',
    'PENCIL_LINE',
    'KEY',
];
