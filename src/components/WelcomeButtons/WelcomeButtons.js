import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {showForm} from 'redux/modules/welcomeButtons';

@connect(
  (state) => ({... state.welcomeButtons}),
  {showForm}
)
export default class WelcomeButtons extends Component {
  static propTypes = {
    showLoginForm: PropTypes.bool,
    showSignUpForm: PropTypes.bool,
    showForm: PropTypes.func
  };

  render() {
    const styles = require('./WelcomeButtons.scss');
    const {showLoginForm, showSignUpForm, showForm} = this.props; // eslint-disable-line no-shadow

    return (
      <div className={styles.buttons}>
        <button className= {showLoginForm ? 'btn btn-success active' : 'btn btn-success'}
                onClick={ () => showForm(!showLoginForm, false) }>Log In </button>
        <button className= {showSignUpForm ? 'btn btn-success active' : 'btn btn-success'}
                onClick={() => showForm( false, !showSignUpForm)} >Sign Up </button>
      </div>
    );
  }
}
