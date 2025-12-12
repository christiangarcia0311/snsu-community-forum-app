import React from 'react'
import { IonTabs, IonRouterOutlet } from '@ionic/react'


/* Route Pages */
import TabRoutes  from '../routes/TabRoutes'

/* Tab Buttons */
import TabButtons from '../components/tabs/TabButton'

const Tabs: React.FC = () => {
    return (
            <IonTabs>
                <IonRouterOutlet>
                    <TabRoutes />
                </IonRouterOutlet>

                <TabButtons />
            </IonTabs>
    )
}

export default Tabs