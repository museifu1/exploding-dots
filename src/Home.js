
import style from './Home.css';
import React, { Component } from 'react';

class Home extends Component {

  constructor(props){
    super(props); 

    this.bg = props.bg;
  }

  render() {
    return (
      <div className={style.home}>
        <div className={style.bg} style={{backgroundImage: 'url(' + this.bg + ')'}}></div>
        <div className={style.landing}>
          <h1><span className="boum"><strong>Bo</strong>um<em>&thinsp;<i className="fa fa-exclamation-circle"></i></em></span></h1>
          <h2>Le Jeu Mathématique</h2>
          <div className={style.intro}>
            <p><span className="boum"><strong>Bo</strong>um<em>&thinsp;<i className="fa fa-exclamation-circle"></i></em></span> est une version numérique du jeu mathématique <em>"Exploding Dots"</em> popularisé par James Tanton. Cet outil pédagogique est développé par <strong>Scolab</strong> et distribué gratuitement dans le contexte du <em><a href="https://www.theglobalmathproject.org">Global Math Week 2017</a></em>.</p>
          </div>

          <div className={style.subscribe}>
            <p>Pour rester informé à propos du lancement à venir de cet outil, veuillez vous inscrire ci-bas.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;


