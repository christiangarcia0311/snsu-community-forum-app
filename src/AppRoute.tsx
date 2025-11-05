import React from 'react' 
import { Route, Redirect } from 'react-router-dom'

/* App Pages */
import HomePage from './pages/HomePage'
import EventPage from './pages/EventPage'
import ForumPage from './pages/ForumPage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'

const AppRoute = () => {
  return (
    <>

      {/* Default Route */}
      <Redirect exact from='/' to='/home' />

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

