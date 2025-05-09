/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable global-require */
// unit test for suite actions
// data provided by TrezorConnect are mocked

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DEVICE } from 'trezor-connect';
import suiteReducer from '@suite-reducers/suiteReducer';
import deviceReducer from '@suite-reducers/deviceReducer';
import routerReducer from '@suite-reducers/routerReducer';
import modalReducer from '@suite-reducers/modalReducer';
import firmwareReducer from '@firmware-reducers/firmwareReducer';
import { SUITE } from '../constants';
import * as suiteActions from '../suiteActions';
import { init } from '../trezorConnectActions';
import fixtures from '../__fixtures__/suiteActions';

const { getSuiteDevice } = global.JestMocks;

jest.mock('trezor-connect', () => {
    let fixture: any;
    return {
        __esModule: true, // this property makes it work
        default: {
            blockchainSetCustomBackend: () => {},
            init: () => {},
            on: () => {},
            getFeatures: () =>
                fixture || {
                    success: true,
                },
            getDeviceState: ({ device }: any) =>
                fixture || {
                    success: true,
                    payload: {
                        state: `state@device-id:${device ? device.instance : undefined}`,
                    },
                },
            applySettings: () =>
                fixture || {
                    success: true,
                },
        },
        DEVICE: {
            CONNECT: 'device-connect',
            DISCONNECT: 'device-disconnect',
        },
        TRANSPORT: {
            START: 'transport-start',
            ERROR: 'transport-error',
        },
        BLOCKCHAIN: {},
        UI: {},
        setTestFixtures: (f: any) => {
            fixture = f;
        },
    };
});

type SuiteState = ReturnType<typeof suiteReducer>;
type DevicesState = ReturnType<typeof deviceReducer>;
type RouterState = ReturnType<typeof routerReducer>;
type FirmwareState = ReturnType<typeof firmwareReducer>;

const getInitialState = (
    suite?: Partial<SuiteState>,
    devices?: DevicesState,
    router?: RouterState,
    firmware?: Partial<FirmwareState>,
) => ({
    suite: {
        ...suiteReducer(undefined, { type: 'foo' } as any),
        ...suite,
    },
    devices: devices || [],
    router: {
        ...routerReducer(undefined, { type: 'foo' } as any),
        ...router,
    },
    modal: modalReducer(undefined, { type: 'foo' } as any),
    firmware: {
        ...firmwareReducer(undefined, { type: 'foo' } as any),
        ...firmware,
    },
    wallet: {
        settings: {
            enabledNetworks: [],
        },
    },
});

type State = ReturnType<typeof getInitialState>;
const mockStore = configureStore<State, any>([thunk]);

const initStore = (state: State) => {
    const store = mockStore(state);
    store.subscribe(() => {
        const action = store.getActions().pop();
        const { suite, devices, router } = store.getState();
        store.getState().suite = suiteReducer(suite, action);
        store.getState().devices = deviceReducer(devices, action);
        store.getState().router = routerReducer(router, action);
        // add action back to stack
        store.getActions().push(action);
    });
    return store;
};

