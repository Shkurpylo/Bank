import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import signupValidation from './signupValidation';
import * as signUpActions from 'redux/modules/auth';


function asyncValidate(data, dispatch, {isValidEmail}) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect(() => ({}),
  () => dispatch => bindActionCreators(signUpActions, dispatch)
)

@reduxForm({
  form: 'signUp',
  fields: ['name', 'lastName', 'email', 'pass', 'confirmPass'],
  validate: signupValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SignUpForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    values: PropTypes.object,
    createNewUser: PropTypes.func
  };

  render() {
    const {
      asyncValidating,
      fields: {name, lastName, email, pass, confirmPass},
      resetForm,
      values,
      handleSubmit,
      createNewUser,
    } = this.props;

    const styles = require('./SignUpForm.scss');
    const renderInput = (field, label, showAsyncValidating, hide) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <div>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type={hide ? 'password' : 'text'} className="form-control" placeholder={label} id={field.name} {...field}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div className="col-sm-4 col-md-offset-4">
      <Helmet title="signUp"/>
        <h3>Sign Up</h3>
        <form className="form-group">
          {renderInput(name, 'Name')}
          {renderInput(lastName, 'Last Name')}
          {renderInput(email, 'Email', true)}
          {renderInput(pass, 'Password', false, true)}
          {renderInput(confirmPass, 'Confirm Password', false, true)}
          <div className="form-group">
            <div className="col-sm-offset-1 col-sm-10">
              <button className="btn btn-success" onClick={handleSubmit(() => (createNewUser(values)))}>
                <i className="fa fa-paper-plane"/> Submit
              </button>
              <button className="btn btn-warning" onClick={resetForm} style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
