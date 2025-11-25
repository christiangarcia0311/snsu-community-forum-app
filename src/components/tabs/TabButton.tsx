import React from 'react'

import { 
    IonTabBar, 
    IonTabButton, 
    IonIcon, 
    IonLabel,
    IonFooter,
} from '@ionic/react'

/* Icons */
import {
    home,
    chatbubbles,
    people,
    calendar,
    person
} from 'ionicons/icons'

const TabButtons = () => {
    return (
            <IonTabBar slot='bottom' className='tab-bottom-bg'>
                <IonTabButton tab='home' href='/tabs/home'>
                    <IonIcon icon={home} />           
                </IonTabButton>

                <IonTabButton tab='forum' href='/tabs/forum'>
                    <IonIcon icon={chatbubbles} />           
                </IonTabButton>

                <IonTabButton tab='community' href='/tabs/community'>
                    <IonIcon icon={people} />           
                </IonTabButton>

                <IonTabButton tab='events' href='/tabs/events'>
                    <IonIcon icon={calendar} />           
                </IonTabButton>

                <IonTabButton tab='profile' href='/tabs/profile'>
                    <IonIcon icon={person} />           
                </IonTabButton>

            </IonTabBar>
    )
}

export default TabButtons