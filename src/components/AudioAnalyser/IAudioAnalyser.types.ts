export interface IAudioAnalyserProps {
    audio: MediaStream;
    addOnEndEventListener: (func: () => void) => void;
}