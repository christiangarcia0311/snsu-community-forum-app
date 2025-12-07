import { Route } from 'react-router-dom'

// protected route
import ProtectedRoute from './ProtectedRoute'

/* App Pages */
import HomePage from '../pages/main_page/HomePage'
import EventPage from '../pages/main_page/EventPage'
import CommunityPage from '../pages/main_page/CommunityPage'
import ProfilePage from '../pages/main_page/ProfilePage'

const TabRoutes = () => (
    <>
        <ProtectedRoute path='/tabs/home' component={HomePage} exact={true} />
        <ProtectedRoute path='/tabs/events' component={EventPage} exact={true} />
        <ProtectedRoute path='/tabs/community' component={CommunityPage} exact={true} />
        <ProtectedRoute path='/tabs/profile' component={ProfilePage} exact={true} />
    </>
)

export default TabRoutes
