import React from 'react'
import {
    IonButton,
    IonText,
    IonIcon,
} from '@ionic/react'

// icons
import { addCircleOutline } from 'ionicons/icons'

const ThreadPost: React.FC = () => {

    return (
        <div className="profile-thread-center ion-text-center ion-padding">
            <div>
                <IonIcon 
                    icon={addCircleOutline} 
                    style={{ fontSize: '64px', color: 'var(--tertiary-shade)' }}
                />
                
                <IonText>
                    <h2 className='profile-thread-header'>No Threads Yet</h2>
                </IonText>
                
                <IonText>
                    <p className='profile-thread-sub'>
                        Start sharing your thoughts with the community. 
                        Create your first thread post now!
                    </p>
                </IonText>

                <IonButton
                    color='secondary'
                    className='ion-margin-top'
                >
                    Create First Thread
                </IonButton>
            </div>
        </div>
    )
}

export default ThreadPost