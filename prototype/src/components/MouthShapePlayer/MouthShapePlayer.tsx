import React from 'react';

import { IMouthShapePlayerProps } from './IMouthShapePlayer.types';

export class MouthShapePlayer extends React.Component<IMouthShapePlayerProps> {
    render() {
        return (
            <video autoPlay={false} controls={true} height={this.props.height} width={this.props.width} className={this.props.className}>
                <source src={this.props.src} type={this.props.type} />
            </video>
        );
    }
}