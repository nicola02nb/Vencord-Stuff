import { TTSSourceInterface, TTSVoice, TTSVoiceOption } from "../types/ttssource";

export abstract class AbstractTTSSource<T extends HTMLAudioElement | SpeechSynthesisUtterance> implements TTSSourceInterface<T> {
    protected voicesLabels: TTSVoiceOption[] = [{ label: "No voices available", value: "none" }];
    protected selectedVoice: TTSVoice = "none";

    abstract retrieveVoices(): Promise<TTSVoiceOption[]>;

    abstract getDefaultVoice(): TTSVoice;

    getVoices(): TTSVoiceOption[] {
        return this.voicesLabels;
    }

    setVoice(voice: TTSVoice): void {
        this.selectedVoice = voice;
    }

    abstract getMedia(text: string): Promise<T>;
}
