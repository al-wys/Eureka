export interface IMouthShapeRecorderState {
    isAllowed?: boolean;
    isRecording?: boolean;
    videoSource: { src?: string, srcObject?: any }
}