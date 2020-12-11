import './App.css';
import Annotator from './components/Annotator';
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
function App(props) {
  

  return (
    <Router>
      <Annotator />
    </Router>

  );
}

export default App;



