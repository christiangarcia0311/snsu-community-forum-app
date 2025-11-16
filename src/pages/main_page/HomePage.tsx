import React from 'react'  

import {
    IonContent,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon
} from '@ionic/react'


const HomePage = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar className='home-header-bg'>
                    <IonTitle>
                        <h2 className='home-header'>Stream</h2>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
        </>
    )
}


export default HomePage