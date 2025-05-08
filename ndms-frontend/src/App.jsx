import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EarthquakeList from './components/EarthquakeList';

function App() {
  return (
    <div className="App">
      <EarthquakeList />
    </div>
  );
}

export default App
