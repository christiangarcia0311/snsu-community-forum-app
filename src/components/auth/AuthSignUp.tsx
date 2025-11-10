import { useHistory } from 'react-router'

import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonIcon,
    IonText,
    IonButton,
    IonInput,
    IonItem,
    IonFooter,
    IonToolbar,
    IonTitle
} from '@ionic/react'

// icons 

import {
    person,
    mail,
    key,
    logoGoogle
} from 'ionicons/icons'


const AuthSignUp = () => {

    const history  = useHistory()

    const currentYear = new Date().getFullYear()
    const appName = 'Stream'

    const handleSwap = () => {
        history.push('/auth/signin')
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
                                        className='adjust-content inpt-AuthSignUp'
                                        placeholder='Enter your username'
                                        label='Username'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={mail} aria-hidden="true" />
                                    <IonInput 
                                        type='email'
                                        className='adjust-content inpt-AuthSignUp'
                                        placeholder='Enter your email'
                                        label='Email Address'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={key} aria-hidden="true" />
                                    <IonInput 
                                        type='password'
                                        className='adjust-content inpt-AuthSignUp'
                                        placeholder='Enter your password'
                                        label='Password'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>
                                <IonItem className='adjust-background'>
                                    <IonIcon slot='start' icon={key} aria-hidden="true" />
                                    <IonInput 
                                        type='password'
                                        className='adjust-content inpt-AuthSignUp'
                                        placeholder='Confirm your password'
                                        label='Confirm Password'
                                        labelPlacement='stacked'
                                    />
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <IonCheckbox justify='end' className='links-container'>
                                        I accept the <a href="/" className='links-checks'>Terms and Conditions</a>
                                    </IonCheckbox>
                                </IonItem>

                                <IonItem lines='none' className='adjust-background'>
                                    <IonButton
                                        expand='block'
                                        className='btn-auth'
                                        shape='round'
                                    >
                                        Sign Up
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
                                        Sign Up with Google
                                    </IonButton>
                                </IonItem>
                                
                                <div className="txt-container">
                                    <IonText className='txt-auth'>
                                        Already have an account? <a onClick={() => handleSwap()} className='links' >Sign In</a>
                                    </IonText>
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

export default AuthSignUp