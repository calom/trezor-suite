import UAParser from 'ua-parser-js';

import style from './styles.css';
import iconChrome from '../../files/images/browsers/chrome@2.png';
import iconFirefox from '../../files/images/browsers/firefox@2.png';
import iconDesktop from '../../files/images/browsers/desktop@2.png';

type SupportedBrowser = {
    name: string;
    url: string;
    icon: string;
    preferred: boolean;
};

type MainHtmlProps = {
    title: string;
    subtitle: string;
    continueToSuite?: boolean;
    supportedDevicesList?: boolean;
    supportedBrowsers?: SupportedBrowser[];
};

window.addEventListener('load', () => {
    const getSupportedBrowsersPartial = (supportedBrowsers?: SupportedBrowser[]) =>
        supportedBrowsers
            ? `<div class="${style.browsers}">
            ${supportedBrowsers
                .map(
                    (item: SupportedBrowser) => `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="${
                        style.browser
                    }">
                    <img src="${item.icon}" class="${style.image}"/>
                    <p class="${style.name}">${item.name}</p>
                    <div class="${style.button} ${
                        item.preferred ? style.buttonPrimary : style.buttonSecondary
                    }">
                        Download
                    </div>
                </a>`,
                )
                .join('')}
        </div>`
            : '';

    const getSupportedDevicesList = (props: MainHtmlProps) =>
        props.supportedDevicesList
            ? `<ul class=${style.list}>
                <li>Desktop apps</li>
                <li>Computer browser app</li>
                <li>Android browser app</li>
            </ul>`
            : '';

    const getContinueToSuiteInfo = (props: MainHtmlProps) =>
        props.continueToSuite
            ? `<div class=${style.hr}></div>
                <p class=${style.continueInfo}>You can try using it with this browser, however, you might experience bugs & shit</p>
                <p class=${style.continueButton} id="continue-to-suite">Continue at my own risk</p>`
            : '';

    const getMainHtml = (props: MainHtmlProps) => `
    <div id="unsupported-browser" class="${style.container}" data-test="@browser-detect">
        <h1 class="${style.title}">${props.title}</h1>
        <p class="${style.subtitle}">${props.subtitle}</p>
        ${getSupportedDevicesList(props)}
        ${getSupportedBrowsersPartial(props.supportedBrowsers)}
        ${getContinueToSuiteInfo(props)}
    </div>
    `;

    const desktop = {
        name: 'Desktop App',
        url: 'https://suite.trezor.io/',
        icon: iconDesktop,
        preferred: true,
    };

    const chrome = {
        name: 'Chrome 84+',
        url: 'https://www.google.com/chrome/',
        icon: iconChrome,
        preferred: false,
    };

    const firefox = {
        name: 'Firefox 78+',
        url: 'https://www.mozilla.org/firefox/new/',
        icon: iconFirefox,
        preferred: false,
    };

    const chromeMobile = {
        name: 'Chrome for Android',
        url: 'https://play.google.com/store/apps/details?id=com.android.chrome',
        icon: iconChrome,
        preferred: false,
    };

    const unsupportedBrowser = getMainHtml({
        title: 'Your browser is not supported',
        subtitle: 'Get our app, or download a supported browser',
        supportedBrowsers: [desktop, chrome, firefox],
        continueToSuite: true,
    });

    const updateChrome = getMainHtml({
        title: 'Your browser is outdated',
        subtitle: 'Get our app, or update your browser to the latest version.',
        supportedBrowsers: [desktop, chrome],
        continueToSuite: true,
    });

    const updateFirefox = getMainHtml({
        title: 'Your browser is outdated',
        subtitle: 'Get our app, or update your browser to the latest version.',
        supportedBrowsers: [desktop, firefox],
        continueToSuite: true,
    });

    const getChromeAndroid = getMainHtml({
        title: 'Your browser is not supported',
        subtitle: 'Mobile Suite is supported only in Chrome for Android.',
        supportedBrowsers: [chromeMobile],
        continueToSuite: true,
    });

    const iOS = getMainHtml({
        title: 'Suite doesn’t work on iOS yet',
        subtitle:
            'We’re working hard to figure something out.<br> In the meantime you can use Suite:',
        supportedDevicesList: true,
    });

    // this should match browserslist config (packages/suite-build/browserslist)
    const supportedBrowsers = [
        {
            name: 'Chrome',
            version: 84,
            mobile: true,
        },
        {
            name: 'Chromium',
            version: 84,
            mobile: true,
        },
        {
            name: 'Firefox',
            version: 78,
            mobile: false, // no webusb support
        },
    ];

    const parser = new UAParser();
    const result = parser.getResult();

    const isMobile = result.device.type === 'mobile';
    const supportedBrowser = supportedBrowsers.filter(
        browser => browser.name === result.browser.name,
    )[0];
    const updateRequired =
        supportedBrowser && result.browser.version
            ? supportedBrowser.version > parseInt(result.browser.version, 10)
            : false;

    const goToSuite = () => {
        const child = document.getElementById('unsupported-browser');
        child?.parentNode?.removeChild(child);

        const appDiv = document.createElement('div');
        appDiv.id = 'app';
        document.body.appendChild(appDiv);
    };

    const setBody = (content: string) => {
        document.body.innerHTML = '';
        document.body.insertAdjacentHTML('afterbegin', content);

        document.getElementById('continue-to-suite')?.addEventListener('click', goToSuite);
    };

    if (result.os.name === 'iOS') {
        // Any iOS device: no WebUSB support (suggest to download iOS app?)
        setBody(iOS);
    } else if (isMobile && (!supportedBrowser || (supportedBrowser && !supportedBrowser.mobile))) {
        // Unsupported mobile browser: get Chrome for Android
        setBody(getChromeAndroid);
    } else if (!supportedBrowser) {
        // Unsupported browser
        setBody(unsupportedBrowser);
    } else if (updateRequired) {
        if (supportedBrowser.name === 'Chrome' || supportedBrowser.name === 'Chromium') {
            // Outdated browser: update Chrome
            setBody(updateChrome);
        }
        if (supportedBrowser.name === 'Firefox') {
            // Outdated browser: update Firefox
            setBody(updateFirefox);
        }
    } else {
        // Inject app div
        goToSuite();
    }
});
