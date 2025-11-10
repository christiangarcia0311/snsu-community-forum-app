import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    IonButton,
    IonInput,
    IonItem
} from '@ionic/react'

// icons 

import {
    mail,
    lockClosed,
    logoGoogle,
    helpCircle
} from 'ionicons/icons'


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
                        
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={mail} aria-hidden="true" />
                                    <IonInput 
                                        type='email'
                                        className='adjust-content inpt-auth'
                                        placeholder='Enter your email'
                                        label='Email Address'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={lockClosed} aria-hidden="true" />
                                    <IonInput 
                                        type='password'
                                        className='adjust-content inpt-auth'
                                        placeholder='Enter your password'
                                        label='Password'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <a href="/" className='links' slot='end'>Forgot Password?</a>
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

                                <div className="center-separator">
                                    <span className='line'></span>OR<span className='line'></span>
                                </div>

                                <IonItem lines='none' className='adjust-background'>
                                    <IonButton
                                        expand='block'
                                        className='btn-auth-google'
                                        shape='round'
                                    >
                                        <IonIcon 
                                            slot='start' 
                                            icon={logoGoogle}
                                        />
                                        Continue with Google
                                    </IonButton>
                                </IonItem>
                                
                                <div className="txt-container">
                                    <IonText className='txt-auth'>
                                        Don't have an account? <a href="/auth" className='links' >Sign Up</a>
                                    </IonText>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Auth