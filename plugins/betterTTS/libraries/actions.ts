import { FluxEvent, MessageJSON } from "@vencord/discord-types";
import AudioPlayer from "./AudioPlayer";
import { getPatchedContent, getUserName, shouldPlayMessage } from "./utils";
import { MediaEngineStore, RTCConnectionStore, UserStore } from "../stores";
import settings from "../settings";

export function messageRecieved(event: FluxEvent) {
    if (!settings.store.enableTts) return;
    let message = event.message as MessageJSON;
    if ((event.guildId || !message.member) && shouldPlayMessage(event.message)) {
        let text = getPatchedContent(message, message.guild_id);
        AudioPlayer.startTTS(text);
    }
}

export function annouceUser(event: FluxEvent) {
    if (!settings.store.enableTts) return;
    let connectedChannelId = RTCConnectionStore.getChannelId();
    let userId = UserStore.getCurrentUser().id;
    for (const userStatus of event.voiceStates) {
        if (connectedChannelId && userStatus.userId !== userId) {
            if (userStatus.channelId !== userStatus.oldChannelId) {
                let username = getUserName(userStatus.userId, userStatus.guildId);
                if (userStatus.channelId === connectedChannelId) {
                    AudioPlayer.startTTS(`${username} joined`, true);
                } else if (userStatus.oldChannelId === connectedChannelId) {
                    AudioPlayer.startTTS(`${username} left`, true);
                }
            }
        }
    }
}

export function speakMessage(event: FluxEvent) {
    if (!settings.store.enableTts) return;
    let text = getPatchedContent(event.message, event.channel.guild_id);
    AudioPlayer.startTTS(text);
}

export function stopTTS() {
    if (MediaEngineStore.isSelfDeaf())
        AudioPlayer.stopTTS();
}
