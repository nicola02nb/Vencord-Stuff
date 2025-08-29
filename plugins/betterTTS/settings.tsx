/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { IPluginOptionComponentProps, OptionType } from "@utils/types";
import { Button, Select, TextInput } from "webpack/common/components";
import { useEffect, useState } from "webpack/common/react";

import * as betterTTS from "./index";
import AudioPlayer, { getDefaultVoice, getVoices, sourcesOptions } from "./libraries/AudioPlayer";
import { updateToggleKeys } from "./libraries/utils";
import { ChannelStore, GuildStore, UserSettingsProtoStore, UserStore } from "./stores";

// TODO: finish implementing the settings description for custom components
const settings = definePluginSettings({
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
        type: OptionType.COMPONENT,
        component: DropdownButtonGroup,
        componentProps: { type: "channel", getNameFunction: ChannelStore.getChannel },
        default: new Array<string>()
    },
    subscribedGuilds: {
        type: OptionType.COMPONENT,
        component: DropdownButtonGroup,
        componentProps: { type: "guild", getNameFunction: GuildStore.getGuild },
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
    ttsSelectSourceAndVoice: {
        type: OptionType.COMPONENT,
        component: DropdownSourceAndVoices
    },
    ttsSource: {
        type: OptionType.CUSTOM
    },
    ttsVoice: {
        type: OptionType.CUSTOM
    },
    ttsMutedUsers: {
        type: OptionType.COMPONENT,
        component: DropdownButtonGroup,
        componentProps: { type: "user", getNameFunction: UserStore.getUser },
        default: new Array<string>()
    },
    blockBlockedUsers: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Blocks blocked users from TTS."
    },
    blockIgnoredUsers: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Blocks ignored users from TTS."
    },
    blockNotFriendusers: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Blocks not friends users from TTS."
    },
    blockMutedChannels: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Blocks muteds channels from TTS."
    },
    blockMutedGuilds: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Blocks muteds server/guilds from TTS."
    },
    ttsVolume: {
        type: OptionType.SLIDER,
        default: 100,
        description: "Changes the volume of the TTS.",
        componentProps: {
            min: 0,
            max: 100,
            step: 1,
            units: "%"
        },
        stickToMarkers: false,
        markers: [0, 25, 50, 75, 100],
        onChange: (value: number) => {
            AudioPlayer.updateVolume(value / 100);
        }
    },
    ttsSpeechRate: {
        type: OptionType.SLIDER,
        default: 1,
        description: "Changes the speed of the TTS.",
        componentProps: {
            min: 0.1,
            max: 2,
            step: 0.05,
            units: "x"
        },
        stickToMarkers: false,
        markers: [0.1, 1, 1.25, 1.5, 1.75, 2],
        onChange: (value: number) => {
            AudioPlayer.updateRate(value);
        }
    },
    ttsPreview: {
        type: OptionType.COMPONENT,
        component: PreviewTTS
    },
    ttsDelayBetweenMessages: {
        type: OptionType.NUMBER,
        default: 1000,
        description: "Only works for Syncronous messages.",
        onChange: (value: number) => {
            AudioPlayer.updateDelay(value);
        }
    },
    textReplacerRules: {
        type: OptionType.COMPONENT,
        component: TextReplaceDropdown,
        default: new Array<{ regex: string; replacement: string; }>()
    },
    ttsToggle: {
        type: OptionType.KEYBIND,
        description: "Shortcut to toggle the TTS.",
        clearable: true,
        global: false,
        default: [],
        onChange: (value: string[]) => {
            updateToggleKeys(value);
        }
    },
});
export default settings;

function PreviewTTS() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [text, setText] = useState("This is what text-to-speech sounds like at the current speed.");

    const getLabel = (play: boolean) => {
        if (play) {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                    </svg>
                    Preview
                </>
            );
        } else {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                    Preview
                </>
            );
        }
    };

    return (
        <>
            <TextInput
                value={text}
                placeholder="Enter text to preview"
                onChange={event => {
                    setText(event);
                }}
            />
            <Button
                onClick={() => {
                    AudioPlayer.playNextTTS();
                    if (!isPlaying) {
                        AudioPlayer.startTTS(text, true);
                    }
                    setIsPlaying(!isPlaying);
                }}
            >
                {getLabel(isPlaying)}
            </Button>
        </>
    );
}

