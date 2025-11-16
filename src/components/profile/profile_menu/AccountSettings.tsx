import { useState } from 'react'

import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonModal
} from '@ionic/react'

// -- ICONS --
import { 
    arrowForwardOutline
} from 'ionicons/icons'

// -- SETTING COMPONENTS --
import ProfileDetails from './settings/ProfileDetails'


interface AccountSettingsProps {
    isOpen: boolean
    onDidDismiss: () => void
    onProfileUpdate?: () => void
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
    isOpen, 
    onDidDismiss,
    onProfileUpdate
}) => {

    const [showProfileDetails, setShowProfileDetails] = useState(false)

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Account Settings</IonTitle>
                        <IonButton
                            slot='end'
                            fill='clear'
                            onClick={onDidDismiss}
                        >
                            <IonIcon size='large' icon={arrowForwardOutline} />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent>

                    <IonItem 
                        button 
                        detail={false} 
                        lines='full' 
                        className='adjust-background'
                        onClick={() => setShowProfileDetails(true)}
                    >   
                        <IonLabel>
                            <h2>Edit Profile Details</h2>
                            <p>Update your personal information</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem button detail={false} lines='full' className='adjust-background'>   
                        <IonLabel>
                            <h2>Change Password</h2>
                            <p>Update your account password</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem button detail={false} lines='full' className='adjust-background'>   
                        <IonLabel>
                            <h2>Privacy & Security</h2>
                            <p>Manage your privacy settings</p>
                        </IonLabel>
                    </IonItem>
                </IonContent>
            </IonModal>

            {/* -- SETTINGS MODAL */}
            <ProfileDetails
                isOpen={showProfileDetails}
                onDidDismiss={() => setShowProfileDetails(false)}
                onProfileUpdate={onProfileUpdate}
            />
        </>
    )
}

export default AccountSettings