
import style from './Home.css';
import React, { Component } from 'react';

function mailchimp_form() { return {__html: `<!-- Begin MailChimp Signup Form -->
    <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css">
    <style type="text/css">
      #mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
      /* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
         We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
    </style>
    <div id="mc_embed_signup">
    <form action="//scolab.us1.list-manage.com/subscribe/post?u=2ee384b2ff8dde377edc61ead&amp;id=c35356d940" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
        <div id="mc_embed_signup_scroll">
      
    <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
    <div class="mc-field-group">
      <label for="mce-EMAIL">Email Address  <span class="asterisk">*</span>
    </label>
      <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
    </div>
      <div id="mce-responses" class="clear">
        <div class="response" id="mce-error-response" style="display:none"></div>
        <div class="response" id="mce-success-response" style="display:none"></div>
      </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_2ee384b2ff8dde377edc61ead_c35356d940" tabindex="-1" value=""></div>
        <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
        </div>
    </form>
    </div>
    <script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
    <!--End mc_embed_signup-->`}; };

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

          <div className={style.half}>
            <div className={style.invite}>
              <p>Entre temps, nous vous invitons à jouer avec une première version de notre prototype.</p>
              <button className={style.CTA}><i className="fa fa-chevron-down"></i></button>
            </div>
            <div className={style.subscribe}>
              <p>Pour rester informé à propos du lancement à venir de cet outil, veuillez vous inscrire ci-bas.</p>
              <div dangerouslySetInnerHTML={mailchimp_form()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;


