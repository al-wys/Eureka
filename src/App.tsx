import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import { RecordAndLearn } from './components';

export const App: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
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
      <RecordAndLearn />
    </Stack>
  );
};
