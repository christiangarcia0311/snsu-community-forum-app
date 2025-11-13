import React, { useState} from 'react'
import { useHistory } from 'react-router'

import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    IonButton,
    IonInput,
    IonItem,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonPopover,
    IonAlert
} from '@ionic/react'

// icons 

import {
    person,
    key,
    logoGoogle
} from 'ionicons/icons'

// sign in service
import { signinUser } from '../../services/AuthService'


const AuthSignIn = () => {

    const history =  useHistory()

    const currentYear = new Date().getFullYear()
    const appName = 'Stream'


    // -- handle Sign in state --
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // -- handle Sign in message --
    const [message, setMessage] =  useState('')
    const [showMessage, setShowMessage] = useState(false)

    const handleSignIn =  async () => {

        try {
            const data = await signinUser(username, password)
            setMessage(`Welcome ${data.username}!`)
            setShowMessage(true)

            setTimeout(() => {
                history.push('/tabs')
            }, 1200)

        } catch (error: any) {
            setMessage(error.error || 'Sign in failed')
            setShowMessage(true)
        }
    }

    const handleSwap = () => {
        history.push('/auth/signup')
    }

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
                                    <IonIcon slot='start' icon={person} aria-hidden="true" />
                                    <IonInput 
                                        type='text'
                                        className='adjust-content inpt-AuthSignIn'
                                        placeholder='Enter your username'
                                        label='Username'
                                        labelPlacement='stacked'
                                        value={username}
                                        onIonChange={(e) => setUsername(e.detail.value!)}
                                    />
                                </IonItem>
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={key} aria-hidden="true" />
                                    <IonInput 
                                        type='password'
                                        className='adjust-content inpt-AuthSignIn'
                                        placeholder='Enter your password'
                                        label='Password'
                                        labelPlacement='stacked'
                                        value={password}
                                        onIonChange={(e) => setPassword(e.detail.value!)}
                                    />
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <a id='forgot-pass' className='links' slot='end'>Forgot Password?</a>
                                    <IonPopover trigger='forgot-pass' side='top' size='auto'>
                                        <IonContent class='ion-padding'>
                                            Enter your email to reset your password.
                                        </IonContent>
                                    </IonPopover>
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <IonButton
                                        expand='block'
                                        className='btn-auth'
                                        shape='round'
                                        onClick={() => handleSignIn()}
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
                                    <a className='txt-auth'>
                                        Don't have an account? <a onClick={() => handleSwap()} className='links' >Sign Up</a>
                                    </a>
                                </div>

                                <div className="message">
                                    <IonAlert
                                        isOpen={showMessage}
                                        onDidDismiss={() => setShowMessage(false)}
                                        header='Sign In'
                                        message={message}
                                        buttons={['OK']}
                                    />
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </div>
                </div>

                
            </IonContent>

            <IonFooter>
                <IonToolbar className='txt-container-footer'>
                    <IonTitle>
                        <p className='txt-copyright'>&copy; {currentYear} {appName}. All Rights Reserved.</p>
                    </IonTitle>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    )
}

export default AuthSignIn