import React, {Component} from 'react';

export default class Profile extends Component {

  render() {
    return (
      <div className="container">
        <h1>Profile</h1>

       <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">Large modal</button>

<div className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
  <div className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      ...
    </div>
  </div>
</div>


          </div>
    );
  }
}
