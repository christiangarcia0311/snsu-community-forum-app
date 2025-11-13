import React, { useState} from 'react'
import { useHistory } from 'react-router'

import {
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonAlert
} from '@ionic/react'

// icons
import {
    eyeOutline,
    settingsOutline,
    notificationsOutline,
    linkOutline,
    logOutOutline
} from 'ionicons/icons'

// image
import Profile from '../../theme/images/profile.png'

import TabHeader from '../../components/tabs/TabHeader'
// auth service
import { logoutUser } from '../../services/AuthService'


const ProfilePage = () => {

    const history = useHistory()

    const [showLogoutAlert, setShowLogoutAlert] = useState(false)

    const handleLogout = () => {
        logoutUser()
        history.push('/auth/signin')
    }
    return (
        <IonPage>
            <TabHeader />
            <IonContent>
                <div className='center-display'>
                    <div className='profile-container'>
                        <div className="header-img">
                            <img src={Profile} alt='Profile' height={120} width={120} className='header-profile'  />
                        </div>
                        <div className='txt-main-header'>
                            <h2 className='txt-header'>
                                Christian Garcia
                            </h2>
                            <p className='txt-subheader'>
                                @cgarcia1@ssct.edu.ph
                            </p>
                        </div>

                        <p className='txt-highlight'>Accounts</p>
                
                        <IonItem className='adjust-background'>
                            <IonLabel>
                                <IonButton
                                    fill='clear'
                                >
                                    <IonIcon icon={eyeOutline} slot='start' />
                                    View Profile
                                </IonButton>
                            </IonLabel>
                        </IonItem>
                        <IonItem className='adjust-background'>
                            <IonLabel>
                                <IonButton
                                    fill='clear'
                                >
                                    <IonIcon icon={settingsOutline} slot='start' />
                                    Profile Settings
                                </IonButton>
                            </IonLabel>
                        </IonItem>
                        <IonItem className='adjust-background'>
                            <IonLabel>
                                <IonButton
                                    fill='clear'
                                >
                                    <IonIcon icon={notificationsOutline} slot='start' />
                                    Notifications
                                </IonButton>
                            </IonLabel>
                        </IonItem>
                    

                        <p className='txt-highlight'>Actions</p>
                        <IonItem className='adjust-background'>
                            <IonLabel>
                                <IonButton
                                    fill='clear'
                                >
                                    <IonIcon icon={linkOutline} slot='start' />
                                    Link Account
                                </IonButton>
                            </IonLabel>
                        </IonItem>
                        <IonItem className='adjust-background'>
                            <IonLabel>
                                <IonButton
                                    fill='clear'
                                    onClick={() => setShowLogoutAlert(true)}
                                >
                                    <IonIcon icon={logOutOutline} slot='start' />
                                    Logout
                                </IonButton>
                            </IonLabel>
                        </IonItem>
                    </div>
                </div>


                <IonAlert
                    isOpen={showLogoutAlert}
                    onDidDismiss={() => setShowLogoutAlert(false)}
                    header='Logout'
                    message='Are you sure you want to logout?'
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel'
                        },
                        {
                            text: 'Logout',
                            handler: handleLogout
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    )
}


export default ProfilePage