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
import AudioPlayer from "./libraries/AudioPlayer";
import { onKeyDown, updateRelationships } from "./libraries/utils";
import { annouceUser, messageRecieved, speakMessage, stopTTS } from "./libraries/actions";
import { PatchChannelContextMenu, PatchGuildContextMenu, PatchUserContextMenu } from "./libraries/ContextMenu";

export default definePlugin({
    name: "BetterTTS",
    description: "A plugin that allows you to play a custom TTS when a message is received.",
    authors: [Devs.nicola02nb],
    settings,
    contextMenus: {
        "user-context": PatchUserContextMenu,
        "channel-context": PatchChannelContextMenu,
        "guild-context": PatchGuildContextMenu,
        "guild-header-popout": PatchGuildContextMenu
    },
    flux: {
        AUDIO_TOGGLE_SELF_DEAF: stopTTS,
        VOICE_STATE_UPDATES: annouceUser,
        SPEAK_MESSAGE: speakMessage,
        MESSAGE_CREATE: messageRecieved,
        RELATIONSHIP_ADD: updateRelationships,
        RELATIONSHIP_REMOVE: updateRelationships,
    },
    patches: [
        {
            find: "new SpeechSynthesisUtterance(",
            group: true,
            replacement: [
                {
                    match: /\((\i),(\i)\){(\i)&&[\s\S]*?,speechSynthesis\.speak\((\i)\)[\s\S]*?}/,
                    replace: "($1,$2){return;}"
                },
                {
                    match: /\(\){[\s\S]*?speechSynthesis\.cancel\(\)[\s\S]*?}/,
                    replace: "() {return;}"
                }
            ]
        },
        {
            find: "default.setTTSType",
            replacement: {
                match: /default.setTTSType\((\i)\)/,
                replace: "default.setTTSType('NONE')"
            }
        }
    ],
    start: () => {
        document.addEventListener("keydown", onKeyDown);
        AudioPlayer.updateConfig(settings.store.ttsSource, settings.store.ttsVoice, settings.store.ttsSpeechRate, settings.store.ttsDelayBetweenMessages, settings.store.ttsVolume);
    },
    stop: () => {
        AudioPlayer.stopTTS();
        document.removeEventListener("keydown", onKeyDown);
    }
});

