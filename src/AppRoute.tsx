import React from 'react' 
import { Route, Redirect } from 'react-router-dom'

/* App Pages */
import { WelcomePage } from './pages/welcome_page/WelcomePage'
import { AuthPage } from './pages/auth_page/AuthPage'
import HomePage from './pages/main_page/HomePage'
import EventPage from './pages/main_page/EventPage'
import ForumPage from './pages/main_page/ForumPage'
import CommunityPage from './pages/main_page/CommunityPage'
import ProfilePage from './pages/main_page/ProfilePage'

const AppRoute = () => {
  return (
    <>

      {/* Default Route */}
      <Redirect exact from='/' to='/welcome' />


      {/* Routes for Welcome Page */}
      <Route path='/welcome' render={() => <WelcomePage />} exact={true} />

      {/* Route for Auth */}
      <Route path='/auth' render={() => <AuthPage />} exact={true} />

      {/* Routes for Tabs */}
      <Route path='/home' render={() => <HomePage />} exact={true} />
      <Route path='/events' render={() => <EventPage />} exact={true} />
      <Route path='/forum' render={() => <ForumPage />} exact={true} />
      <Route path='/community' render={() => <CommunityPage />} exact={true} />
      <Route path='/profile' render={() => <ProfilePage />} exact={true} />

    </>
  )
}

export default AppRoute