function DropdownSourceAndVoices({ }) {
    const initialSource = settings.store.ttsSource;
    const initialVoice = settings.store.ttsVoice;

    const optionsSources = sourcesOptions;
    const [selectedSource, setSelectedSource] = useState(initialSource);

    const [optionsVoices, setOptionsVoices] = useState(getVoices(initialSource) || []);
    const [selectedVoice, setSelectedVoice] = useState(initialVoice || getDefaultVoice(initialSource) || optionsVoices[0]?.value);

    useEffect(() => {
        setOptionsVoices(getVoices(selectedSource) || []);
        const newVoice = getDefaultVoice(selectedSource) || optionsVoices[0]?.value;
        setSelectedVoice(newVoice);
    }, [selectedSource]);

    useEffect(() => {
        settings.store.ttsSource = selectedSource;
        settings.store.ttsVoice = selectedVoice;

        AudioPlayer.updateTTSSourceAndVoice(selectedSource, selectedVoice);
    }, [selectedVoice]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Select
                options={optionsSources}
                placeholder="Select TTS Source"
                closeOnSelect={true}
                select={(value: string) => {
                    setSelectedSource(value);
                }}
                isSelected={(value: string) => selectedSource === value}
                serialize={(value: string) => String(value)}
            />
            <Select
                options={optionsVoices}
                placeholder="Select TTS Voice"
                closeOnSelect={true}
                select={(value: string) => {
                    setSelectedVoice(value);
                }}
                isSelected={(value: string) => selectedVoice === value}
                serialize={(value: string) => String(value)}
            />
        </div>
    );
}

function DropdownButtonGroup({ setValue, option }: IPluginOptionComponentProps) {
    const [selectedOption, setSelectedOption] = useState("");
    const { type } = option.componentProps;
    const labeltext = type === "subscribedChannels" ? "Remove Channel" : type === "subscribedGuilds" ? "Remove Guild" : "Remove User";

    const [options, setOptions] = useState<string[]>(settings.store[type] || []);

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <Select
                placeholder="Select one to remove"
                select={value => setSelectedOption(value)}
                isSelected={value => selectedOption === value}
                serialize={value => String(value)}
                options={[
                    ...options.map((opt, index) => {
                        const obj = option.componentProps.getNameFunction(opt);
                        const name = obj?.name ?? obj?.username;
                        return { label: name, value: opt };
                    })
                ]}
            />
            <Button
                onClick={() => {
                    if (!selectedOption) return;
                    const index = options.findIndex(opt => opt === selectedOption);
                    if (index !== -1) {
                        const newOptions = options.filter((_, i) => i !== index);
                        setSelectedOption("");
                        setOptions([...newOptions]);
                    }
                }}
            >
                {labeltext}
            </Button>
        </div>
    );
}

function TextReplaceDropdown({ }) {
    const [options, setOptions] = useState(settings.store.textReplacerRules || []);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        settings.store.textReplacerRules = options;
    }, [options]);

    function addRegex(regex: { regex: string; replacement: string; }) {
        setOptions([...options, regex]);
    }

    function removeRegex() {
        setOptions(options.filter((_, i) => i !== selected));
    }

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <Select
                    placeholder="Regex List"
                    options={[
                        ...options.map((option, index) => ({
                            label: `${option.regex} --> ${option.replacement}`,
                            value: index
                        }))
                    ]}
                    closeOnSelect={true}
                    select={value => setSelected(value)}
                    isSelected={value => selected === value}
                    serialize={value => String(value)}
                />
                <Button onClick={removeRegex}>
                    Remove Regex
                </Button>
            </div>
            <TextReplaceAdd onAdd={addRegex} />
        </>
    );
}

function TextReplaceAdd({ onAdd }) {
    const [regex, setRegex] = useState("");
    const [replacement, setReplacement] = useState("");

    const disabled = regex === "" || replacement === "";

    return (
        <>
            <TextInput
                value={regex}
                placeholder="Enter Regex"
                onChange={event => {
                    setRegex(event);
                }}
            />
            <TextInput
                value={replacement}
                placeholder="Text To Soubstitute"
                onChange={event => {
                    setReplacement(event);
                }}
            />
            <Button
                disabled={disabled}
                onClick={() => {
                    onAdd({ regex: regex, replacement: replacement });
                    setRegex("");
                    setReplacement("");
                }}
            >
                Add Regex
            </Button>
        </>
    );
}
