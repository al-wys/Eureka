import React from 'react';

import { getId, Stack, DefaultButton, Separator, Text } from 'office-ui-fabric-react';

import { IStudentPanelState } from './IStudentPanel.states';
import { MouthShapeRecorder } from '../MouthShapeRecorder';
import { MouthShapePlayer } from '../MouthShapePlayer';
import videoService from '../../services/videoService';

export class StudentPanel extends React.Component<{}, IStudentPanelState>{
    private playerId: string = getId('player');
    private recorderId: string = getId('recorder');

    constructor(props: {}) {
        super(props);

        this.state = {
            stage: 'record'
        };
    }

    public render() {
        return (
            <Stack>
                <Stack horizontalAlign="start">
                    <Text variant="large">Student Panel</Text>
                    <Stack horizontalAlign="stretch">
                        <Separator style={{ width: '100%' }} />
                    </Stack>
                </Stack>
                <Stack>
                    {this.state.stage === 'record' ?
                        <MouthShapeRecorder key={this.recorderId} onPreviewRecording={this.previewRecord} /> :
                        <>
                            <MouthShapePlayer key={this.playerId} src={this.state.savedRecordUrl!} />
                            <DefaultButton text="Try again" onClick={this.onTryAgain} />
                        </>
                    }
                </Stack>
            </Stack>
        )
    }

    private previewRecord = (record: Blob) => {
        const res = videoService.preview(record);
        this.setState({ savedRecordUrl: res.url, stage: 'play' });
    }

    private onTryAgain = () => {
        this.setState({ stage: 'record' });
    }
}