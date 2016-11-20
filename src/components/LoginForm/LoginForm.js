import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class LoginForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const input = this.refs.username;
    this.props.login(input.value);
    input.value = '';
  };

  render() {
  //  const {user, logout} = this.props;
    const styles = require('./LoginForm.scss');
    return (
      <div className={styles.loginPage + 'container'}>
        <Helmet title="Login"/>
        <h3>Login</h3>

        <div className="col-sm-4 col-md-offset-4">
          <form className="login-form form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <div>
                <input type="text" ref="username" placeholder="Login" className="form-control"/>
              </div>
            </div>
            <div className="form-group">
              <div>
                <input type="text" ref="pass" placeholder="Password" className="form-control"/>
              </div>
            </div>
            <button className="btn btn-success" onClick={this.handleSubmit}><i className="fa fa-sign-in" />{' '}Login
            </button>
          </form>
          <p>Log in, if you already registered.</p>
        </div>
      </div>
    );
  }
}
