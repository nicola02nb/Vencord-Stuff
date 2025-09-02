/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { React } from "@webpack/common";

import { PingElement } from "./components/Ping";
import { displayKrispButton, settings } from "./settings";

export default definePlugin({
    name: "ShowPing",
    description: "Displays your live ping.",
    authors: [Devs.nicola02nb],
    settings,
    patches: [
        {
            find: ".hoverableStatus),hoverText:",
            replacement: {
                match: /(children:\i}\):null,children:)(\(0,\s*r\.jsx\)\(\i\.Text,\s*\{[\s\S]*?\}\))/,
                replace: "$1[$2,$self.renderPing()]"
            }
        }
    ],
    start: () => {
        displayKrispButton(settings.store.hideKrispButton);
    },
    stop: () => {
        displayKrispButton(false);
    },

    renderPing() {
        return <PingElement />;
    }
});


