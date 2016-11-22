import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/home');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              {user && <LinkContainer to="/cards">
                <NavItem eventKey={1}>Cards</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/transactions">
                <NavItem eventKey={2}>Transaction</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/history">
                <NavItem eventKey={3}>History</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/profile">
                <NavItem eventKey={4}>Profile</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/about">
                <NavItem eventKey={5}>About Us</NavItem>
              </LinkContainer>}

            </Nav>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}><i>Hi! <strong>{user.name}</strong></i>.</p>}
            {user && <Nav navbar pullRight>
              <NavItem eventKey={1} className="logout-link" onClick={this.handleLogout}>
                Log Out
              </NavItem>
            </Nav>}
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

      </div>
    );
  }
}
