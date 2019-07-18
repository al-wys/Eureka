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
        <Stack.Item grow={1}>
          <MouthShapeRecorder />
        </Stack.Item>
        <Stack.Item grow={1}>
          <Text>Please record in left</Text>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
