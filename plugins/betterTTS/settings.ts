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
import * as betterTTS from "./index";
import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import AudioPlayer, { sourcesOptions } from "./libraries/AudioPlayer";
import { UserSettingsProtoStore } from "./stores";
import { updateToggleKeys } from "./libraries/utils";

// TODO: finish implementing the settings UI
export default definePluginSettings({
    enableTts: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Enables/Disables the TTS.",
        onChange: (value: boolean) => {
            if (value) {
                AudioPlayer.stopTTS();
            }
        }
    },
    enableTtsCommand: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Allow playback and usage of /tts command.",
        onChange: (value: boolean) => {
            UserSettingsProtoStore.settings.textAndImages.enableTtsCommand.value = value;
            betterTTS.default.messageRecieved;
        },
    },
    enableUserAnnouncement: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Enables/Disables the User Announcement when join/leaves the channel.",
    },
    enableMessageReading: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Enables/Disables the message reading from channels.",
    },
    messagesChannelsToRead: {
        type: OptionType.SELECT,
        description: "Choose the channels you want messages to be read.",
        options: [
            { label: "Never", value: "never" },
            { label: "All Channels", value: "allChannels" },
            { label: "Focused Channel", value: "focusedChannel" },
            { label: "Connected Channel", value: "connectedChannel" },
            { label: "Focused Server Channels", value: "focusedGuildChannels" },
            { label: "Connected Server Channels", value: "connectedGuildChannels" }
        ]
    },
    ignoreWhenConnected: {
        type: OptionType.SELECT,
        description: "Choose the channels you want messages to be ignored while in a voice channel.",
        options: [
            { label: "None", value: "none" },
            { label: "Subscribed", value: "subscribed" },
            { label: "Focused/Connected", value: "focusedConnected" },
            { label: "All", value: "all" }
        ]
    },
    subscribedChannels: {
        type: OptionType.CUSTOM,
        default: new Array<string>()
    },
    subscribedGuilds: {
        type: OptionType.CUSTOM,
        default: new Array<string>()
    },
    channelInfoReading: {
        type: OptionType.SELECT,
        description: "Sets which of the channel should prepend server and/or channel name.",
        options: [
            { label: "None", value: "none" },
            { label: "Subscribed", value: "subscribed" },
            { label: "Focused/Connected", value: "focusedConnected" },
            { label: "All", value: "all" }
        ]
    },
    messagePrependGuild: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Reads also the name of the server where the message comes from."
    },
    messagePrependChannel: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Reads also the name of the channel where the message comes from."
    },
    messagePrependNames: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Reads also the name of the user that sent the message."
    },
    messageNamesReading: {
        type: OptionType.SELECT,
        description: "Sets which of the names of a user is used by tts.",
        options: [
            { label: "Default", value: "default" },
            { label: "Username", value: "userName" },
            { label: "Display Name", value: "globalName" },
            { label: "Friend Name", value: "friendName" },
            { label: "Server Name", value: "serverName" }
        ]
    },
    messageLinksReading: {
        type: OptionType.SELECT,
        description: "Select how links should be read by TTS.",
        options: [
            { label: "Remove Links", value: "remove" },
            { label: "Read Only Domain", value: "domain" },
            { label: "Sobstitute With word URL", value: "sobstitute" },
            { label: "Keep URL", value: "keep" }
        ]
    },
    messageSpoilersReading: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "If enabled, it will read messages spoilers content."
    },
    ttsSource: {
        type: OptionType.SELECT,
        description: "Choose the Source of TTS.",
        options: sourcesOptions,
        onChange: (value: string) => {
            AudioPlayer.updateTTSSource(value);
        }
    },
    ttsVoice: {
        type: OptionType.SELECT,
        description: "Changes voice used for TTS.",
        options: AudioPlayer.sourceInterface.getVoices(),
        onChange: (value: string) => {
            AudioPlayer.updateVoice(value);
        }
    },
    ttsMutedUsers: {
        type: OptionType.CUSTOM,
        name: "Muted Users",
        description: "List of users that muted to TTS.",
        default: new Array<string>()
    },
    blockBlockedUsers: {
        type: OptionType.BOOLEAN,
        default: true,
        name: "Block Blocked Users",
        description: "Blocks blocked users from TTS."
    },
    blockIgnoredUsers: {
        type: OptionType.BOOLEAN,
        default: true,
        name: "Block Ignored Users",
        description: "Blocks ignored users from TTS."
    },
    blockNotFriendusers: {
        type: OptionType.BOOLEAN,
        default: false,
        name: "Block Not Friend Users",
        description: "Blocks not friends users from TTS."
    },
    blockMutedChannels: {
        type: OptionType.BOOLEAN,
        default: true,
        name: "Block Muted Channels",
        description: "Blocks muteds channels from TTS."
    },
    blockMutedGuilds: {
        type: OptionType.BOOLEAN,
        default: false,
        name: "Block Muted Guilds",
        description: "Blocks muteds server/guilds from TTS."
    },
    ttsVolume: {
        type: OptionType.SLIDER,
        default: 100,
        name: "TTS Volume",
        description: "Changes the volume of the TTS.",
        min: 0,
        max: 100,
        step: 0.1,
        units: "%",
        markers: [0, 25, 50, 75, 100],
        onChange: (value: number) => {
            AudioPlayer.updateVolume(value);
        }
    },
    ttsSpeechRate: {
        type: OptionType.SLIDER,
        default: 1,
        name: "TTS Speech Rate",
        description: "Changes the speed of the TTS.",
        min: 0.1,
        max: 2,
        step: 0.05,
        units: "x",
        markers: [0.1, 1, 1.25, 1.5, 1.75, 2],
        onChange: (value: number) => {
            AudioPlayer.updateRate(value);
        }
    },
    ttsPreview: {
        type: OptionType.CUSTOM,
        name: "Play TTS Preview",
        description: "Plays a default test message.",
        onClick: () => {
            AudioPlayer.startTTS("This is what text-to-speech sounds like at the current speed.", true);
        }
    },
    ttsDelayBetweenMessages: {
        type: OptionType.NUMBER,
        default: 1000,
        name: "Delay Between messages (ms)",
        description: "Only works for Syncronous messages.",
        onChange: (value: number) => {
            AudioPlayer.updateDelay(value);
        }
    },
    textReplacerRules: {
        type: OptionType.CUSTOM,
        name: "Rules",
        description: "Sobstitute Texts that matches your regex before reading it.",
        default: new Array<{ regex: string; replacement: string; }>()
    },
    textReplacerAdd: {
        type: OptionType.CUSTOM,
        name: "Add Rule",
        description: "Adds a regex rule to sobstitute matches with a custom text."
    },
    ttsToggle: {
        type: OptionType.KEYBIND,
        name: "Toggle TTS",
        description: "Shortcut to toggle the TTS.",
        clearable: true,
        default: [],
        onChange: (value: string[]) => {
            updateToggleKeys(value);
        }
    },
});
