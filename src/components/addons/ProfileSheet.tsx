import React from 'react'

import {
    IonActionSheet
} from '@ionic/react'

import {
    personCircleOutline,
    closeCircle
} from 'ionicons/icons'

interface UserProfileSheetProps {
    isOpen: boolean
    onDidDismiss: () => void
    onViewProfile: () => void
    userProfile: {
        firstname: string
        lastname: string
        email: string
        role_display: string
        department_display: string
        course_display: string
    } | null
}

const UserProfileSheet: React.FC<UserProfileSheetProps> = ({
    isOpen,
    onDidDismiss,
    onViewProfile,
    userProfile
}) => {
    
    if (!userProfile) return null

    return (
        <IonActionSheet
            isOpen={isOpen}
            onDidDismiss={onDidDismiss}
            header={`${userProfile.firstname} ${userProfile.lastname} - ${userProfile.role_display}`}
            subHeader={userProfile.email}
            buttons={[
                {
                    text: 'View Full Profile',
                    icon: personCircleOutline,
                    handler: () => {
                        onViewProfile()
                    }
                },
                {
                    text: 'Close',
                    icon: closeCircle,
                    role: 'cancel'
                }
            ]}
        />
    )
}

export default UserProfileSheet