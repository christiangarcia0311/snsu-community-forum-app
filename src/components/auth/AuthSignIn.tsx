import React, { useState} from 'react'
import { useHistory } from 'react-router'

import {
    IonPage,
    IonContent,
    IonIcon,
    IonText,
    IonButton,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonLoading,
    IonAlert
} from '@ionic/react'

// icons 
import {
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

    const [loading, setLoading] = useState(false)
    const [loadingNavigate, setLoadingNavigate] = useState(false)

    const handleSignIn =  async () => {

        if (!username.trim() || !password.trim()) {
            setMessage('Please enter both username and password.')
            setShowMessage(true)

            setTimeout(() => {
                setShowMessage(false)
            }, 1500)

            return
        }

        setLoading(true)

        try {
            await signinUser(username, password)
            setMessage('Sign in successful!')
            setShowMessage(true)
            
            setTimeout(() => {
                setShowMessage(false)
            }, 1500)

            setTimeout(() => {
                setLoading(false)
                history.push('/tabs')
            }, 1200)

        } catch (error: any) {
            setLoading(false)
            
            if (error.detail) {
                setMessage(error.detail)
            } else if (error.error) {
                setMessage(error.error)
            } else {
                setMessage('Invalid credentials. Please try again.')
            }
            
            setShowMessage(true)

            setTimeout(() => {
                setShowMessage(false)
            }, 1500)
        }
    }

    const handleSwap = () => {

        setLoadingNavigate(true)

        setTimeout(() => {
            setLoadingNavigate(false)
            history.push('/auth/signup')
        }, 600)
    }

    return (
        <IonPage>
            <IonContent className='ion-padding'>
                <IonGrid>

                    <IonRow className='ion-text-center'>
                        <IonCol>
                            <IonText>
                                <h2 className='auth-title-signin'>Stream</h2>
                            </IonText>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol>
                            <IonInput
                                type='text'
                                placeholder='Enter username'
                                labelPlacement='floating'
                                label='Email or username'
                                fill='outline'
                                className='ion-margin-top'
                                value={username}
                                onIonChange={(e) => setUsername(e.detail.value!)}
                                required
                            />
                            <IonInput
                                type='password'
                                placeholder='Enter password'
                                labelPlacement='floating'
                                label='Password'
                                fill='outline'
                                className='ion-margin-top'
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                required
                            />
                            <IonButton
                                expand='block'
                                className='auth-signup ion-margin-top'
                                onClick={() => handleSignIn()}
                                disabled={loading}
                            >
                                Sign In
                            </IonButton>

                            <div className="center-separator">
                                <span className='auth-line'></span>OR<span className='auth-line'></span>
                            </div>

                            <IonButton
                                expand='block'
                                shape='round'
                                className='auth-google-signin'
                                fill='clear'
                            >
                                <IonIcon 
                                    slot='start' 
                                    icon={logoGoogle}
                                />
                                Continue with Gsuite Account
                            </IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow className='ion-text-center ion-margin-top ion-margin-bottom'>
                        <IonCol>
                            <IonText className='auth-swap'>
                                <p>Don't have an account? <a onClick={handleSwap}  className='auth-link-highlight'>Sign up</a></p>
                            </IonText>
                        </IonCol>
                    </IonRow>

                    <br /><br />
                    <IonRow className='ion-margin-top ion-text-center'>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>Stream</a>
                                </IonText>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>About</a>
                                </IonText>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>Privacy</a>
                                </IonText>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>Terms</a>
                                </IonText>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>Threads</a>
                                </IonText>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <a href="" className='auth-sponsor'>API</a>
                                </IonText>
                            </IonCol>
                        </IonRow>
                </IonGrid>
                
            </IonContent>

            <IonFooter>
                <IonToolbar className='txt-container-footer'>
                    <IonTitle>
                        <p className='txt-copyright'>&copy; {currentYear} {appName}. All Rights Reserved.</p>
                    </IonTitle>
                </IonToolbar>
            </IonFooter>

            {/* LOADING STATES AND POPUPS */}
            <IonLoading 
                isOpen={loading}
                message={'Signing you in...'}
                spinner='dots'
            />

            <IonLoading 
                isOpen={loadingNavigate}
                message={'Opening sign up page...'}
                spinner='dots'
            />

            <IonAlert
                isOpen={showMessage}
                onDidDismiss={() => setShowMessage(false)}
                message={message}
                onDurationChange={() => setShowMessage(false)}
            />
        </IonPage>
    )
}

export default AuthSignIn