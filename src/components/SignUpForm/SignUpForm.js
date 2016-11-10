import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import surveyValidation from './surveyValidation';
import * as signUpActions from 'redux/modules/signUp';

function asyncValidate(data, dispatch, {isValidEmail}) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect(() => ({}),
  dispatch => bindActionCreators(signUpActions, dispatch)
)


@reduxForm({
  form: 'signUp',
  fields: ['name', 'lastName', 'email', 'pass', 'confirmPass'],
  validate: surveyValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SignUpForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
  };

  handleSubmit = (data) => {
    window.alert('Data submitted! ' + JSON.stringify(data));
  };

  render() {
    const {
      asyncValidating,
     // dirty,
      fields: {name, lastName, email, pass, confirmPass},
     // active,
     handleSubmit,
     // invalid,
      resetForm,
     // pristine,
     // valid
    } = this.props;
    const styles = require('./SignUpForm.scss');
    const renderInput = (field, label, showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type="text" className="form-control" id={field.name} {...field}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          {renderInput(name, 'Name')}
          {renderInput(lastName, 'Last Name')}
          {renderInput(email, 'Email', true)}
          {renderInput(pass, 'Password')}
          {renderInput(confirmPass, 'Confirm Password')}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success" onClick={handleSubmit}>
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
