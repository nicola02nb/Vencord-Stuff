import "./Ping.css";

import { FluxDispatcher, Text, useEffect, useState } from "@webpack/common";
import { RTCConnectionStore } from "plugins/showPing/stores";
import { FluxEvent } from "@vencord/discord-types";

export function PingElement() {
    const [ping, setPing] = useState(RTCConnectionStore.getLastPing());

    const updatePing = (_: FluxEvent) => {
        setPing(RTCConnectionStore.getLastPing());
    };

    useEffect(() => {
        return () => {
            FluxDispatcher.unsubscribe("RTC_CONNECTION_PING", updatePing);
        };
    }, []);

    FluxDispatcher.subscribe("RTC_CONNECTION_PING", updatePing);

    return (<Text variant="text-md/medium" className="pingDisplay">{ping !== undefined ? `${ping} ms` : "N/A"}</Text>);
}
