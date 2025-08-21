/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
