import { Route } from 'react-router-dom'

// protected route
import ProtectedRoute from './ProtectedRoute'

/* App Pages */
import HomePage from '../pages/main_page/HomePage'
import EventPage from '../pages/main_page/EventPage'
import ForumPage from '../pages/main_page/ForumPage'
import CommunityPage from '../pages/main_page/CommunityPage'
import ProfilePage from '../pages/main_page/ProfilePage'
import AllUsersPage from '../pages/main_page/AllUsersPage'

const TabRoutes = () => (
    <>
        <ProtectedRoute path='/tabs/home' component={HomePage} exact={true} />
        <ProtectedRoute path='/tabs/events' component={EventPage} exact={true} />
        <ProtectedRoute path='/tabs/forum' component={ForumPage} exact={true} />
        <ProtectedRoute path='/tabs/community' component={CommunityPage} exact={true} />
        <ProtectedRoute path='/tabs/profile' component={ProfilePage} exact={true} />
        <ProtectedRoute path='/tabs/all-users' component={AllUsersPage} exact={true} />
    </>
)

export default TabRoutes
