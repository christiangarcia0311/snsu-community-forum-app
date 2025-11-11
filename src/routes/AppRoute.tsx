import React from 'react' 
import { Route, Redirect } from 'react-router-dom'

/* App Pages */
import { WelcomePage } from '../pages/welcome_page/WelcomePage'

import Tabs from '../layout/Tabs'

import AuthSignIn from '../components/auth/AuthSignIn'
import AuthSignUp from '../components/auth/AuthSignUp'


const AppRoute = () => {
  return (
    <>

      {/* Default */}
      {/*<Redirect exact from='/' to='/welcome' /> */}


      {/* Welcome */}
      <Route path='/' render={() => <WelcomePage />} exact={true} />

      {/* Auth */}
      <Route path='/auth/signin' render={() => <AuthSignIn />} exact={true} />
      <Route path='/auth/signup' render={() => <AuthSignUp />} exact={true} />

      {/* Tabs */}
      <Route path='/tabs' render={() => <Tabs />} />

    </>
  )
}

export default AppRoute

