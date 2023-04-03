import { useEffect } from 'preact/hooks'
import './app.css'
import { initThreejsApp, regenerateSword, setFlipAnimation, setSpinAnimation, stopAnimation } from './threejs-app';

export function App() {

  useEffect(() => {
    initThreejsApp('game-canvas');
  }, []);

  return (
    <>
      <canvas id='game-canvas'></canvas>
    </>
  )
}
