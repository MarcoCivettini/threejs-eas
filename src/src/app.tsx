import { useEffect } from 'preact/hooks'
import { initThreejsApp } from './threejs-app';
import { useColyeusClient } from './hooks/connector';
import './app.css'

export function App() {

  const client = useColyeusClient('ws://localhost:5000');

  useEffect(() => {
    initThreejsApp('game-canvas', client);
  }, []);

  return (
    <>
      <canvas id='game-canvas'></canvas>
    </>
  )
}
