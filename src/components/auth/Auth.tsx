import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonButton,
    IonInput,
    IonLabel,
    IonItem
} from '@ionic/react'


const Auth = () => {
    return (
        <IonPage>
            <IonContent className='ion-padding'>
                <div className='center-display'>
                    <div>
                        <IonCard className='center-card'>
                            <IonCardContent>
                                <div className='center-display'>
                                    <img src="/favicon.png" alt="Logo" className='logo-auth' />
                                </div>
                        
                                <IonItem lines='none' className='adjust-background'>
                                    <IonInput 
                                        type='email'
                                        className='adjust-content inpt-auth'
                                        placeholder='Enter your email'
                                        label='Email Address'
                                        labelPlacement='floating'
                                        fill='outline'
                                        shape='round'
                                    />
                                </IonItem>
                                <IonItem lines='none' className='adjust-background'>
                                    <IonInput 
                                        type='password'
                                        className='adjust-content inpt-auth'
                                        placeholder='Enter your password'
                                        label='Password'
                                        labelPlacement='floating'
                                        fill='outline'
                                        shape='round'
                                    />
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <IonButton
                                        expand='block'
                                        className='btn-auth'
                                        shape='round'
                                    >
                                        Sign In
                                    </IonButton>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Auth