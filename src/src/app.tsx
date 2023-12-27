import { useEffect } from 'preact/hooks'
import { initThreejsApp } from './threejs-app';
import { useColyeusClient } from './hooks/connector';
import './app.css'
import { Chat } from './components/chat';

export function App() {

  const client = useColyeusClient('ws://localhost:5000');

  useEffect(() => {
    initThreejsApp('game-canvas', client);
  }, []);

  return (
    <>
      <div className="h-full w-100 relative">
        <canvas id='game-canvas'></canvas>
        <Chat />
      </div>
    </>
  )
}
