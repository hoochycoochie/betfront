import React from 'react';
 
import { WebSocketProvider, socket } from './contexts/WebSocketContext';
import { Betting } from './components/Betting';

function App() {
  return (

    <WebSocketProvider value={socket}>
      <Betting />
    </WebSocketProvider>
  );
}

export default App;
