import React from 'react';

import { Stack, Text, DefaultButton } from 'office-ui-fabric-react';
import { MouthShapeRecorder } from '../MouthShapeRecorder';
import { IRecordAndLearnState } from './IRecordAndLearn.states';
import videoService from '../../services/videoService';
import { MouthShapePlayer } from '../MouthShapePlayer';

import { getId } from 'office-ui-fabric-react';

export class RecordAndLearn extends React.Component<{}, IRecordAndLearnState> {
    private playerId: string = getId('player');
    private recorderId: string = getId('recorder');

    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <Stack grow={1}>
                    <MouthShapeRecorder onPreviewRecording={this.previewRecord} key={this.recorderId} />
                </Stack>
                <Stack grow={1} horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 5 }}>
                    {this.state.savedRecordUrl ? (
                        <>
                            <Stack.Item grow={1}>
                                <MouthShapePlayer src={this.state.savedRecordUrl} key={this.playerId} />
                            </Stack.Item>
                            <Stack.Item grow={1}>
                                <DefaultButton text="Close player" onClick={this.closePlayer} />
                            </Stack.Item>
                        </>
                    ) :
                        <Text>Please record in left</Text>
                    }

                </Stack>
            </Stack>
        );
    }

    private previewRecord = (record: Blob) => {
        const res = videoService.preview(record);
        this.setState({ savedRecordUrl: res.url });
    }

    private closePlayer = () => {
        this.setState({ savedRecordUrl: undefined });
    }
}