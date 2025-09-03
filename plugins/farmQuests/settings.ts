/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export default definePluginSettings({
    checkForNewQuests: {
        type: OptionType.NUMBER,
        default: 1,
        name: "Interval to check for new quests(min)",
        description: "The time (in minutes) to check for new quests",
        restartNeeded: true
    }
});
