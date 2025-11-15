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
    role: string
    department: string
    course: string
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
                    <p>{userProfile.role}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Course</h3>
                    <p>{userProfile.course.toUpperCase()}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Department</h3>
                    <p>{userProfile.department.toUpperCase()}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Gender</h3>
                    <p>{userProfile.gender}</p>
                </IonLabel>
            </IonItem>
            <IonItem lines='none' className='adjust-background'>
                <IonLabel>
                    <h3>Date Joined</h3>
                    <p>{new Date(userProfile.created_at).toLocaleDateString()}</p>
                </IonLabel>
            </IonItem>
        </>
    )
}

export default AboutProfile