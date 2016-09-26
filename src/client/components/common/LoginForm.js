import React, { Component, PropTypes } from 'react'
import {reduxForm} from 'redux-form'
import ReactDOM from 'react-dom'
export const fields = ['username', 'password', 'domain', 'client', 'secret']

const USER_TYPE_NEW = 'new'
const USER_TYPE_EXISTING = 'existing'
const TENANT_ACTION_CREATE = "create"
const TENANT_ACTION_JOIN = "join"

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userType: "existing",
      step: 1,
      tenantAction: "create"
    }
  }
  login(e) {
    e.preventDefault()
    const { handleLoginForm } = this.props
    handleLoginForm(this.refs.username.value,
      this.refs.password.value, this.refs.domain.value,
      this.refs.client ? this.refs.client.value:'',
      this.refs.secret ? this.refs.secret.value:'',
      this.forceUpdate.bind(this))

    ReactDOM.findDOMNode(this.refs.formz).className = 'noshake'
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.errorz) ReactDOM.findDOMNode(this.refs.formz).className = 'shake'
  }

  setUserType(e) {
    //e.preventDefault()
    this.setState({...this.state, userType:e.target.value})
  }

  setTenantAction(e) {
    //e.preventDefault()
    this.setState({...this.state, tenantAction:e.target.value})
  }

  goToStep2(e) {
    e.preventDefault()

    if ((this.state.userType == USER_TYPE_EXISTING) &&
        this.state.userName && this.state.password ) {
        this.props.close()
        this.props.actions.initUser()
    }
    else if (((this.state.userType == USER_TYPE_NEW) &&
        this.state.userName && this.state.password && this.state.fullName && this.state.email)) {
        this.setState({...this.state, errorMsg:null, step:2})
    }
    else {
        this.setState({...this.state, errorMsg:"missing information. please fill in all fields"})
    }
  }

  goToStep3(e) {
    //validate step2 inputs
    //then
    e.preventDefault()
    this.props.close()
  }

  goToStep1(e) {
    //validate step2 inputs
    //then
    e.preventDefault()
    this.setState({...this.state, step:1})
  }

  setUsername(e) {
      this.setState({...this.state, userName:e.target.value})
  }

  setPassword(e) {
      this.setState({...this.state, password:e.target.value})
  }

  setFullName(e) {
      this.setState({...this.state, fullName:e.target.value})
  }

  setEmail(e) {
      this.setState({...this.state, email:e.target.value})
  }

  render() {

    return (
      <div className="section_form">

        <form>
          {(this.state.errorMsg) &&
          <div className="popup-message">
            <span className="message"> {this.state.errorMsg} </span>
          </div>
          }
          { (this.state.step == 1) &&
            <div className="popup">
              <h2 className="text-left">Please sign in</h2>
            <div>
              <input type="text" placeholder="Username" className="username" onChange={this.setUsername.bind(this)}/>
              <input type="password" placeholder="Password" className="password" onChange={this.setPassword.bind(this)}/>
              <div className="radio-button-div">
                  <span className="radio">
                  <input id="existing_user" type="radio" name="user" value={USER_TYPE_EXISTING}
                         onChange={this.setUserType.bind(this)} checked={this.state.userType==USER_TYPE_EXISTING}/>
                  </span>
                  <span className="radio-text">
                  <label htmlFor="existing_user">I have an account</label>
                  </span>
              </div>
              <div className="radio-button-div">
                  <span className="radio">
                  <input id="new_user" type="radio" name="user" value={USER_TYPE_NEW}
                         onChange={this.setUserType.bind(this)} checked={this.state.userType==USER_TYPE_NEW}/>
                  </span>
                  <span className="radio-text">
                  <label htmlFor="new_user">I am new here</label>
                  </span>
              </div>
            </div>
            { (this.state.userType == USER_TYPE_NEW) &&
              <div style={{marginTop:"10px"}}>
              <input type="text" placeholder="Full Name" className="username" onChange={this.setFullName.bind(this)}/>
              <input type="text" placeholder="Email Address" className="password" onChange={this.setEmail.bind(this)}/>
              </div>
            }
              <button className="popup-button" onClick={this.goToStep2.bind(this)}>Next</button>
          </div>}
          { (this.state.step == 2) &&
          <div className="popup">
            <h2 className="text-left">Please provide additional information</h2>
            <div style={{margin:"10px"}}>
              To take advantage of Timeli's secure API, you will need to be a member of a tenant. Which
              of the following things do you wish to do?
            </div>
            <div className="radio-button-div">
                  <span className="radio">
                  <input id="create_tenant" type="radio" name="tenant" value={TENANT_ACTION_CREATE}
                         onChange={this.setTenantAction.bind(this)} checked={this.state.tenantAction==TENANT_ACTION_CREATE}/>
                  </span>
                  <span className="radio-text">
                  <label htmlFor="create_tenant">Create a tenant</label>
                  </span>
            </div>
            { (this.state.tenantAction == TENANT_ACTION_CREATE) &&
            <div>
              <input type="text" placeholder="Company Name" className="username" />
              <input type="text" placeholder="Pick a subdomain of timeli (me.timeli.io)" className="password" />
              <input type="text" placeholder="From what URL do you plan to reach your tenant? (optional)" className="password" />
            </div>
            }
            <div className="radio-button-div">
                  <span className="radio">
                  <input id="join_tenant" type="radio" name="tenant" value="join"
                         onChange={this.setTenantAction.bind(this)} checked={this.state.tenantAction==TENANT_ACTION_JOIN}/>
                  </span>
                  <span className="radio-text">
                  <label htmlFor="new_user">Join an existing tenant</label>
                  </span>
            </div>
            { (this.state.tenantAction == TENANT_ACTION_JOIN) &&
            <div>
              <input type="text" placeholder="Domain of tenant being requested" className="username" />
            </div>
            }

          <button className="popup-button-multi" onClick={this.goToStep1.bind(this)}>Back</button>
          <button className="popup-button-multi" onClick={this.goToStep3.bind(this)}>Next</button>
          </div>
          }

        </form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  errorz: PropTypes.string
}

export default reduxForm({
  form: 'simple',
  fields
})(LoginForm)

