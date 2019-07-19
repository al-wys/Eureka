export interface IMouthShapeRecorderProps {
    width?: number | string;
    height?: number | string;
    className?: string;

    onStartRecording?: () => void;
    onStopRecording?: () => void;
    onSaveRecording?: (video: Blob) => void;
}