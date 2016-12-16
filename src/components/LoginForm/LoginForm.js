import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({
    user: state.auth.user,
    loginFail: state.auth.loginFail
  }),
  authActions)
export default class LoginForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    loginFail: PropTypes.bool
  };

  handleSubmit = (event) => {
    const login = this.refs.login;
    const password = this.refs.password;
    if (login.value && password.value) {
      event.preventDefault();
      this.props.login({ login: login.value, password: password.value });
      login.value = '';
      password.value = '';
    } else {
      this.refs.errorMsg.value = 'Smth wrong. try again';
    }
  };


  render() {
    const {loginFail} = this.props;
    const styles = require('./LoginForm.scss');
    return (
      <div className={styles.loginPage + 'container'}>
        <Helmet title="Login"/>
        <h3>Login</h3>

        <div className="col-sm-4 col-md-offset-4">
          <form className="login-form form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <div>
                <input type="text" ref="login" placeholder="Email" className="form-control" required/>
              </div>
            </div>
            <div className="form-group">
              <div>
                <input type="password" ref="password" placeholder="Password" className="form-control" required/>
              </div>
              <label className="help-block" ref="errorMsg"></label>
            </div>
            <button className="btn btn-success" onClick={this.handleSubmit}><i className="fa fa-sign-in" />{' '}Login
            </button>
          </form>
          {loginFail && <p style={{color: 'red'}}>Wrong email or password!</p> }
          <p>Log in, if you already registered.</p>
        </div>
      </div>
    );
  }
}
