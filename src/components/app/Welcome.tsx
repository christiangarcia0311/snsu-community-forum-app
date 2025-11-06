import React from 'react'

import {
    IonPage,
    IonContent,
    IonButton,
    IonText
} from '@ionic/react'

const Welcome = () => {
    return (
        <IonPage>
            <IonContent className='ion-flex ion-justify-content-center ion-align-items-center'>
                <div className='center-welcome'>

                    <img src='/favicon.png' alt='Logo' className='logo-mainpage' />

                    <IonText>
                        <h1 className='center-header'>Stream</h1>
                    </IonText>

                    <IonText>
                        <p className='center-description'>Your community, organized. Get instant updates and dive into clear, continuous threads. Stream your thoughts now!</p>
                    </IonText>

                    <IonButton color='secondary'>
                        Get Started
                    </IonButton>

                </div>
            </IonContent>
        </IonPage>
    )
}

export default Welcome