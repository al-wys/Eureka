import React from 'react';

import { IMouthShapePlayerProps } from './IMouthShapePlayer.types';
import { IMouthShapePlayerState } from './IMouthShapePlayer.states';
import { Stack, Text, DefaultButton } from 'office-ui-fabric-react';

import FaceDetecterHelper from '../../utils/FaceDetecterHelper';
import { AudioAnalyser } from '../AudioAnalyser';

import { getId } from 'office-ui-fabric-react';

const waitSec = 5;

export class MouthShapePlayer extends React.Component<IMouthShapePlayerProps, IMouthShapePlayerState> {
    private faceMarkCanvas: HTMLCanvasElement | null = null;
    private video: HTMLVideoElement | null = null;
    private loadFaceDetectTask?: Promise<void>;

    private onEndFunc?: () => void;

    private audioAnaId: string = getId('audioAna');

    private sec = 0;

    constructor(props: IMouthShapePlayerProps) {
        super(props);

        this.state = {
            text: `This video will start in ${waitSec} sec.`,
            src: props.src,
            isPlaying: true
        };
    }

    public componentDidUpdate(prevProps: IMouthShapePlayerProps, prevState: IMouthShapePlayerState) {
        if (prevProps.src !== this.props.src) {
            this.setState({ src: this.props.src });
        }
    }

    public componentDidMount() {
        this.loadFaceDetectTask = FaceDetecterHelper.init();

        setTimeout(() => {
            this.refreshText();
        }, 1000);

        console.log('componentDidMount');
    }

    public render() {
        return (
            <Stack styles={{ root: { height: this.props.height || "auto", width: this.props.width || "auto" } }} tokens={{ childrenGap: 5 }} className={this.props.className}>
                <Stack>
                    <Text>{this.state.text}</Text>
                </Stack>
                <Stack styles={{ root: { position: 'relative' } }}>
                    {this.state.src ?
                        <>
                            <Stack styles={{ root: { position: 'relative' } }}>
                                <video
                                    autoPlay={false}
                                    height="auto"
                                    width="auto"
                                    ref={(ins) => this.video = ins}
                                    onLoadedMetadata={this.onLoadVideo}
                                    onEnded={this.onEndVideo}
                                >
                                    <source src={this.state.src} type={this.props.type} />
                                </video>
                                <canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} ref={(ins) => this.faceMarkCanvas = ins}></canvas>
                            </Stack>
                            <Stack styles={{ root: { minHeight: '100px' } }}>
                                {this.state.videoMedia ?
                                    <AudioAnalyser audio={this.state.videoMedia} addOnEndEventListener={(func) => this.onEndFunc = func} key={this.audioAnaId} /> :
                                    <></>
                                }
                            </Stack>
                        </> :
                        <></>
                    }
                </Stack>
                <Stack horizontalAlign="space-between" tokens={{ childrenGap: 15 }}>
                    <DefaultButton disabled={this.state.isPlaying} text="Replay" onClick={this.onReplay} />
                    {/* <Stack grow={1}><PrimaryButton text="Play" /></Stack>
                    <Stack grow={1}><PrimaryButton text="Pause" /></Stack> */}
                </Stack>
            </Stack>
        );
    }

    private onEndVideo = () => {
        if (this.onEndFunc) {
            this.onEndFunc();
        }

        this.setState({ isPlaying: false });
    }

    private onLoadVideo = async () => {
        if (!this.loadFaceDetectTask) return;
        await this.loadFaceDetectTask;

        this.getPoints(true);
        setTimeout(() => {
            this.setState({ videoMedia: (this.video as any).captureStream() });
            this.video!.play();
        }, waitSec * 1000);
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

    private refreshText() {
        this.sec++;

        if (this.sec === waitSec) {
            this.setState({ text: '' });
        } else {
            this.setState({ text: `This video will start in ${waitSec - this.sec} sec.` });
            setTimeout(() => {
                this.refreshText();
            }, 1000);
        }
    }

    private onReplay = () => {
        this.setState({ src: undefined });
        // this.audioAnaId = getId('audioAna');

        setTimeout(() => {
            this.setState({ src: this.props.src, isPlaying: true, videoMedia: undefined });

            this.sec = -1;
            this.refreshText();
        }, 1000);
    }
}