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
                    <div className='align-header'>
                        <img src='/favicon.png' alt='Stream App' className='logo-header' />
                        <span>Stream</span>
                    </div>
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default TabHeader