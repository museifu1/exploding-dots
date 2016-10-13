import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import './index.css';
import './font-awesome.min.css';
import logo from './scolab.png';

ReactDOM.render(
  <App logo={logo} />,
  document.getElementById('boum')
);
ReactDOM.render(
  <Home />,
  document.getElementById('landing')
);
