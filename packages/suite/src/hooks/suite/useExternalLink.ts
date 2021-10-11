import { useMemo } from 'react';
import { useSelector } from '@suite-hooks';
import { toTorUrl } from '@suite-utils/tor';

/**
 * Returns plain url or onion url if available and tor is active
 */
export const useExternalLink = (originalUrl?: string) => {
    const { tor, torOnionLinks } = useSelector(state => ({
        tor: state.suite.tor,
        torOnionLinks: state.suite.settings.torOnionLinks,
    }));

    const url = useMemo(() => {
        if (originalUrl && tor && torOnionLinks) {
            return toTorUrl(originalUrl);
        }

        return originalUrl;
    }, [tor, torOnionLinks, originalUrl]);

    return url;
};
