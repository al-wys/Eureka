import React from 'react';

import { getId, Stack, Text, Separator } from 'office-ui-fabric-react';
import { MouthShapeRecorder } from '../MouthShapeRecorder';
import { MouthShapePlayer } from '../MouthShapePlayer';
import { ITeacherPanelState } from './ITeacherPanel.states';
import { ITeacherPanelProps } from './ITeacherPanel.types';

import videoService from '../../services/videoService';

export class TeacherPanel extends React.Component<ITeacherPanelProps, ITeacherPanelState> {
    private playerId: string = getId('player');
    private recorderId: string = getId('recorder');

    constructor(props: ITeacherPanelProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <Stack>
                <Stack horizontalAlign="start">
                    <Text variant="large">Teacher Panel</Text>
                    <Stack horizontalAlign="stretch">
                        <Separator style={{ width: '100%' }} />
                    </Stack>
                </Stack>
                <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
                    {this.state.videoReady ? <></> :
                        <Stack grow={1}>
                            <MouthShapeRecorder onPreviewRecording={this.previewRecord} key={this.recorderId} onSaveRecording={this.saveRecord} />
                        </Stack>
                    }
                    <Stack grow={1} horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 5 }}>
                        {this.state.savedRecordUrl ? (
                            <>
                                <Stack.Item grow={1}>
                                    <MouthShapePlayer src={this.state.savedRecordUrl} key={this.playerId} />
                                </Stack.Item>
                                {/* <Stack.Item grow={1}>
                                    <DefaultButton text="Close player" onClick={this.closePlayer} />
                                </Stack.Item> */}
                            </>
                        ) :
                            <Text>Please record in left</Text>
                        }

                    </Stack>
                </Stack>
            </Stack>
        );
    }

    private previewRecord = (record: Blob) => {
        const res = videoService.preview(record);
        this.setState({ savedRecordUrl: res.url });
    }

    private saveRecord = (record: Blob) => {
        const res = videoService.preview(record);
        this.setState({ savedRecordUrl: res.url, videoReady: true });
        this.props.onSaveVideo();
    }
}