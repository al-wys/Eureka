import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import { TeacherPanel } from './components';
import { StudentPanel } from './components/StudentPanel';

export interface AppState {
  stage: 'teacher' | 'student';
}

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      stage: 'teacher'
    };
  }

  public render() {
    return (
      <Stack
        horizontal
        horizontalAlign="stretch"
        verticalAlign="stretch"
        verticalFill
        styles={{
          root: {
            width: '1100px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#605e5c'
          }
        }}
        tokens={{ childrenGap: 15 }}
      >
        <Stack grow={1}>
          <TeacherPanel onSaveVideo={this.onTecherSave} />
        </Stack>
        {this.state.stage === 'student' ?
          <Stack grow={1}>
            <StudentPanel />
          </Stack> :
          <></>
        }
      </Stack>
    );
  }

  private onTecherSave = () => {
    this.setState({ stage: 'student' });
  }
}
