import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <>
    {/* Overlay */}
    <div className="overlay-right-container">
      <div className="overlay-right">
          <img src="pxl.png" alt="" />
      </div>
    </div>
    <App />
  </>
)
