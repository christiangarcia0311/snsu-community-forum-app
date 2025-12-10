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
    IonCol,
    IonText
} from '@ionic/react'

// -- ICONS --
import { 
    arrowForwardOutline,
    saveOutline,
    informationCircleOutline
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
    can_update_profile?: boolean
    days_until_next_update?: number
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

    const [canUpdateProfile, setCanUpdateProfile] = useState(true)
    const [daysUntilNextUpdate, setDaysUntilNextUpdate] = useState(0)


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

            setCanUpdateProfile(profile.can_update_profile ?? true)
            setDaysUntilNextUpdate(profile.days_until_next_update ?? 0)
            
            setLoadingData(false)

        } catch (error: any) {

            console.error('Failed to fetch profile:', error)
            setToastMessage('Failed to load profile data')
            setShowToast(true)
            setLoadingData(false)

        }
    }

    const handleUpdateProfile = async () => {

        // -- CHECK IF UPDATE IS ALLOWED --
        if (!canUpdateProfile) {
            setToastMessage(`You can update your profile in ${daysUntilNextUpdate} day(s)`)
            setShowToast(true)
            return
        }
        
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
            
            if (error.error) {
                setToastMessage(error.error)
            } else if (error.username) {
                setToastMessage(error.username[0])
            } else {
                setToastMessage('Failed to update profile')
            }

            if (error.days_remaining !== undefined) {
                setDaysUntilNextUpdate(error.days_remaining)
                setCanUpdateProfile(false)
            }
            
            setShowToast(true)
        }
    }

    const departmentCourses: Record<string, { value: string; label: string }[]> = {
        ccis: [
            { value: 'bscs', label: 'BS in Computer Science' },
            { value: 'bsit', label: 'BS in Information Technology' },
            { value: 'bsis', label: 'BS in Information Systems' },
            { value: 'bscpe', label: 'BS in Computer Engineering' },
        ],
        coe: [
            { value: 'bsce', label: 'BS in Civil Engineering' },
            { value: 'bsee', label: 'BS in Electrical Engineering' },
            { value: 'bsece', label: 'BS in Electronics and Engineering' },
            { value: 'bscpe', label: 'BS in Computer Engineering' },
        ],
        cbt: [
            { value: 'bet', label: 'Bachelor of Engineering Technology' },
            { value: 'baet', label: 'Bachelor of Automotive Engineering Technology' },
            { value: 'beet', label: 'Bachelor of Electrical Engineering Technology' },
            { value: 'bexet', label: 'Bachelor of Electronics Engineering Technology' },
            { value: 'bmet', label: 'Bachelor of Mechanical Engineering Technology' },
            { value: 'bmet-mt', label: 'BMET - Mechanical Technology' },
            { value: 'bmet-ract', label: 'BMET - Refrigeration and Air-conditioning Technology' },
            { value: 'bmet-waft', label: 'BMET - Welding and Fabrication Technology' },
            { value: 'bit', label: 'Bachelor in Industrial Technology' },
            { value: 'bit-adt', label: 'Architectural Drafting' },
            { value: 'bit-at', label: 'Automotive Technology' },
            { value: 'bit-elt', label: 'Electrical Technology' },
            { value: 'bit-elex', label: 'Electronics Technology' },
            { value: 'bit-mt', label: 'Mechanical Technology' },
            { value: 'bit-hvacr', label: 'Heating, Ventilating & Air-Conditioning technology' },
            { value: 'bit-waft', label: 'Welding & Fabrication Technology' },
            { value: 'bshm', label: 'Bachelor of Science in Hospitality Management' },
            { value: 'bsmt', label: 'Bachelor of Science in Tourism Management' },
        ],
        cas: [
            { value: 'bsm', label: 'Bachelor of Science in Mathematics' },
            { value: 'bses', label: 'Bachelor of Science in Environmental Science' },
            { value: 'bael', label: 'Bachelor of Arts in English Language' },
        ],
        cte: [
            { value: 'beed', label: 'Bachelor of Elementary Education' },
            { value: 'bsed', label: 'Bachelor of Secondary Education' },
            { value: 'bped', label: 'Bachelor of Physical Education' },
            { value: 'btvted', label: 'Bachelor of Technical-Vocational Teacher Education' },
        ],
    }

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>

                <IonHeader>
                    <IonToolbar className='adjust-background'>
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

                        {/* COOLDOWN WARNING */}
                        {!canUpdateProfile && (
                            <IonRow>
                                <IonRow>
                                    <IonCol>
                                        <div className='profile-message-details'>
                                            <IonIcon icon={informationCircleOutline} size='large' slot='start' />
                                            <IonText>
                                                <p className='profile-message-text'>
                                                    You cannot update your profile for <strong>{daysUntilNextUpdate} day(s)</strong>. 
                                                    Profile updates are allowed once every 7 days.
                                                </p>
                                            </IonText>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonRow>
                        )}

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonInput
                                    type='text'
                                    label='First Name'
                                    labelPlacement='floating'
                                    fill='outline'
                                    value={firstname}
                                    onIonChange={(e) => setFirstname(e.detail.value!)}
                                    disabled={!canUpdateProfile}
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
                                    disabled={!canUpdateProfile}
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
                                    disabled={!canUpdateProfile}
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
                                    disabled={!canUpdateProfile}
                                    required
                                />
                            </IonCol>
                            <IonCol>
                                <IonSelect 
                                    label='Gender' 
                                    labelPlacement='floating'
                                    value={gender}
                                    onIonChange={(e) => setGender(e.detail.value!)}
                                    disabled={!canUpdateProfile}
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
                                    disabled={!canUpdateProfile}
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
                                    onIonChange={(e) => {
                                        setDepartment(e.detail.value!)
                                        setCourse('') 
                                    }}
                                    disabled={!canUpdateProfile}
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
                                    disabled={!canUpdateProfile || !department}
                                >
                                    {department && departmentCourses[department]?.map((c) => (
                                        <IonSelectOption key={c.value} value={c.value}>{c.label}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonButton
                                    expand='block'
                                    onClick={handleUpdateProfile}
                                    disabled={loading || loadingData || !canUpdateProfile}
                                >
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