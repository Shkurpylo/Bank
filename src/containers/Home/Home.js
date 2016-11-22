import React, { Component, PropTypes } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { SignUpForm, LoginForm, WelcomeButtons } from 'components';

@connect(
  (state) => ({
    ...state.welcomeButtons,
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
    const {
      showLoginForm,
      showSignUpForm,
      user
    } = this.props;
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          {!user &&
            <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>

            <div>
              <WelcomeButtons />
              {showLoginForm && <div>
                < LoginForm />
              </div>}
              {showSignUpForm && <div>
                < SignUpForm />
              </div>}
              </div>
            </div> }
            {user &&
            <div className="container">
            <h1>Welcome, {user.name} !</h1>

            <div>
              <h2> Some nice animation will be here soon</h2>
            </div>
            <div>
              <h3> Did you seen this site? </h3>
              <h3> It is amazing! </h3>
            </div>
          </div>}

        </div>
      </div>
    );
  }
}
