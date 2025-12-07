import React, { useState } from 'react'

import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton
} from '@ionic/react'

import {
    peopleOutline
} from 'ionicons/icons'

import ListGroup from '../../components/community/ListGroup'
import ViewGroup from '../../components/community/ViewGroup'

const CommunityPage = () => {
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

    const handleViewGroup = (groupId: number) => {
        setSelectedGroupId(groupId)
        setShowViewModal(true)
    }

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar className='home-header-bg'>
                        <IonTitle>
                            Community
                        </IonTitle>
                        <IonButton
                            slot='end'
                            fill='clear'
                        >
                            <IonIcon icon={peopleOutline} className='community-icon' />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <ListGroup onViewGroup={handleViewGroup} />
                </IonContent>
            </IonPage>

            <ViewGroup
                isOpen={showViewModal}
                onDidDismiss={() => {
                    setShowViewModal(false)
                    setSelectedGroupId(null)
                }}
                groupId={selectedGroupId}
            />
        </>
    )
}

export default CommunityPage