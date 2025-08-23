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
import { React } from "@webpack/common";

import { settings } from "./settings";
import { MediaEngineStore } from "./stores";
import { ToggleButton } from "./components/ToggleButton";

let isPlaying = false;
let audio: HTMLAudioElement | undefined;
const defaultAudioUrl = "https://raw.githubusercontent.com/nicola02nb/BetterDiscord-Stuff/main/Plugins/NotifyWhenMuted/stop_talking.wav";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default definePlugin({
    name: "NotifyWhenMuted",
    description: "Plays a sound when user tries to speak while muted.",
    authors: [Devs.nicola02nb],
    settings,
    patches: [
        {
            find: "getSpeakingWhileMuted\(\){return ",
            replacement: {
                match: /(getSpeakingWhileMuted\(\){)(return) (\i)/,
                replace: "$1$self.handleSpeaking($3);$2 $3"
            }
        },
        {
            find: ".horizontal,HORIZONTAL_REVERSE:",
            replacement: {
                match: /(\i)=>{(var{children:\i,className:\i,direction:\i=\i.HORIZONTAL)/,
                replace: "$1=>{$self.getButton(e);$2"
            }
        }
    ],
    start: () => {
        isPlaying = false;
        audio = undefined;
    },
    stop: () => {
        audio?.pause();
        audio = undefined;
        isPlaying = false;
    },

    async handleSpeaking(isSpeaking: boolean) {
        if (!settings.store.notifyEnabled
            || !settings.store.notifyServerMuted && !MediaEngineStore.isSelfMute() && MediaEngineStore.isMute()
            || MediaEngineStore.isSelfDeaf() && !settings.store.notifyWhenDeafen) return;
        if (isSpeaking && !isPlaying) {
            isPlaying = true;
            audio = new Audio(isValidURL(settings.store.audioUrl));
            audio.addEventListener('error', () => {
                isPlaying = false;
                audio = undefined;
            });
            audio.addEventListener('ended', async () => {
                await delay(settings.store.delayBetweenNotifications);
                isPlaying = false;
                audio = undefined;
            });
            audio.volume = settings.store.audioVolume / 100;
            audio.play();
        }
    },

    getButton(e: { children?: React.ReactNode[], className?: string; }): void {
        if (!settings.store.showToggleButton) return;
        if (!e.className?.startsWith("voiceButtonsContainer_")) return;
        e.children?.unshift(<ToggleButton />);
    }
});


function isValidURL(string) {
    try {
        new URL(string);
        return string;
    } catch (e) {
        return defaultAudioUrl;
    }
}

