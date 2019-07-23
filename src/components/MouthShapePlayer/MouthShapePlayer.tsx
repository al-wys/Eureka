import React from 'react';

import { IMouthShapePlayerProps } from './IMouthShapePlayer.types';
import { Stack, PrimaryButton } from 'office-ui-fabric-react';

import FaceDetecterHelper from '../../utils/FaceDetecterHelper';

export class MouthShapePlayer extends React.Component<IMouthShapePlayerProps> {
    private faceMarkCanvas: HTMLCanvasElement | null = null;
    private video: HTMLVideoElement | null = null;
    private loadFaceDetectTask?: Promise<void>;

    public componentDidMount() {
        this.loadFaceDetectTask = FaceDetecterHelper.init();
        console.log('componentDidMount');
    }

    public render() {
        return (
            <Stack styles={{ root: { height: this.props.height || "auto", width: this.props.width || "auto" } }} tokens={{ childrenGap: 5 }} className={this.props.className}>
                <Stack styles={{ root: { position: 'relative' } }}>
                    <video
                        autoPlay={false}
                        height="auto"
                        width="auto"
                        ref={(ins) => this.video = ins}
                        onLoadedMetadata={this.onLoadVideo}
                    >
                        <source src={this.props.src} type={this.props.type} />
                    </video>
                    <canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} ref={(ins) => this.faceMarkCanvas = ins}></canvas>
                </Stack>
                <Stack horizontal={true} horizontalAlign="space-between" tokens={{ childrenGap: 15 }}>
                    <Stack grow={1}><PrimaryButton text="Play" /></Stack>
                    <Stack grow={1}><PrimaryButton text="Pause" /></Stack>
                </Stack>
            </Stack>
        );
    }

    private onLoadVideo = async () => {
        if (!this.loadFaceDetectTask) return;
        await this.loadFaceDetectTask;

        this.getPoints(true);
        setTimeout(() => {
            this.video!.play();
        }, 5000);
    }

    private async getPoints(force?: boolean) {
        if (this.video!.ended) return;

        if (force || !this.video!.paused) {
            await FaceDetecterHelper.drawFaceMark(this.video!, this.faceMarkCanvas!);
        }

        setTimeout(() => {
            this.getPoints();
        });
    }
}