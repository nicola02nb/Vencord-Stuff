import settings from "../settings";
import { default as DiscordTTS } from "../Sources/Discord";
import { default as StreamElementsTTS } from "../Sources/Streamelements";
import { default as TikTokTTS } from "../Sources/TikTok";
import { TTSSource, TTSSourceInterface, TTSVoice } from "../types/ttssource";

function clamp(number: number, min: number, max: number) {
    return Math.max(min, Math.min(number, max));
}

export const sourcesOptions = [
    { label: "Discord", value: "discord" },
    { label: "StreamElements", value: "streamelements" },
    { label: "TikTok", value: "tiktok" }
];

export const nameToInterface: Record<string, TTSSourceInterface<any>> = {
    "discord": DiscordTTS,
    "streamelements": StreamElementsTTS,
    "tiktok": TikTokTTS
};

export default new class AudioPlayer {
    sourceInterface: TTSSourceInterface<any> = DiscordTTS;

    priorityMessages: string[] = [];
    normalMessages: string[] = [];

    isPlaying = false;
    isPriority = false;
    playingText = "";
    media: HTMLAudioElement | SpeechSynthesisUtterance | undefined;

    rate: number = 1.0;
    delay: number = 0;
    volume: number = 1.0;

    updateConfig(source: TTSSource | undefined, voice: TTSVoice | undefined, rate: number, delay: number, volume: number) {
        this.updateTTSSource(source, voice);
        this.updateRate(rate);
        this.updateDelay(delay);
        this.updateVolume(volume);
    }

    updateTTSSource(source: TTSSource | undefined = "discord", voice?: TTSVoice) {
        this.sourceInterface = nameToInterface[source];
        settings.def.ttsVoice.options = this.sourceInterface.getVoices();
        if (!voice) {
            voice = this.sourceInterface.getDefaultVoice();
        }
        this.sourceInterface.setVoice(voice);
    }

    updateVoice(voice: TTSVoice) {
        this.sourceInterface.setVoice(voice);
    }

    updateRate(rate: number) {
        this.rate = rate;
        if (this.media instanceof Audio)
            this.media.playbackRate = rate;
        else if (this.media instanceof SpeechSynthesisUtterance)
            this.media.rate = rate;
    }

    updateDelay(delay: number) {
        this.delay = delay;
    }

    updateVolume(volume: number) {
        this.volume = volume;
        if (this.media instanceof Audio)
            this.media.volume = clamp(volume, 0, 1);
        else if (this.media instanceof SpeechSynthesisUtterance)
            this.media.volume = clamp(volume, 0, 1);
    }

    startTTS(text: string, priority: boolean = false) {
        if (!text) return;
        if (priority) {
            this.priorityMessages.push(text);
            /* if (!this.isPriority) {
                this.stopCurrentTTS();
            } */
        } else {
            this.normalMessages.push(text);
        }
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.playTTS();
        }
    }

    stopCurrentTTS() {
        if (this.media instanceof Audio)
            this.media.pause();
        else if (this.media instanceof SpeechSynthesisUtterance)
            speechSynthesis.cancel();
        this.playingText = "";
        this.media = undefined;
        this.playNextTTS();
    }

    stopTTS() {
        this.isPlaying = false;
        this.priorityMessages = [];
        this.normalMessages = [];
        this.stopCurrentTTS();
    }

    playNextTTS() {
        this.playingText = "";
        this.media = undefined;
        if (this.priorityMessages.length > 0 || this.normalMessages.length > 0) {
            this.playTTS();
        } else {
            this.isPlaying = false;
        }
    }

    playAudio() {
        if (this.media instanceof HTMLAudioElement) {
            this.media.playbackRate = this.rate;
            this.media.volume = clamp(this.volume, 0, 1);
            this.media.addEventListener('ended', () => this.playNextTTS());
            this.media.play();
        } else if (this.media instanceof SpeechSynthesisUtterance) {
            this.media.rate = this.rate;
            this.media.volume = clamp(this.volume, 0, 1);
            this.media.onend = () => this.playNextTTS;
            speechSynthesis.speak(this.media);
        } else {
            this.playNextTTS();
        }
    }

    playTTS() {
        this.isPriority = this.priorityMessages.length > 0;
        this.playingText = this.isPriority ? this.priorityMessages.shift() || "" : this.normalMessages.shift() || "";
        if (this.playingText) {
            this.sourceInterface.getMedia(this.playingText).then(media => {
                this.media = media;
                setTimeout(() => this.playAudio(), this.delay);
            }).catch(error => {
                console.error("Error getting media:", error);
                this.playNextTTS();
            });
        }
    }
};
