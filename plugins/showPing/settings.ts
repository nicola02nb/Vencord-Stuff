/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    hideKrispButton: {
        type: OptionType.BOOLEAN,
        description: "If enabled, hides krisp button near disconnect channel button.",
        default: true,
        onChange: value => { // TODO add functionality
            if (value) {
                // DOM.removeStyle(this.meta.name + "-hidekrispStyle");
            } else {
                // DOM.addStyle(this.meta.name + "-hidekrispStyle", `.${voiceButtonsContainer} > button[aria-label*="Krisp"] {display: none !important;}`);
            }
        }
    }
});
