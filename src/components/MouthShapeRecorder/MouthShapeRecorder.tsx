import React from 'react';

import { Stack, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { IMouthShapeRecorderProps } from './IMouthShapeRecorder.types';
import { IMouthShapeRecorderState } from './IMouthShapeRecorder.states';
import FaceDetecterHelper from '../../utils/FaceDetecterHelper';

const RecordRTC = require('recordrtc/RecordRTC.min');

const hasGetUserMedia = !!(navigator.getUserMedia || (navigator as any).webkitGetUserMedia ||
    (navigator as any).mozGetUserMedia || (navigator as any).msGetUserMedia);

const _video = document.createElement('video');
const supportSrcObj = 'srcObject' in _video;

function captureUserMedia(callback: (stream: MediaStream) => void, onFailed?: (error: MediaStreamError) => void) {
    const params = { audio: true, video: true };

    navigator.getUserMedia(params, callback, (error) => {
        console.error(error);

        if (onFailed) {
            onFailed(error);
        } else {
            alert('Error when open camera.');
        }
    });
}

export class MouthShapeRecorder extends React.Component<IMouthShapeRecorderProps, IMouthShapeRecorderState> {
    private recordVideo: any;
    private videoStream?: MediaStream;

    private faceMarkCanvas: HTMLCanvasElement | null = null;
    private video: HTMLVideoElement | null = null;
    private loadFaceDetectTask?: Promise<void>;

    private videoRef: any;

    constructor(props: IMouthShapeRecorderProps) {
        super(props);

        this.state = {
            videoSource: {}
        };

        this.videoRef = supportSrcObj ?
            (v: HTMLVideoElement | null) => {
                this.video = v;

                if (v) {
                    v.srcObject = this.state.videoSource.srcObject;
                }
            } :
            (v: HTMLVideoElement | null) => this.video = v;
    }

    public componentDidMount() {
        if (!hasGetUserMedia) {
            alert('Current broswer is not supported, please use Chrome, Firefox or Edge Preview.');
        } else {
            this.loadFaceDetectTask = FaceDetecterHelper.init();
        }
    }

    public async componentDidUpdate(prevProps: IMouthShapeRecorderProps, prevState: IMouthShapeRecorderState) {
        if (!prevState.isAllowed && this.state.isAllowed) {
            // Camera is just opened
            if (this.loadFaceDetectTask) {
                await this.loadFaceDetectTask;

                setTimeout(() => {
                    // Delay for 1 sec to ensure the video is ready in HTML
                    this.detectFaceBox();
                }, 1000);
            }
        }
    }

    public render() {
        return (
            <Stack tokens={{ childrenGap: 5 }} verticalAlign="center" verticalFill={true} styles={{ root: { width: this.props.width, height: this.props.height } }} className={this.props.className}>
                <Stack styles={{ root: { position: 'relative' } }}>
                    {this.state.isAllowed ? (
                        <>
                            <video
                                autoPlay={true}
                                muted={true}
                                ref={this.videoRef}
                                src={supportSrcObj ? undefined : this.state.videoSource.src}
                            />
                            <canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} ref={(ins) => this.faceMarkCanvas = ins}></canvas>
                        </>
                    ) : (
                            <PrimaryButton text="Ready to turn on camera" onClick={this.turnOnCamera} />
                        )
                    }
                </Stack>
                <Stack horizontal={true} horizontalAlign="space-between" tokens={{ childrenGap: 15 }}>
                    <Stack tokens={{ childrenGap: 5 }} grow={1}>
                        <PrimaryButton disabled={!this.state.isAllowed || !hasGetUserMedia || this.state.isRecording} text="Start recording" onClick={this.startRecord} />
                        <DefaultButton disabled={this.state.isRecording !== false || !this.props.onPreviewRecording} text="Preview recording" onClick={this.previewRecord} />
                    </Stack>
                    <Stack tokens={{ childrenGap: 5 }} grow={1}>
                        <PrimaryButton disabled={!this.state.isRecording} text="Stop recording" onClick={this.stopRecord} />
                        <PrimaryButton disabled={this.state.isRecording !== false || !this.props.onSaveRecording} text="Save recording" onClick={this.saveRecord} />
                    </Stack>
                </Stack>
                <Stack>
                    <DefaultButton disabled={!this.state.isAllowed || this.state.isRecording} text="Turn off camera" onClick={this.turnOffCamera} />
                </Stack>
            </Stack>
        );
    }

    private async detectFaceBox() {
        if (!this.state.isAllowed) return;

        await FaceDetecterHelper.drawFaceMark(this.video!, this.faceMarkCanvas!, true);

        setTimeout(() => {
            this.detectFaceBox();
        });
    }

    private turnOnCamera = () => {
        captureUserMedia((stream) => {
            console.log('requestUserMedia');

            this.videoStream = stream;

            if (supportSrcObj) {
                this.setState({ videoSource: { srcObject: stream } });
            } else {
                this.setState({ videoSource: { src: window.URL.createObjectURL(stream) } });
            }

            this.setState({ isAllowed: true, isRecording: undefined });
            this.recordVideo = null;
            // console.log('setting state', this.state);
        });
    }

    private turnOffCamera = () => {
        this.setState({ isAllowed: false });
        this.videoStream!.getTracks().forEach(t => t.stop());
        this.videoStream = undefined;
    }

    private startRecord = () => {
        this.setState({ isRecording: true });

        this.recordVideo = RecordRTC(this.videoStream, { type: 'video' });
        this.recordVideo.startRecording();

        if (this.props.onStartRecording) {
            this.props.onStartRecording();
        }
    }

    private stopRecord = () => {
        this.recordVideo.stopRecording(() => {
            this.setState({ isRecording: false });

            // let params = {
            //     type: 'video/webm',
            //     data: this.recordVideo.blob,
            //     id: Math.floor(Math.random() * 90000) + 10000
            // };
        });

        if (this.props.onStopRecording) {
            this.props.onStopRecording();
        }
    }

    private previewRecord = () => {
        if (this.props.onPreviewRecording) {
            this.props.onPreviewRecording(this.recordVideo.blob);
        }
    }

    private saveRecord = () => {
        if (this.props.onSaveRecording) {
            this.props.onSaveRecording(this.recordVideo.blob);
        }
    }
}