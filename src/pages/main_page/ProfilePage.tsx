import React, { useState} from 'react'
import { useHistory } from 'react-router'

import {
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonAlert,
    IonMenu,
    IonMenuButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonText,
    IonRow,
    IonCol,
    IonGrid,
    IonAvatar,
    IonSegment,
    IonSegmentButton,
    IonLoading,
    IonSegmentView,
    IonSegmentContent
} from '@ionic/react'

// icons
import {
    personCircleOutline,
    chevronForwardOutline,
    bookmarkOutline,
    podiumOutline,
    notifications,
    lockClosedOutline,
    personAddOutline,
    repeatOutline,
    phonePortraitOutline,
    peopleOutline,
    peopleCircleOutline,
    helpBuoyOutline,
    informationCircleOutline,
    linkOutline,
    logOutOutline,
} from 'ionicons/icons'

// image
import Profile from '../../assets/images/profile.png'

// auth service
import { logoutUser } from '../../services/AuthService'


const ProfilePage = () => {

    const history = useHistory()

    const [showLogoutAlert, setShowLogoutAlert] = useState(false)
    const [loadingNavigate, setLoadingNavigate] = useState(false)

    const handleLogout = () => {

        setLoadingNavigate(true)
        
        setTimeout(() => {
            setLoadingNavigate(false)
            logoutUser()
            history.push('/auth/signin')
        }, 800)
    }
    return (
        <>
            {/* MENU PROFILE CONTENT */}
            <IonMenu contentId='main-content'>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings and Activity</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className='ion-padding'>
                    
                    <p className='txt-highlight'>Your account</p>
                    <IonItem lines='none' className='adjust-background ion-margin-bottom'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={personCircleOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Account Settings</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                            <IonLabel>
                                <p className='txt-highlight-description'>Profile details, password, security and preferences</p>
                            </IonLabel>
                        </IonLabel>
                    </IonItem>

                    <p className='txt-highlight'>How you use stream</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={bookmarkOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Saved Thread</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={podiumOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Your Activity</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={notifications} slot='start' size='large' aria-hidden='true' />
                                <IonText>Notifications</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={peopleCircleOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Community Forum</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={peopleOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>People Connected</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <br />

                    <p className='txt-highlight'>Who can see your thread post</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={lockClosedOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Account Privacy</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <br />

                    <p className='txt-highlight'>How others can interact with you</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={repeatOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Sharing Content</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={personAddOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Follow and invite</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>

                    <br />

                    <p className='txt-highlight'>Your app and media</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={phonePortraitOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Device Permission</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <br />

                    <p className='txt-highlight'>More info and support</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={helpBuoyOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>Help</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                            >
                                <IonIcon icon={informationCircleOutline} slot='start' size='large' aria-hidden='true' />
                                <IonText>About</IonText>
                                <IonIcon icon={chevronForwardOutline} slot='end' />
                            </IonButton>
                        </IonLabel>
                    </IonItem>

                    <br />

                    <p className='txt-highlight'>Sign in</p>
                    <IonItem className='adjust-background'>
                        <IonLabel>
                            <IonButton
                                fill='clear'
                                className='auth-profile'
                                color='danger'
                                expand='block'
                                onClick={() => setShowLogoutAlert(true)}
                            >
                                <IonText>Logout</IonText>
                            </IonButton>
                        </IonLabel>
                    </IonItem>


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

                    <IonLoading 
                        isOpen={loadingNavigate}
                        message={'Loging out...'}
                        spinner='dots'
                    />

                </IonContent>
            </IonMenu>
            
            {/* PROFILE PAGE CONTENT */}
            <IonPage id='main-content'>

                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='end'>
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Profile</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonGrid className='ion-text-center ion-padding'>

                        <IonRow>
                            <IonCol>
                                <IonAvatar className='profile-avatar'>
                                    <img src={Profile} alt='profile' className='profile-image' />
                                </IonAvatar>

                                <IonText>
                                    <h2 className='profile-name'>Christian Garcia</h2>
                                </IonText>
                                <IonText>
                                    <p className='profile-email'>cgarcia1@ssct.edu.ph</p>
                                </IonText>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            
                            <IonCol>
                                <IonText>
                                    20
                                </IonText><br />
                                <IonText>
                                    Threads
                                </IonText>
                            </IonCol>

                            <IonCol>
                                <IonText>
                                    18
                                </IonText><br />
                                <IonText>
                                    Followers
                                </IonText>
                            </IonCol>

                            <IonCol>
                                <IonText>
                                    100
                                </IonText><br />
                                <IonText>
                                    Following
                                </IonText>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            
                            <IonCol>

                                <IonSegment>
                                    <IonSegmentButton value='threads'>
                                        <IonLabel>
                                            Threads
                                        </IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value='shared'>
                                        <IonLabel>
                                            Shared
                                        </IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>

                                {/* CONTENTS */}
                            </IonCol>

                        </IonRow>

                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    )
}


export default ProfilePage