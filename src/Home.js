
import './Home.css';
import React, { Component } from 'react';

class Home extends Component {

  // constructor(options){
  //   super(options); 

  //   this.logo = options.logo;
  // }

  render() {
    return (
      <div>
        <h1>Boum<i class="fa fa-exclamation-circle"></i> C'est mathématique!</h1>
        <h2>Exploration d'<em>Exploding Dots</em> par James Tanton</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a blandit nulla. Cras eu dui ultrices, commodo dui et, fermentum justo. Suspendisse quis eleifend risus, nec bibendum nulla. Nunc tincidunt ipsum vel diam ultricies, ut lacinia dolor tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus ut magna ac ornare. Pellentesque ut facilisis nunc. Suspendisse gravida massa at ex tincidunt vestibulum.</p>
      </div>
    );
  }
}

export default Home;


