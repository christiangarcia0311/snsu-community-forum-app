import React, { useState, useEffect } from 'react'

import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonLoading,
    IonToast,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react'

// -- ICONS --
import { 
    arrowForwardOutline,
    saveOutline
} from 'ionicons/icons'

// -- SERVICES --
import { getUserProfile, updateProfileDetails } from '../../../../services/AuthService'

interface ProfileDetailsProps {
    isOpen: boolean
    onDidDismiss: () => void
    onProfileUpdate?: () => void
}

interface UserProfileData {
    username: string
    email: string
    firstname: string
    lastname: string
    birth_date: string
    gender: string
    role: string
    department: string
    course: string
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ 
    isOpen, 
    onDidDismiss,
    onProfileUpdate 
}) => {

    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [gender, setGender] = useState('')
    const [role, setRole] = useState('')
    const [department, setDepartment] = useState('')
    const [course, setCourse] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchProfileData()
        }
    }, [isOpen])

    const fetchProfileData = async () => {
        setLoadingData(true)
        
        try {

            const profile: UserProfileData = await getUserProfile()
            
            setUsername(profile.username)
            setEmail(profile.email)
            setFirstname(profile.firstname)
            setLastname(profile.lastname)
            setBirthDate(profile.birth_date)
            setGender(profile.gender)
            setRole(profile.role)
            setDepartment(profile.department)
            setCourse(profile.course)
            
            setLoadingData(false)

        } catch (error: any) {

            console.error('Failed to fetch profile:', error)
            setToastMessage('Failed to load profile data')
            setShowToast(true)
            setLoadingData(false)

        }
    }

    const handleUpdateProfile = async () => {
        
        // -- VALIDATE REQUIRED FIELDS --
        if (!username.trim() || !firstname.trim() || !lastname.trim() || 
            !birthDate || !gender || !role || !department || !course) {
            setToastMessage('Please fill in all required fields')
            setShowToast(true)
            return
        }
        
        setLoading(true)
        
        try {
            const profileData = {
                username,
                firstname,
                lastname,
                birth_date: birthDate,
                gender,
                role,
                department,
                course
            }
            
            await updateProfileDetails(profileData)
            
            setToastMessage('Profile updated successfully!')
            setShowToast(true)
            
            setTimeout(() => {
                setLoading(false)
                if (onProfileUpdate) {
                    onProfileUpdate()
                }
                onDidDismiss()
            }, 1500)
            
        } catch (error: any) {
            setLoading(false)
            
            if (error.username) {
                setToastMessage(error.username[0])
            } else {
                setToastMessage(error.error || 'Failed to update profile')
            }
            
            setShowToast(true)
        }
    }

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Profile Details</IonTitle>
                        <IonButton 
                            slot='end'
                            fill='clear'
                            onClick={onDidDismiss}
                        >
                            <IonIcon size='large' icon={arrowForwardOutline} />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonGrid className='ion-padding'>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    label='First Name'
                                    labelPlacement='floating'
                                    fill='outline'
                                    value={firstname}
                                    onIonChange={(e) => setFirstname(e.detail.value!)}
                                    required
                                />
                            </IonCol>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    label='Last Name'
                                    labelPlacement='floating'
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
                                    type='text'
                                    label='Username'
                                    labelPlacement='floating'
                                    fill='outline'
                                    value={username}
                                    onIonChange={(e) => setUsername(e.detail.value!)}
                                    required
                                />
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonInput
                                    type='email'
                                    label='Email Address'
                                    labelPlacement='floating'
                                    fill='outline'
                                    value={email}
                                    disabled
                                    readonly
                                />
                                <IonLabel>
                                    <p style={{ fontSize: '12px' }}>
                                        Email cannot be changed
                                    </p>
                                </IonLabel>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonInput
                                    type='date'
                                    label='Birth Date'
                                    labelPlacement='floating'
                                    fill='outline'
                                    value={birthDate}
                                    onIonChange={(e) => setBirthDate(e.detail.value!)}
                                    required
                                />
                            </IonCol>
                            <IonCol>
                                <IonSelect 
                                    label='Gender' 
                                    labelPlacement='floating'
                                    value={gender}
                                    onIonChange={(e) => setGender(e.detail.value!)}
                                >
                                    <IonSelectOption value='male'>Male</IonSelectOption>
                                    <IonSelectOption value='female'>Female</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonSelect 
                                    label='Role' 
                                    labelPlacement='floating'
                                    value={role}
                                    onIonChange={(e) => setRole(e.detail.value!)}
                                >
                                    <IonSelectOption value='student'>Student</IonSelectOption>
                                    <IonSelectOption value='faculty'>Faculty</IonSelectOption>
                                </IonSelect>
                            </IonCol>
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
                                    <IonSelectOption value='cte'>CTE</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
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

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonButton
                                    expand='block'
                                    onClick={handleUpdateProfile}
                                    disabled={loading || loadingData}
                                >
                                    <IonIcon icon={saveOutline} slot='start' />
                                    Save Changes
                                </IonButton>
                            </IonCol>
                        </IonRow>

                    </IonGrid>

                    {/* -- LOADING INDICATOR -- */}
                    <IonLoading
                        isOpen={loadingData}
                        message={'Loading profile data...'}
                        spinner='dots'
                    />

                    <IonLoading
                        isOpen={loading}
                        message={'Updating profile...'}
                        spinner='dots'
                    />
                </IonContent>
            </IonModal>

            {/* -- NOTIFICATION -- */}
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                position='bottom'
            />
        </>
    )
}

export default ProfileDetails