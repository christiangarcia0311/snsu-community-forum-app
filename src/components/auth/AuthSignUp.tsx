import { useState } from 'react'
import { useHistory } from 'react-router-dom'

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
    IonLoading,
    IonAlert
} from '@ionic/react'
 
import {
    logoGoogle
} from 'ionicons/icons'

/* -- SERVICES -- */
import { signupUser } from '../../services/AuthService'


const AuthSignUp = () => {

    const history  = useHistory()

    const currentYear = new Date().getFullYear()
    const appName = 'Stream'

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [department, setDepartment] = useState('')
    const [course, setCourse] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [loadingNavigate, setLoadingNavigate] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)

    const handleSignUp = async () => {

        if (!firstname.trim() || !lastname.trim() || !username.trim() || 
            !email.trim() || !password.trim() || !confirmPassword.trim() ||
            !birthDate || !gender || !role || !department || !course) {
            setMessage('Please fill in all required fields')
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 2000)
            return
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 2000)
            return
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long')
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 2000)
            return
        }

        if (!email.endsWith('@ssct.edu.ph')) {
            setMessage('Email must be from ssct.edu.ph domain')
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 2000)
            return
        }

        setLoading(true)

        try {

            const formData = new FormData()
            formData.append('username', username)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('confirm_password', confirmPassword)


            const profileData = {
                firstname,
                lastname,
                birth_date: birthDate,
                gender,
                role,
                department,
                course
            }

            formData.append('profile', JSON.stringify(profileData))

            await signupUser(formData)

            setMessage('Account created successfully!')
            setShowMessage(true)

            setTimeout(() => {
                setShowMessage(false)
                setLoading(false)
                history.push('/auth/signin')
            }, 2000)

        } catch (error: any) {
            setLoading(false)

            if (error.username) {
                setMessage(error.username[0])
            } else if (error.email) {
                setMessage(error.email[0])
            } else if (error.password) {
                setMessage(error.password[0])
            } else if (error.confirm_password) {
                setMessage(error.confirm_password[0])
            } else {
                setMessage(error.error || 'Signup failed. Please try again.')
            }
        
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 3000)
        }
    }

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
                                    value={firstname}
                                    onIonChange={(e) => setFirstname(e.detail.value!)}
                                    required
                                />
                            </IonCol>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    placeholder='Enter Lastname'
                                    labelPlacement='floating'
                                    label='Lastname'
                                    fill='outline'
                                    value={lastname}
                                    onIonChange={(e) => setLastname(e.detail.value!)}
                                    required
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
                                    value={birthDate}
                                    onIonChange={(e) => setBirthDate(e.detail.value!)}
                                    required
                                />

                                <IonSelect 
                                    label='Select gender' 
                                    labelPlacement='floating' 
                                    className='ion-margin-top'
                                    value={gender}
                                    onIonChange={(e) => setGender(e.detail.value!)}
                                >
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
                                    value={username}
                                    onIonChange={(e) => setUsername(e.detail.value!)}
                                    required
                                />

                                <IonSelect 
                                    label='Select role' 
                                    labelPlacement='floating' 
                                    className='ion-margin-top'
                                    value={role}
                                    onIonChange={(e) => setRole(e.detail.value!)}
                                >
                                    <IonSelectOption value='student'>Student</IonSelectOption>
                                    <IonSelectOption value='faculty'>Faculty</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonSelect 
                                    label='Department' 
                                    labelPlacement='floating'
                                    value={department}
                                    onIonChange={(e) => setDepartment(e.detail.value!)}
                                >
                                    <IonSelectOption value='ccis'>CCIS</IonSelectOption>
                                    <IonSelectOption value='coe'>COE</IonSelectOption>
                                    <IonSelectOption value='cas'>CAS</IonSelectOption>
                                    <IonSelectOption value='cbt'>CBT</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonSelect 
                                    label='Course' 
                                    labelPlacement='floating'
                                    value={course}
                                    onIonChange={(e) => setCourse(e.detail.value!)}
                                >
                                    <IonSelectOption value='bscs'>BS in Computer Science</IonSelectOption>
                                    <IonSelectOption value='bsit'>BS in Information Technology</IonSelectOption>
                                    <IonSelectOption value='bsis'>BS in Information Systems</IonSelectOption>
                                    <IonSelectOption value='bscpe'>BS in Computer Engineering</IonSelectOption>
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
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
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

                                <IonInput
                                    type='password'
                                    placeholder='Re-enter password'
                                    labelPlacement='floating'
                                    label='Confirm Password'
                                    fill='outline'
                                    className='ion-margin-top'
                                    value={confirmPassword}
                                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                    required
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
                                    onClick={handleSignUp}
                                    disabled={loading}
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
                    message={'Creating your account...'}
                    spinner='dots'
                />

                <IonLoading 
                    isOpen={loadingNavigate}
                    message={'Opening sign in page...'}
                    spinner='dots'
                />

                <IonAlert
                    isOpen={showMessage}
                    onDidDismiss={() => setShowMessage(false)}
                    message={message}
                />
            </IonPage>
        </>
    )
}

export default AuthSignUp