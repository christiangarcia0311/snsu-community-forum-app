import React from 'react'

import { 
    IonText,
    IonItem, 
    IonLabel 
} from '@ionic/react'



interface UserProfileData {
    username: string
    email: string
    firstname: string
    lastname: string
    birth_date: string
    gender: string
    gender_display: string
    role: string
    role_display: string 
    department: string
    department_display: string 
    course: string
    course_display: string 
    profile_image: string | null
    profile_image_url: string | null
    created_at: string
}

interface AboutProfileProps {
  userProfile: UserProfileData | null
}

const AboutProfile: React.FC<AboutProfileProps> = ({ userProfile }) => {
    
    if (!userProfile) {
        return (
            <IonText>
                <p>Loading information...</p>
            </IonText>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <>
            <br />
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3 className='profile-about'>Email</h3>
                    <p>{userProfile.email}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Role</h3>
                    <p>{userProfile.role_display}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Course</h3>
                    <p>{userProfile.course_display}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Department</h3>
                    <p>{userProfile.department_display}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Gender</h3>
                    <p>{userProfile.gender_display}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Date Joined</h3>
                    <p>{formatDate(userProfile.created_at)}</p>
                </IonLabel>
            </IonItem>
        </>
    )
}

export default AboutProfile