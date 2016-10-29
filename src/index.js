import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Home from './components/Home';
import './css/index.css';
import './css/font-awesome.min.css';
import logo from './images/scolab.png';
import bg from './images/Netmaths_photo_classe_05_low.jpg';
import boum from './images/boum-logo.png';

ReactDOM.render(
  <App logo={logo} boum={boum} />,
  document.getElementById('boum')
);
ReactDOM.render(
  <Home bg={bg} logo={logo} boum={boum} />,
  document.getElementById('landing')
);
