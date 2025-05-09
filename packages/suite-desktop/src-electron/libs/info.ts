import { app } from 'electron';
import si from 'systeminformation';
import { bytesToHumanReadable } from '@trezor/utils';

import { isDev } from '@suite-utils/build';
import { b2t } from './utils';

export const buildInfo = () => {
    global.logger.info('build', [
        'Info:',
        `- Version: ${app.getVersion()}`,
        `- Electron: ${process.versions.electron}`,
        `- Commit: ${process.env.COMMITHASH}`,
        `- Dev: ${b2t(isDev)}`,
        `- Args: ${process.argv.slice(1).join(' ')}`,
        `- CWD: ${process.cwd()}`,
    ]);
};

export const computerInfo = async () => {
    const { logger } = global;
    if (logger.level !== 'debug') {
        return;
    }

    const { system, cpu, mem, osInfo } = await si.get({
        system: 'manufacturer, model, virtual',
        cpu: 'manufacturer, brand, processors, physicalCores, cores, speed',
        mem: 'total',
        osInfo: 'platform, arch, distro, release',
    });

    logger.debug('computer', [
        'Info:',
        `- Platform: ${osInfo.platform} ${osInfo.arch}`,
        `- OS: ${osInfo.distro} ${osInfo.release}`,
        `- Manufacturer: ${system.manufacturer}`,
        `- Model: ${system.model}`,
        `- Virtual: ${b2t(system.virtual)}`,
        `- CPU: ${cpu.manufacturer} ${cpu.brand}`,
        `- Cores: ${cpu.processors}x${cpu.physicalCores}(+${cpu.cores - cpu.physicalCores}) @ ${
            cpu.speed
        }GHz`,
        `- RAM: ${bytesToHumanReadable(mem.total)}`,
    ]);
};
