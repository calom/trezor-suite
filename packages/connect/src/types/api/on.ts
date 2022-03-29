import { BLOCKCHAIN_EVENT, BlockchainEvent } from '../../events/blockchain';
import { DEVICE_EVENT, DeviceEvent } from '../../events/device';
import { TRANSPORT_EVENT, TransportEvent } from '../../events/transport';
import { UI_EVENT, UI_REQUEST, UiEvent, BundleProgress } from '../../events/ui-request';
import type { UnionToIntersection } from '../utils';

// UI_EVENT, DEVICE_EVENT...
type GroupEvent<Event, Group> = (
    type: Event,
    cb: (event: Group & { event: Event }) => void,
) => void;

// ui-button, device_connected...
type DetailedEvent<Event> = Event extends { type: string }
    ? Event extends { payload: any }
        ? (type: Event['type'], cb: (event: Event['payload']) => any) => void
        : (type: Event['type'], cb: () => any) => void
    : never;

// generic progress
type ProgressEvent = <R>(
    type: typeof UI_REQUEST.BUNDLE_PROGRESS,
    cb: (event: BundleProgress<R>['payload']) => void,
) => void;

type EventsUnion =
    | GroupEvent<typeof BLOCKCHAIN_EVENT, BlockchainEvent>
    | GroupEvent<typeof DEVICE_EVENT, DeviceEvent>
    | GroupEvent<typeof TRANSPORT_EVENT, TransportEvent>
    | GroupEvent<typeof UI_EVENT, UiEvent>
    | DetailedEvent<BlockchainEvent>
    | DetailedEvent<DeviceEvent>
    | DetailedEvent<TransportEvent>
    | DetailedEvent<UiEvent>
    | ProgressEvent;

export declare const on: UnionToIntersection<EventsUnion>;
