import React from 'react'
import { IonTabs, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'


/* Route Pages */
import AppRoute from '../AppRoute'

/* Tab Buttons and Header */
import TabHeader from '../components/tabs/TabHeader'
import TabButtons from '../components/tabs/TabButton'

const Tabs: React.FC = () => {
    return (
        <IonReactRouter>
            <TabHeader />
            <IonTabs>
                <IonRouterOutlet>
                    {AppRoute()}
                </IonRouterOutlet>

                <TabButtons />
            </IonTabs>
        </IonReactRouter>
    )
}

export default Tabs