import React from 'react'  

import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle
} from '@ionic/react'


const EventPage = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar className='home-header-bg'>
                    <IonTitle>Annoncements & Events</IonTitle>
                </IonToolbar>
            </IonHeader>
        </>
    )
}


export default EventPage