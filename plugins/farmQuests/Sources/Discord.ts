import { AbstractTTSSource } from "./AbstractSource";

export default new class DiscordTTS extends AbstractTTSSource<SpeechSynthesisUtterance> {
    getDefaultVoice() {
        return speechSynthesis.getVoices()[0].voiceURI;
    }

    async retrieveVoices() {
        let voices = speechSynthesis.getVoices();
        this.voicesLabels = voices
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(voice => ({
                label: voice.name,
                value: voice.voiceURI
            }));
        return this.voicesLabels;
    }

    async getMedia(text: string) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(v => v.voiceURI === this.selectedVoice) || speechSynthesis.getVoices()[0];
        return utterance;
    }
};
