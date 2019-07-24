import React from 'react';

import { IAudioAnalyserProps } from './IAudioAnalyser.types';
import { IAudioAnalyserState } from './IAudioAnalyser.states';
import { AudioVisualiser } from '../AudioVisualiser';

import { getId } from 'office-ui-fabric-react';

export class AudioAnalyser extends React.Component<IAudioAnalyserProps, IAudioAnalyserState> {
    private audioContext?: AudioContext;
    private analyser?: AnalyserNode;
    private dataArray?: Uint8Array;
    private source?: MediaStreamAudioSourceNode;
    private rafId: number = -1;

    private audioVisId: string = getId('audioVisId');

    constructor(props: IAudioAnalyserProps) {
        super(props);

        this.state = {
            audioData: new Uint8Array()
        };
    }

    public componentDidMount() {
        const w = window as any;
        this.audioContext = new (w.AudioContext || w.webkitAudioContext)();
        this.analyser = this.audioContext!.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = this.audioContext!.createMediaStreamSource(this.props.audio);
        this.source.connect(this.analyser);
        this.rafId = requestAnimationFrame(this.tick);
    }

    public componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser!.disconnect();
        this.source!.disconnect();
    }

    public render() {
        return <AudioVisualiser audioData={this.state.audioData} key={this.audioVisId} />;
    }

    private tick = () => {
        this.analyser!.getByteTimeDomainData(this.dataArray!);
        this.setState({ audioData: this.dataArray! });
        this.rafId = requestAnimationFrame(this.tick);
    }
}