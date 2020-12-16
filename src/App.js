import './App.css';
import Annotator from './components/Annotator';
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App(props) {
  return (
    <Router>
      <Route path="/annotate/:job/:asset" component={Annotator} />
    </Router>
  );
}

export default App;