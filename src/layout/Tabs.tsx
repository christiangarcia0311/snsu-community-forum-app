import React from 'react'
import { IonTabs, IonRouterOutlet } from '@ionic/react'


/* Route Pages */
import TabRoutes  from '../routes/TabRoutes'

/* Tab Buttons and Header */
import TabHeader from '../components/tabs/TabHeader'
import TabButtons from '../components/tabs/TabButton'

const Tabs: React.FC = () => {
    return (
        <>
            <TabHeader />
            <IonTabs>
                <IonRouterOutlet>
                    <TabRoutes />
                </IonRouterOutlet>

                <TabButtons />
            </IonTabs>
        </>
    )
}

export default Tabs