import { useEffect } from 'preact/hooks'
import './app.css'
import { initThreejsApp, regenerateSword, setFlipAnimation, setSpinAnimation, stopAnimation } from './threejs-app';

export function App() {

  useEffect(() => {
    initThreejsApp('generator-canvas');
  }, []);

  const getSword = () => {
    regenerateSword();
  }

  const spin = () => {
    setSpinAnimation();
  }

  const flip = () => {
    setFlipAnimation();
  }

  const stop = () => {
    stopAnimation();
  }

  return (
    <>
      <div id='title-container'>
        <h1>Sword Generator</h1>
        <button onClick={getSword}>Get new</button>
        <button onClick={spin}>Spin</button>
        <button onClick={flip}>Flip</button>
        <button onClick={stop}>Stop</button>
      </div>

      <canvas id='generator-canvas'></canvas>
    </>
  )
}
