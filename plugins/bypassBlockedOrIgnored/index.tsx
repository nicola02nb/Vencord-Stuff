/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import settings from "./settings";
import { RelationshipStore } from "./stores";
import { findByPropsLazy } from "@webpack";

const { getBlockedUsersForVoiceChannel, getIgnoredUsersForVoiceChannel } = findByPropsLazy("getBlockedUsersForVoiceChannel", "getIgnoredUsersForVoiceChannel");

export default definePlugin({
    name: "BypassBlockedOrIgnored",
    description: "Bypass the blocked or ignored user modal if is present in voice channels.",
    authors: [Devs.nicola02nb],
    settings,
    patches: [
        {
            find: "async handleVoiceConnect(",
            replacement: {
                match: /async handleVoiceConnect\((\i)\){/,
                replace: "async handleVoiceConnect($1){$self.handleVoiceConnect($1);"
            }
        },
        {
            find: "{handleBlockedOrIgnoredUserVoiceChannelJoin(",
            replacement: {
                match: /{handleBlockedOrIgnoredUserVoiceChannelJoin\((\i),(\i)\){/,
                replace: "{handleBlockedOrIgnoredUserVoiceChannelJoin($1,$2){if($self.handleBlockedOrIgnoredUserVoiceChannelJoin($1,$2))return;"
            }
        }
    ],
    start: () => {
    },
    stop: () => {
    },

    handleVoiceConnect(...args) {
        if (!settings.store.bypassWhenJoining) return;

        const channelId = args[0].channel.id;
        args[0].bypassBlockedWarningModal = this.shouldBypass(channelId);
    },

    handleBlockedOrIgnoredUserVoiceChannelJoin(...args) {
        if (!settings.store.bypassWhenUserJoins) return;

        const userId = args[1];

        if (settings.store.bypassIgnoredUsersModal && RelationshipStore.isIgnored(userId)
            || settings.store.bypassBlockedUsersModal && RelationshipStore.isBlocked(userId)) {
            return true;
        }
    },

    shouldBypass(channelId) {
        const shouldBypassBlocked = settings.store.bypassBlockedUsersModal;
        const hasBlockedUsers = getBlockedUsersForVoiceChannel(channelId).size;
        const shouldBypassIgnored = settings.store.bypassIgnoredUsersModal;
        const hasIgnoredUsers = getIgnoredUsersForVoiceChannel(channelId).size;

        return shouldBypassBlocked && hasBlockedUsers && shouldBypassIgnored
            || !hasBlockedUsers && shouldBypassIgnored && hasIgnoredUsers
            || shouldBypassBlocked && hasBlockedUsers && !hasIgnoredUsers;
    }
});

