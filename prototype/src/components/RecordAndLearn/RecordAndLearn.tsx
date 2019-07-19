import React from 'react';

import { Stack, Text } from 'office-ui-fabric-react';
import { MouthShapeRecorder } from '../MouthShapeRecorder';
import { IRecordAndLearnState } from './IRecordAndLearn.states';
import videoService from '../../services/videoService';
import { MouthShapePlayer } from '../MouthShapePlayer';

export class RecordAndLearn extends React.Component<{}, IRecordAndLearnState> {
    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                <Stack grow={1}>
                    <MouthShapeRecorder onSaveRecording={this.saveRecord} />
                </Stack>
                <Stack grow={1} horizontalAlign="center" verticalAlign="center">
                    {this.state.savedRecordUrl ?
                        <MouthShapePlayer src={this.state.savedRecordUrl} /> :
                        <Text>Please record in left</Text>
                    }
                </Stack>
            </Stack>
        );
    }

    private saveRecord = (record: Blob) => {
        const res = videoService.save(record);
        this.setState({ savedRecordUrl: res.url });
    }
}