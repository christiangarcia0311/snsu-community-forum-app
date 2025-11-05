import React from 'react'

import {
    IonHeader,
    IonToolbar,
    IonTitle
} from '@ionic/react' 

const TabHeader = () => {
    return (
        <IonHeader>
            <IonToolbar>   
                <IonTitle>
                    <img src='/favicon.png' alt='Stream App' className='logo-header' />
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default TabHeader