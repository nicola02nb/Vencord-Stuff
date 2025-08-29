/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Ping.css";

import { FluxEvent } from "@vencord/discord-types";
import { FluxDispatcher, Text, useEffect, useState } from "@webpack/common";

import { RTCConnectionStore } from "../stores";

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
