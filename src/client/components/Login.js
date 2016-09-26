import React, { Component } from 'react'
import {connect} from 'react-redux'
import SignInForm from './../components/common/SignInForm'
import { handleLoginForm } from '../actions/user/user'

class Login extends Component {

  render() {
    const { handleLoginForm } = this.props

    return(
      <div className="wrapper">
        <header id="header">
            <div className="container">
                <div className="logo"><a href="#"><img src="images/logo_img.png" height={50} width={86} alt /></a></div>
            </div>
        </header>
        <div className="main_content">
          <div className="container">
            <div className="section">
              <SignInForm handleLoginForm={ handleLoginForm } errorz={this.props.location.query.message}/>
            </div>
          </div>
        </div>
        <footer id="footer" />
      </div>
    )
  }
}

export default connect(
  null,
  { handleLoginForm }
) (Login)

