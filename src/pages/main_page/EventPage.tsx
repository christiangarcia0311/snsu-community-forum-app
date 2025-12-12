import React from 'react'  

import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle
} from '@ionic/react'

import CampusFeed from '../../components/events/CampusFeed'

const EventPage = () => {
    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar className='home-header-bg'>
                        <IonTitle>Announcements & Events</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <CampusFeed />
                </IonContent>
            </IonPage>
    
        </>
    )
}


export default EventPage