/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { FluxEvent } from "@vencord/discord-types";
import { React, SelectedChannelStore, showToast, ToastPosition, ToastType, UserSettingsActionCreators } from "@webpack/common";

import { Toast } from "./components/Toast";
import { settings } from "./settings";
import { MediaEngineStore } from "./stores";

const locales = {
    online: "Online",
    idle: "Idle",
    invisible: "Invisible",
    dnd: "Do Not Disturb"
};

let channelId: string | undefined;
let isConnected = false;
let isMicrophoneMuted = false;
let isSoundMuted = false;

let status = undefined;

const { PreloadedUserSettingsActionCreators } = UserSettingsActionCreators;

export default definePlugin({
    name: "AutoSwitchStatus",
    description: "Automatically switches your discord status to 'away' when you are muted inside a server or 'invisible' when disconnected from a server.",
    authors: [Devs.nicola02nb],
    settings,
    flux: {
        AUDIO_TOGGLE_SELF_DEAF: handleMuteStateChange,
        AUDIO_TOGGLE_SELF_MUTE: handleMuteStateChange,
        RTC_CONNECTION_STATE: handleConnectionStateChange
    },
    start: () => {
        channelId = SelectedChannelStore.getVoiceChannelId();
        isConnected = channelId !== null;
        isMicrophoneMuted = MediaEngineStore.isSelfMute();
        isSoundMuted = MediaEngineStore.isSelfDeaf();
    },
    stop: () => {
    },
});

function handleConnectionStateChange(event: FluxEvent) {
    if (event.context === "default") {
        if (event.state === "RTC_CONNECTED") {
            isConnected = true;
        } else if (event.state === "RTC_DISCONNECTED") {
            isConnected = false;
        }
        updateUserStatus();
    }
}

function handleMuteStateChange(_: FluxEvent) {
    isMicrophoneMuted = MediaEngineStore.isSelfMute();
    isSoundMuted = MediaEngineStore.isSelfDeaf();
    updateUserStatus();
}

function getUserCurrentStatus() {
    var currStatus;
    if (!isConnected) {
        currStatus = settings.store.disconnectedStatus || "invisible";
    }
    else if (isSoundMuted) {
        currStatus = settings.store.mutedSoundStatus || "idle";
    }
    else if (isMicrophoneMuted) {
        currStatus = settings.store.mutedMicrophoneStatus || "online";
    }
    else {
        currStatus = settings.store.connectedStatus || "online";
    }

    return currStatus;
}

function updateUserStatus() {
    var toSet = getUserCurrentStatus();

    // checking if the status has changed since last time
    if (toSet && status !== toSet) {
        status = toSet;
        updateStatus(toSet);
    }
}

function updateStatus(toStatus) {
    console.log(`Updating status to: ${toStatus}`);
    PreloadedUserSettingsActionCreators.updateAsync(
        "status",
        settings => {
            settings.status.value = toStatus;
        }, 15); // 15 is the seconds after which the status will be updated through the API (Prevents rate limiting)
    showToastCustom(locales[toStatus], toStatus);
}

function showToastCustom(message: string, status: string) {
    console.log("Showing toast:", message, "with status:", status);
    if (!settings.store.showToast) return;
    showToast(message, ToastType.SUCCESS, { position: ToastPosition.BOTTOM, component: <Toast message={message} status={status} size={16} /> });
}


