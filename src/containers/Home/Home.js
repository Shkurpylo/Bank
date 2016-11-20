import React, { Component, PropTypes } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import { SignUpForm } from 'components';
import { LoginForm } from 'components';
import { WelcomeButtons } from 'components';
// import { createNewUser } from 'redux/modules/signUp';

@connect(
  (state) => ({
    ... state.welcomeButtons,
    user: state.auth.user
  }),
)
export default class Home extends Component {
  static propTypes = {
    showLoginForm: PropTypes.bool,
    showSignUpForm: PropTypes.bool,
    createNewUser: PropTypes.func,
    user: PropTypes.object
  };

  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    const {showLoginForm,
           showSignUpForm,
           user
           } = this.props;
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>

            {!user && <div>
              <WelcomeButtons />
              {showLoginForm && <div>
                < LoginForm />
              </div>}
              {showSignUpForm && <div>
                < SignUpForm />
              </div>}
            </div> }

          </div>
        </div>
      </div>
    );
  }
}
