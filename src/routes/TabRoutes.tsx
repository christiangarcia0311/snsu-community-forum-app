import { Route } from 'react-router-dom'

/* App Pages */
import HomePage from '../pages/main_page/HomePage'
import EventPage from '../pages/main_page/EventPage'
import ForumPage from '../pages/main_page/ForumPage'
import CommunityPage from '../pages/main_page/CommunityPage'
import ProfilePage from '../pages/main_page/ProfilePage'

const TabRoutes = () => (
    <>
        <Route path='/tabs/home' render={() => <HomePage />} exact={true} />
        <Route path='/tabs/events' render={() => <EventPage />} exact={true} />
        <Route path='/tabs/forum' render={() => <ForumPage />} exact={true} />
        <Route path='/tabs/community' render={() => <CommunityPage />} exact={true} />
        <Route path='/tabs/profile' render={() => <ProfilePage />} exact={true} />
    </>
)

export default TabRoutes
