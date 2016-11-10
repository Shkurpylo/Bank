import React, {Component} from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({user: state.auth.user})
)
export default class Chat extends Component {

  render() {
    const style = require('./Cards.scss');

    return (
      <div className={style.widgets + ' container'}>
        <h1 className={style}>My Cards</h1>
        <div className="row">
          <div className="col-md-4">
            <table className="table table-hover">
              <thead>
              <tr>
                <th className={style.idCol}>#</th>
                <th className={style.colorCol}>Type</th>
                <th className={style.sprocketsCol}>Number</th>
                <th className={style.ownerCol}>Bal</th>
                <th className={style.buttonCol}>Button</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td className={style.idCol}>#</td>
                <td className={style.colorCol}>type</td>
                <td className={style.sprocketsCol}>number</td>
                <td className={style.ownerCol}>balance</td>
                <td className={style.buttonCol}>
                  <button className="btn btn-primary btn-sm">
                    <i className="fa fa-credit-card"/>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-8 pull-right">
            <button className="btn btn-primary">
              <i className="fa fa-plus"/> Add new card
            </button>

          </div>
        </div>
      </div>
    );
  }
}
