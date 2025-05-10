import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/caution.jpg'
import './App.css'
//import EarthquakeList from './components/EarthquakeList';
import DisasterList from './components/DisasterList';

function App() {
  return (
    <div className="App">
      <DisasterList />
    </div>
  );
}

export default App
