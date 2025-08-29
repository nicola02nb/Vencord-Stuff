/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

const dropdownStatusOptions = [
    { label: "Online", value: "online" },
    { label: "Idle", value: "idle" },
    { label: "Invisible", value: "invisible" },
    { label: "Do Not Disturb", value: "dnd" }
];

export const settings = definePluginSettings({
    mutedMicrophoneStatus: {
        type: OptionType.SELECT,
        description: "Status for muted Microphone:",
        options: dropdownStatusOptions
    },
    mutedSoundStatus: {
        type: OptionType.SELECT,
        description: "Status for muted Sound:",
        options: dropdownStatusOptions
    },
    connectedStatus: {
        type: OptionType.SELECT,
        description: "Status for connected:",
        options: dropdownStatusOptions
    },
    disconnectedStatus: {
        type: OptionType.SELECT,
        description: "Status for disconnected:",
        options: dropdownStatusOptions
    },
    showToast: {
        type: OptionType.BOOLEAN,
        description: "If enabled, displays a toast message when the status changes.",
        default: true
    }
});
