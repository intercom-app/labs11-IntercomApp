//DeleteModal expects to have the following variables passed to props:
// handleTarget(target) : function, performs desired operation on target
// targetName : string, name used to confirm target before performing handleTarget
// type: text displayed on button
// deleteMessage: Message displayed on modal


import React, { Component } from "react";
import './Modal.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmTarget: ""
    };
  }

  handleGroupInput = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
}

  render() {
    return (
      <div>
          {/* {console.log(this.props)} */}
        <button
          type="button"
          className="btn btn-delete"
          data-toggle="modal"
          data-target="#deleteModal"
        >
          {`${this.props.type}`}
        </button>

        <div
          className="modal fade"
          id="deleteModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="deleteModalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header no-border">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h5 className="modal-title" id="deleteModalLongTitle">
                  {`${this.props.deleteMessage}`} 
                </h5>
              </div>
              <div className="modal-body no-border">
                <input type="text" name="confirmTarget" placeholder={`${this.props.targetName}`} onChange={this.handleGroupInput} value={this.state.confirmTarget} />
              </div>
              <div className="modal-footer no-border">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                {this.state.confirmTarget === this.props.targetName ? <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() => this.props.handleTarget(this.props.target)}
                >
                  Confirm
                </button> : <button
                  type="button"
                  className="btn btn-danger"
                  disabled
                  >
                  Confirm
                </button> }
               </div> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteModal;
