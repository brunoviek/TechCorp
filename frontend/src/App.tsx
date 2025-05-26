import React from 'react';
import { Grommet } from 'grommet';
import { theme } from './theme';
import Users from './pages/Users';

function App() {
  return (
    <Grommet theme={theme} full>
      <Users />
    </Grommet>
  );
}

export default App;
