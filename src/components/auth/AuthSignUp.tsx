import { useState } from 'react'
import { useHistory } from 'react-router'

import {
    IonPage,
    IonContent,
    IonIcon,
    IonText,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonCol,
    IonRow,
    IonLoading
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

    const [loadingNavigate, setLoadingNavigate] = useState(false)

    const handleSwap = () => {

        setLoadingNavigate(true)

        setTimeout(() => {
            setLoadingNavigate(false)
            history.push('/auth/signin')
        }, 600)
    }

    return (
        <>
            <IonPage>
                {/* SIGN UP PAGE CONTENT */}
                <IonContent className='ion-padding'>
                    <IonGrid>

                        <IonRow className='ion-text-center'>
                            <IonCol>
                                <IonText>
                                    <h2 className='auth-title'>Stream</h2>
                                </IonText>
                                <IonText>
                                    <p className='auth-sub-title'>
                                        Sign up to see thread posts and announcements from your campus.
                                    </p>
                                </IonText>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonButton
                                    expand='block'
                                    shape='round'
                                    className='auth-google-button'
                                >
                                    <IonIcon 
                                        slot='start' 
                                        icon={logoGoogle}
                                    />
                                    Continue with Gsuite Account
                                </IonButton>

                                <div className="center-separator">
                                    <span className='auth-line'></span>OR<span className='auth-line'></span>
                                </div>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    placeholder='Enter Firstname'
                                    labelPlacement='floating'
                                    label='Firstname'
                                    fill='outline'
                                />
                            </IonCol>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    placeholder='Enter Lastname'
                                    labelPlacement='floating'
                                    label='Lastname'
                                    fill='outline'
                                />
                            </IonCol>
                        </IonRow>
                        
                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonInput
                                    type='date'
                                    placeholder='Birth Date'
                                    labelPlacement='floating'
                                    label='Birth Date'
                                    fill='outline'
                                />

                                <IonSelect label='Select gender' labelPlacement='floating' className='ion-margin-top'>
                                    <IonSelectOption value='male'>Male</IonSelectOption>
                                    <IonSelectOption value='female'>Female</IonSelectOption>
                                </IonSelect>

                                <IonInput
                                    type='text'
                                    placeholder='Enter username'
                                    labelPlacement='floating'
                                    label='Username'
                                    fill='outline'
                                    className='ion-margin-top'
                                />

                                <IonSelect label='Select role' labelPlacement='floating' className='ion-margin-top'>
                                    <IonSelectOption value='student'>Student</IonSelectOption>
                                    <IonSelectOption value='faculty'>Faculty</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonSelect label='Department' labelPlacement='floating'>
                                    <IonSelectOption value='CCIS'>CCIS</IonSelectOption>
                                    <IonSelectOption value='COE'>COE</IonSelectOption>
                                    <IonSelectOption value='CAS'>CAS</IonSelectOption>
                                    <IonSelectOption value='CBT'>CBT</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonSelect label='Course' labelPlacement='floating'>
                                    <IonSelectOption value='BSCS'>BS in Computer Science</IonSelectOption>
                                    <IonSelectOption value='BSIT'>BS in Information Technology</IonSelectOption>
                                    <IonSelectOption value='BSIS'>BS in Information Systems</IonSelectOption>
                                    <IonSelectOption value='BSCpE'>BS in Computer Engineering</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonInput
                                    type='email'
                                    placeholder='Enter email (ssct.edu.ph)'
                                    labelPlacement='floating'
                                    label='Email Address'
                                    fill='outline'
                                    className='ion-margin-top'
                                />

                                <IonInput
                                    type='password'
                                    placeholder='Enter password'
                                    labelPlacement='floating'
                                    label='Password'
                                    fill='outline'
                                    className='ion-margin-top'
                                />

                                <IonInput
                                    type='password'
                                    placeholder='Re-enter password'
                                    labelPlacement='floating'
                                    label='Confirm Password'
                                    fill='outline'
                                    className='ion-margin-top'
                                />

                                <IonText>
                                    <p className='auth-reminder'>
                                        People who use our service may have uploaded your 
                                        information to Stream. <a href="" className='auth-link-highlight'>Learn more</a>
                                    </p>
                                </IonText>

                                <IonText>
                                    <p className='auth-service'>
                                        By signing up, you are agree to our <a href="" className='auth-link-highlight'>Terms</a>, &nbsp;
                                        <a href="" className='auth-link-highlight'>Privacy Policy</a>  and&nbsp;
                                        <a href="" className='auth-link-highlight'>Cookies Policy</a>
                                    </p>
                                </IonText>

                                <IonButton
                                    expand='block'
                                    className='auth-signup ion-margin-top'
                                >
                                    Sign Up
                                </IonButton>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-text-center ion-margin-top'>
                            <IonCol>
                                <IonText>
                                    <p className='auth-swap'>Have an account? <a onClick={handleSwap} className='auth-link-highlight'>Sign in</a></p>
                                </IonText>
                            </IonCol>
                        </IonRow>
                        <br />

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

                {/* FOOTER */}
                <IonFooter>
                    <IonToolbar className='txt-container-footer'>
                        <IonTitle>
                            <p className='txt-copyright'>&copy; {currentYear} {appName}. All Rights Reserved.</p>
                        </IonTitle>
                    </IonToolbar>
                </IonFooter>

                {/* LOADING STATES AND POPUPS */}
                <IonLoading 
                    isOpen={loadingNavigate}
                    message={'Opening sign in page...'}
                    spinner='dots'
                />
            </IonPage>
        </>
    )
}

export default AuthSignUp