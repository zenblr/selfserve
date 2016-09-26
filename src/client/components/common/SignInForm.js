import React, { Component, PropTypes } from 'react'
import {reduxForm} from 'redux-form'
import ReactDOM from 'react-dom'
var Modal = require('react-modal')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import LoginForm from './LoginForm'
import { initUser } from '../../actions/user/user'

class SignInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isOpen: true
    }
  }

  openModal() {
    this.setState({...this.state, isOpen: true});
  }

  closeModal() {
    this.setState({...this.state, isOpen: false});
  }

  componentWillUpdate(nextProps, nextState) {
  }

  render() {

    return (
        <div>
          <Modal
              isOpen={this.state.isOpen}
              onRequestClose={this.closeModal}
              style={{content:{top:"100px",left:"100px",right:"100px", bottom:"50px"}}}>
              <LoginForm {...this.props} close = {this.closeModal.bind(this)}/>
          </Modal>
        </div>
    )
  }
}

function mapStateToProps(state,ownProps) {
    return {
        path:ownProps.location? ownProps.location.pathname : null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({initUser}, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInForm)

