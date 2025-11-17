import React from 'react'  

import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonChip,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonImg,
    IonBadge
} from '@ionic/react'

import {
    notificationsOutline,
    personAddOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline
} from 'ionicons/icons'


const HomePage = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar className='home-header-bg'>
                    <IonTitle>
                        <h2 className='home-header'>stream</h2>
                    </IonTitle>
                    <IonButton slot='end' fill='clear'>
                        <IonIcon icon={notificationsOutline} className='home-icon' />
                        <IonBadge color="danger" shape='round'>7</IonBadge>
                    </IonButton>
                    <IonButton slot='end' fill='clear'>
                        <IonIcon icon={personAddOutline} className='home-icon'  />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent>

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonSearchbar
                                className='home-searchbar'
                                placeholder='Search for users, threads or topics...'
                                showClearButton='always'
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className='ion-text-center'>
                            <IonChip className='home-chip'>All</IonChip>
                            <IonChip className='home-chip'>Discussions</IonChip>
                            <IonChip className='home-chip'>Questions</IonChip>
                            <IonChip className='home-chip'>Guide</IonChip>
                        </IonCol>
                        
                    </IonRow>
                </IonGrid>
                
                {/* THREAD POST */}
                <IonCard className='home-thread-post'>
                    <IonCardContent>
                        <IonGrid>
                            {/* USER INFO POST */}
                            <IonRow className='ion-align-items-center'>
                                <IonCol size='auto'>
                                    <IonAvatar className='home-post-avatar'>
                                        <img 
                                            src="https://ionicframework.com/docs/img/demos/thumbnail.svg" 
                                            alt="profile" 
                                            className='home-post-photo'
                                        />
                                    </IonAvatar>
                                </IonCol>
                                <IonCol>
                                    <IonText>
                                        <h2 className="home-post-name">SNSU | Computer Society</h2>
                                    </IonText>
                                    <IonText>
                                        <p className="home-post-date">October 25 at 2:34 PM</p>
                                    </IonText>
                                </IonCol>
                            </IonRow>

                            {/* CONTENTS */}
                            <IonRow>
                                <IonCol>
                                    <IonText>
                                        <h2 className="home-thread-title">Logo Making Contest</h2>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonText>
                                        <p className="ion-margin-top home-thread-content">
                                            The Computer Society invites all BS Computer Science students to 
                                            take part in an exciting creative challenge that will shape the 
                                            visual identity of our organization!... See more.
                                        </p>
                                    </IonText>
                                </IonCol>
                            </IonRow>

                            {/* POST WITH IMAGE */}
                            <IonRow className='ion-margin-top'>
                                <IonCol>
                                    <IonImg 
                                        src='https://ionicframework.com/docs/img/demos/thumbnail.svg'
                                        alt="Thread post image"
                                        className='home-thread-image'
                                    />
                                </IonCol>
                            </IonRow>

                            {/* ACTIONS */}
                            <IonRow className='ion-margin-top home-thread-actions'>
                                <IonCol>
                                    <IonButton fill='clear' size='small' className='home-action-button'>
                                        <IonIcon icon={heartOutline} slot='start' />
                                        <IonText>24</IonText>
                                    </IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton fill='clear' size='small' className='home-action-button'>
                                        <IonIcon icon={chatbubbleOutline} slot='start' />
                                        <IonText>12</IonText>
                                    </IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton fill='clear' size='small' className='home-action-button'>
                                        <IonIcon icon={shareSocialOutline} slot='start' />
                                        <IonText>Share</IonText>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

            </IonContent>

        </>
    )
}


export default HomePage