describe('Suite Actions', () => {
    fixtures.reducerActions.forEach(f => {
        it(f.description, () => {
            const state = getInitialState();
            const store = initStore(state);
            f.actions.forEach((action: any, i: number) => {
                store.dispatch(action);
                expect(store.getState().suite).toMatchObject(f.result[i]);
            });
        });
    });

    fixtures.initialRun.forEach(f => {
        it(f.description, () => {
            const state = getInitialState(f.state);
            const store = initStore(state);
            store.dispatch(suiteActions.initialRunCompleted());
            expect(store.getState().suite.flags.initialRun).toBe(false);
        });
    });

    fixtures.selectDevice.forEach(f => {
        it(`selectDevice: ${f.description}`, async () => {
            const state = getInitialState({}, f.state.devices);
            const store = initStore(state);
            await store.dispatch(suiteActions.selectDevice(f.device));
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.payload).toEqual(f.result.payload);
            }
        });
    });

    fixtures.handleDeviceConnect.forEach(f => {
        it(`handleDeviceConnect: ${f.description}`, async () => {
            const state = getInitialState(
                f.state.suite,
                f.state.devices,
                undefined,
                f.state.firmware as FirmwareState,
            );
            const store = initStore(state);
            await store.dispatch(suiteActions.handleDeviceConnect(f.device));
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.type).toEqual(f.result);
            }
        });
    });

    fixtures.handleDeviceDisconnect.forEach(f => {
        it(`handleDeviceDisconnect: ${f.description}`, () => {
            const state = getInitialState(f.state.suite, f.state.devices);
            const store = initStore(state);
            store.dispatch({
                type: DEVICE.DISCONNECT, // TrezorConnect event to affect "deviceReducer"
                payload: f.device,
            });
            store.dispatch(suiteActions.handleDeviceDisconnect(f.device));
            if (!f.result) {
                expect(store.getActions().length).toEqual(1); // only DEVICE.DISCONNECT action present
            } else {
                const action = store.getActions().pop();
                if (f.result.type) {
                    expect(action.type).toEqual(f.result.type);
                }
                expect(action.payload).toEqual(f.result.payload);
            }
        });
    });

    fixtures.forgetDisconnectedDevices.forEach(f => {
        it(`forgetDisconnectedDevices: ${f.description}`, () => {
            const state = getInitialState(f.state.suite, f.state.devices);
            const store = initStore(state);
            store.dispatch(suiteActions.forgetDisconnectedDevices(f.device));
            const actions = store.getActions();
            expect(actions.length).toEqual(f.result.length);
            actions.forEach((a, i) => {
                expect(a.payload).toMatchObject(f.result[i]);
            });
        });
    });

    fixtures.observeSelectedDevice.forEach(f => {
        it(`observeSelectedDevice: ${f.description}`, () => {
            const state = getInitialState(f.state.suite, f.state.devices);
            const store = initStore(state);
            const changed = store.dispatch(suiteActions.observeSelectedDevice(f.action as any));
            expect(changed).toEqual(f.changed);
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.type).toEqual(f.result);
            }
        });
    });

    fixtures.acquireDevice.forEach(f => {
        it(`acquireDevice: ${f.description}`, async () => {
            require('trezor-connect').setTestFixtures(f.getFeatures);
            const state = getInitialState(f.state);
            const store = initStore(state);
            store.dispatch(init()); // trezorConnectActions.init needs to be called in order to wrap "getFeatures" with lockUi action
            await store.dispatch(suiteActions.acquireDevice(f.requestedDevice));
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.type).toEqual(f.result);
            }
        });
    });

    fixtures.authorizeDevice.forEach(f => {
        it(`authorizeDevice: ${f.description}`, async () => {
            require('trezor-connect').setTestFixtures(f.getDeviceState);
            const state = getInitialState(f.suiteState, f.devicesState);
            const store = initStore(state);
            await store.dispatch(suiteActions.authorizeDevice());
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.type).toEqual(f.result);
                if (f.deviceReducerResult) {
                    // expect(store.getState().devices).toMatchObject(f.deviceReducerResult);
                    store.getState().devices.forEach((d, i) => {
                        const dev = f.deviceReducerResult[i];
                        expect(d.state).toEqual(dev.state);
                        expect(d.instance).toEqual(dev.instance);
                        expect(d.useEmptyPassphrase).toEqual(dev.useEmptyPassphrase);
                    });
                    // expect(store.getState().devices).toEqual(
                    //     expect.arrayContaining(f.deviceReducerResult),
                    // );
                }
            }
        });
    });

    fixtures.authConfirm.forEach(f => {
        it(`authConfirm: ${f.description}`, async () => {
            require('trezor-connect').setTestFixtures(f.getDeviceState);
            const state = getInitialState(f.state);
            const store = initStore(state);
            await store.dispatch(suiteActions.authConfirm());
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action).toMatchObject(f.result);
            }
        });
    });

    fixtures.createDeviceInstance.forEach(f => {
        it(`createDeviceInstance: ${f.description}`, async () => {
            require('trezor-connect').setTestFixtures(f.applySettings);
            const state = getInitialState(f.state);
            const store = initStore(state);
            await store.dispatch(suiteActions.createDeviceInstance(f.state.device));
            if (!f.result) {
                expect(store.getActions().length).toEqual(0);
            } else {
                const action = store.getActions().pop();
                expect(action.type).toEqual(f.result);
            }
        });
    });

    fixtures.switchDuplicatedDevice.forEach(f => {
        it(`createDeviceInstance: ${f.description}`, async () => {
            const state = getInitialState(f.state.suite, f.state.devices);
            const store = initStore(state);
            await store.dispatch(suiteActions.switchDuplicatedDevice(f.device, f.duplicate));
            expect(store.getState().suite.device).toEqual(f.result.selected);
            expect(store.getState().devices.length).toEqual(f.result.devices.length);
            // if (!f.result) {
            //     expect(store.getActions().length).toEqual(0);
            // } else {
            //     const action = store.getActions().pop();
            //     expect(action.type).toEqual(f.result);
            // }
        });
    });

    // just for coverage
    it('misc', () => {
        const SUITE_DEVICE = getSuiteDevice({ path: '1' });
        expect(suiteActions.toggleRememberDevice(SUITE_DEVICE)).toMatchObject({
            type: SUITE.REMEMBER_DEVICE,
        });
        expect(suiteActions.forgetDevice(SUITE_DEVICE)).toMatchObject({
            type: SUITE.FORGET_DEVICE,
        });
        expect(suiteActions.setDebugMode({ showDebugMenu: true })).toMatchObject({
            type: SUITE.SET_DEBUG_MODE,
        });
    });
});
