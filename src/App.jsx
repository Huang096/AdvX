
import { Outlet } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <div>
      {/* This will render the matched route component */}
      <Outlet />
    </div>
  )
}

export default App
