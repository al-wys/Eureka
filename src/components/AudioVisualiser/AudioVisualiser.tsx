import React from 'react';

import { IAudioVisualiserProps } from './IAudioVisualiser.types';

export class AudioVisualiser extends React.Component<IAudioVisualiserProps>{
    private canvas: HTMLCanvasElement | null = null;

    public componentDidUpdate() {
        this.draw();
    }

    public render() {
        return <canvas ref={(ins) => this.canvas = ins} />;
    }

    private draw() {
        const { audioData } = this.props;
        const canvas = this.canvas!;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d')!;
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;

        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.moveTo(0, height / 2);
        audioData.forEach((item) => {
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
        });
        context.lineTo(x, height / 2);
        context.stroke();
    }
}