import React, { useState, useEffect } from 'react'

import {
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonImg,
    IonLabel,
    IonButton,
    IonSpinner,
    IonText,
    IonBadge,
    IonIcon,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react'

import {
    lockClosedOutline,
    peopleOutline,
} from 'ionicons/icons'

import Banner from '../../assets/images/banner.jpeg'

import { getAllCommunityGroup } from '../../services/CommunityService'

interface CommunityGroup {
    id: number
    name: string
    description: string
    image: string | null
    created_by_username: string
    created_by_profile: any
    member_count: number
    is_member: boolean
    is_private: boolean
    user_role: string | null
}

interface ListGroupProps {
    onViewGroup: (groupId: number) => void
}

const ListGroup: React.FC<ListGroupProps> = ({ onViewGroup }) => {
    const [communities, setCommunities] = useState<CommunityGroup[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCommunities()
    }, [])

    const fetchCommunities = async () => {
        setLoading(true)
        try {
            const data = await getAllCommunityGroup()
            setCommunities(data)
        } catch (error: any) {
            console.error('Failed to fetch communities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async (event: CustomEvent) => {
        await fetchCommunities()
        event.detail.complete()
    }

    if (loading) {
        return (
            <div className='ion-text-center ion-padding'>
                <IonSpinner />
                <p>Loading communities...</p>
            </div>
        )
    }

    if (communities.length === 0) {
        return (
            <div className='ion-text-center ion-padding'>
                <IonIcon icon={peopleOutline} className='community-empty-icon' color='medium' />
                <IonText>
                    <h2>No Communities Yet</h2>
                    <p>Be the first to create a community!</p>
                </IonText>
            </div>
        )
    }

    return (
        <>
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent
                    pullingText="Pull to refresh"
                    refreshingSpinner="circles"
                    refreshingText="Refreshing..."
                />
            </IonRefresher>

            {communities.map((community) => (
                <IonCard key={community.id} className='adjust-background community-lists'>
                    <IonImg 
                        src={community.image || Banner} 
                        alt={community.name}
                        className='community-banner-image'
                    />
                    <IonCardContent>
                        <IonLabel>
                            <h1>
                                {community.name}
                                {community.is_private && (
                                    <IonIcon 
                                        icon={lockClosedOutline} 
                                        className='community-private-icon'
                                        color='warning'
                                    />
                                )}
                                {community.is_member && (
                                    <IonBadge 
                                        color='success' 
                                        className='community-member-badge'
                                    >
                                        Member
                                    </IonBadge>
                                )}
                            </h1>
                            <p>
                                {community.description.length > 100
                                    ? `${community.description.substring(0, 100)}...`
                                    : community.description}
                            </p>
                            <small>
                                {community.member_count} members
                            </small>
                        </IonLabel>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonButton
                                        expand='block'
                                        onClick={() => onViewGroup(community.id)}
                                    >
                                        View Group
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    )
}

export default ListGroup