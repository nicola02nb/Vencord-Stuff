/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { disableStyle, enableStyle } from "@api/Styles";
import { OptionType } from "@utils/types";

import hideKrisp from "./hideKrisp.css?managed";

export function displayKrispButton(display: boolean) {
    if (display) {
        disableStyle(hideKrisp);
    } else {
        enableStyle(hideKrisp);
    }
}

export const settings = definePluginSettings({
    hideKrispButton: {
        type: OptionType.BOOLEAN,
        description: "If enabled, hides krisp button near disconnect channel button.",
        default: true,
        onChange: (value: boolean) => displayKrispButton(value)
    }
});
