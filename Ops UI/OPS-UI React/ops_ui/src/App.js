import React from 'react';
import './App.css';
import {BrowserRouter}  from 'react-router-dom'
import Navigation from './Navigation'

function App() {
  return (
    <BrowserRouter>
      <div><h1>Welcome to Ops-UI</h1></div>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
