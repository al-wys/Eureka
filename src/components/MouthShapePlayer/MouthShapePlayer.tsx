import React from 'react';

import { IMouthShapePlayerProps } from './IMouthShapePlayer.types';
import { Stack, PrimaryButton } from 'office-ui-fabric-react';

import * as faceapi from 'face-api.js';

export class MouthShapePlayer extends React.Component<IMouthShapePlayerProps> {
    private faceMarkCanvas: HTMLCanvasElement | null = null;
    private video: HTMLVideoElement | null = null;
    private loadModelTask?: Promise<void>;

    public componentDidMount() {
        // this.loadModelTask = faceapi.nets.tinyFaceDetector.load('/weights').then(() => {
        //     return faceapi.loadFaceLandmarkModel('/weights');
        // });
        this.loadModelTask = new Promise(async (resolve) => {
            await faceapi.nets.tinyFaceDetector.load('/weights');
            await faceapi.loadFaceLandmarkModel('/weights');

            resolve();
        });
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
        if (!this.loadModelTask) return;
        await this.loadModelTask;

        this.getPoints(true);
        setTimeout(() => {
            this.video!.play();
        }, 3000);
    }

    private async getPoints(force?: boolean) {
        if (this.video!.ended) return;

        if (force || !this.video!.paused) {
            const res = await faceapi.detectSingleFace(this.video as any, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })).withFaceLandmarks();
            console.log(res);
            if (res) {
                const dims = faceapi.matchDimensions(this.faceMarkCanvas!, this.video!, true);
                const resizedRes = faceapi.resizeResults(res, dims);

                faceapi.draw.drawFaceLandmarks(this.faceMarkCanvas!, resizedRes);
                faceapi.draw.drawDetections(this.faceMarkCanvas!, resizedRes);
            }
        }

        setTimeout(() => {
            this.getPoints();
        });
    }
}