import React from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { MouthShapeRecorder } from './components';

export const App: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      styles={{
        root: {
          width: '960px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c'
        }
      }}
      tokens={{ childrenGap: 15 }}
    >
      <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <Stack grow={1}>
          <MouthShapeRecorder />
        </Stack>
        <Stack grow={1} horizontalAlign="center" verticalAlign="center">
          <Text>Please record in left</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
