import React from 'react'

import { 
    IonTabBar, 
    IonTabButton, 
    IonIcon, 
    IonLabel 
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
        <IonTabBar slot="bottom">

            <IonTabButton tab='home' href='/home'>
                <IonIcon icon={home} />           
            </IonTabButton>

            <IonTabButton tab='forum' href='/forum'>
                <IonIcon icon={chatbubbles} />           
            </IonTabButton>

            <IonTabButton tab='community' href='/community'>
                <IonIcon icon={people} />           
            </IonTabButton>

            <IonTabButton tab='events' href='/events'>
                <IonIcon icon={calendar} />           
            </IonTabButton>

            <IonTabButton tab='profile' href='/profile'>
                <IonIcon icon={person} />           
            </IonTabButton>

        </IonTabBar>
    )
}

export default TabButtons