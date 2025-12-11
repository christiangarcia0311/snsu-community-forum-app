import React from 'react' 
import { Route, Redirect } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'


import Tabs from '../layout/Tabs'

import AuthSignIn from '../components/auth/AuthSignIn'
import AuthSignUp from '../components/auth/AuthSignUp'
import Verification from '../components/auth/verification/Verification'

const AppRoute = () => {
  return (
    <>

      {/* Default */}
      {/*<Redirect exact from='/' to='/welcome' /> */}


      {/* Welcome */}
      <PublicRoute path='/' component={AuthSignIn} exact={true} />

      {/* Auth */}
      <PublicRoute path='/auth/signin' component={AuthSignIn} exact={true} />
      <PublicRoute path='/auth/signup' component={AuthSignUp} exact={true} />
      <PublicRoute path='/auth/verify' component={Verification} exact={true} />

      {/* Tabs */}
      <ProtectedRoute path='/tabs' component={Tabs} />

      {/* Redirect /tabs to /tabs/home as default */}
      <Route exact path='/tabs'>
        <Redirect to='/tabs/home' />
      </Route>

    </>
  )
}

export default AppRoute

