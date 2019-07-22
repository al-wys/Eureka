export interface IMouthShapeRecorderProps {
    width?: number | string;
    height?: number | string;
    className?: string;

    onStartRecording?: () => void;
    onStopRecording?: () => void;
    onPreviewRecording?: (video: Blob) => void;
    onSaveRecording?: (video: Blob) => void;
}