import React, { Component, PropTypes } from 'react'
import { toJS, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import { checkUser } from '../actions/user/user'

class Home extends Component {
  componentWillMount() {
    this.props.actions.checkUser()
  }

  componentWillUpdate(nextProps, nextSate) {
  }
  
  render() {
    return (
      <div id="container">
        <div style={{margin:"auto"}}><h1>This is the home page</h1></div>
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
    actions: bindActionCreators({checkUser}, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
