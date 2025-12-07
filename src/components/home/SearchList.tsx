import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonText,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonBadge,
    IonSelect,
    IonSelectOption,
    IonInfiniteScroll,
    IonInfiniteScrollContent
} from '@ionic/react'

// icons
import {
    closeOutline,
    personOutline,
    documentTextOutline,
    heartOutline,
    chatbubbleOutline,
    funnelOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../../assets/images/profile.png'

// services
import { getAllUsers } from '../../services/AuthService'
import { getAllThreadPost } from '../../services/ThreadService'

interface SearchListProps {
    isOpen: boolean
    onDidDismiss: () => void
    onViewUserProfile: (userProfile: any) => void
    onViewThread: (threadId: number) => void
}

interface UserData {
    username: string
    email: string
    firstname: string
    lastname: string
    profile_image_url?: string | null
    role: string
    department: string
}

interface ThreadData {
    id: number
    title: string
    content: string
    thread_type: string
    image: string | null
    created_at: string
    author_username?: string
    author_profile?: any
    likes_count?: number
    comments_count?: number
    is_liked?: boolean
}

const THREAD_TYPES = [
    { value: 'all', label: 'All Types' },
    { value: 'general', label: 'General' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'question', label: 'Question' },
    { value: 'guide', label: 'Guide' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'accomplishment', label: 'Accomplishment' }
]

const THREADS_PER_PAGE = 10

const SearchList: React.FC<SearchListProps> = ({
    isOpen,
    onDidDismiss,
    onViewUserProfile,
    onViewThread
}) => {

    const [searchText, setSearchText] = useState('')
    const [selectedSegment, setSelectedSegment] = useState<string>('threads')
    const [selectedThreadType, setSelectedThreadType] = useState<string>('all')
    
    const [users, setUsers] = useState<UserData[]>([])
    const [threads, setThreads] = useState<ThreadData[]>([])
    
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
    const [filteredThreads, setFilteredThreads] = useState<ThreadData[]>([])
    const [displayedThreads, setDisplayedThreads] = useState<ThreadData[]>([])
    
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMoreThreads, setHasMoreThreads] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    useEffect(() => {
        filterUsers()
    }, [searchText, users])

    useEffect(() => {
        filterThreads()
    }, [searchText, selectedThreadType, threads])

    useEffect(() => {
        loadInitialThreads()
    }, [filteredThreads])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersData, threadsData] = await Promise.all([
                getAllUsers(),
                getAllThreadPost()
            ])
            
            setUsers(usersData.users || [])
            setFilteredUsers(usersData.users || [])
            
            setThreads(threadsData)
            setFilteredThreads(threadsData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        if (searchText.trim() === '') {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter(user =>
                user.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.role.toLowerCase().includes(searchText.toLowerCase()) ||
                user.department.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }

    const filterThreads = () => {
        let filtered = threads

        // Filter by search text
        if (searchText.trim() !== '') {
            filtered = filtered.filter(thread =>
                thread.title.toLowerCase().includes(searchText.toLowerCase()) ||
                thread.content.toLowerCase().includes(searchText.toLowerCase()) ||
                thread.author_username?.toLowerCase().includes(searchText.toLowerCase()) ||
                thread.author_profile?.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
                thread.author_profile?.lastname?.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Filter by thread type
        if (selectedThreadType !== 'all') {
            filtered = filtered.filter(thread => thread.thread_type === selectedThreadType)
        }

        setFilteredThreads(filtered)
        setCurrentPage(1)
    }

    const loadInitialThreads = () => {
        const initial = filteredThreads.slice(0, THREADS_PER_PAGE)
        setDisplayedThreads(initial)
        setHasMoreThreads(filteredThreads.length > THREADS_PER_PAGE)
        setCurrentPage(1)
    }

    const loadMoreThreads = (event: any) => {
        setTimeout(() => {
            const nextPage = currentPage + 1
            const startIndex = currentPage * THREADS_PER_PAGE
            const endIndex = startIndex + THREADS_PER_PAGE
            const moreThreads = filteredThreads.slice(startIndex, endIndex)

            if (moreThreads.length > 0) {
                setDisplayedThreads([...displayedThreads, ...moreThreads])
                setCurrentPage(nextPage)
            }

            setHasMoreThreads(endIndex < filteredThreads.length)
            event.target.complete()
        }, 500)
    }

    const handleUserClick = (user: UserData) => {
        onViewUserProfile(user)
        handleClose()
    }

    const handleThreadClick = (threadId: number) => {
        onViewThread(threadId)
        handleClose()
    }

    const handleClose = () => {
        setSearchText('')
        setSelectedSegment('threads')
        setSelectedThreadType('all')
        setCurrentPage(1)
        setDisplayedThreads([])
        onDidDismiss()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) return 'Just now'
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
            <IonHeader>
                <IonToolbar className='adjust-background'>
                    <IonTitle>Search</IonTitle>
                    <IonButton
                        slot='end'
                        fill='clear'
                        onClick={handleClose}
                    >
                        <IonIcon icon={closeOutline} size='large' />
                    </IonButton>
                </IonToolbar>

                <IonToolbar className='adjust-background'>
                    <IonGrid>
                        <IonRow className='ion-align-items-center'>
                            <IonCol size='10'>
                                <IonSearchbar
                                    value={searchText}
                                    onIonInput={(e) => setSearchText(e.detail.value || '')}
                                    placeholder='Search users, threads, or topics...'
                                    showClearButton='always'
                                    animated
                                />
                            </IonCol>
                            <IonCol size='2'>
                                <IonSelect
                                    value={selectedThreadType}
                                    onIonChange={(e) => setSelectedThreadType(e.detail.value)}
                                    interface='popover'
                                    placeholder='Filter'
                                >
                                    {THREAD_TYPES.map((type) => (
                                        <IonSelectOption key={type.value} value={type.value}>
                                            {type.label}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
 
            </IonHeader>

            <IonContent>
                {/* Segment Control */}
                <div className='ion-padding'>
                    <IonSegment
                        value={selectedSegment}
                        onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
                    >
                        <IonSegmentButton value='threads'>
                            <IonLabel>
                                <p>Threads</p>
                            </IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value='users'>
                            <IonLabel>
                                <p>Users</p>
                            </IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>

                {loading ? (
                    <div className='ion-text-center ion-padding'>
                        <IonSpinner />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {selectedSegment === 'users' && (
                            <div>
                                {filteredUsers.length === 0 ? (
                                    <div className='ion-text-center ion-padding'>
                                        <IonIcon
                                            icon={personOutline}
                                            style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }}
                                        />
                                        <IonText>
                                            <h3>No users found</h3>
                                            <p>Try a different search term</p>
                                        </IonText>
                                    </div>
                                ) : (
                                    <div>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <p className='search-result-count'>
                                                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                                                </p>
                                            </IonLabel>
                                        </IonItem>
                                        {filteredUsers.map((user) => {
                                            const profilePicture = user.profile_image_url || photoDefault
                                            
                                            return (
                                                <IonItem
                                                    key={user.username}
                                                    button
                                                    onClick={() => handleUserClick(user)}
                                                    className='adjust-background'
                                                    lines='none'
                                                >
                                                    <IonAvatar slot='start'>
                                                        <img src={profilePicture} alt='profile' />
                                                    </IonAvatar>
                                                    <IonLabel>
                                                        <h2>{user.firstname} {user.lastname}</h2>
                                                        <p>
                                                            <small>{user.email}</small>
                                                        </p>
                                                    </IonLabel>
                                                </IonItem>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedSegment === 'threads' && (
                            <div>
                                {filteredThreads.length === 0 ? (
                                    <div className='ion-text-center ion-padding'>
                                        <IonIcon
                                            icon={documentTextOutline}
                                            style={{ fontSize: '64px', color: 'var(--ion-color-medium)' }}
                                        />
                                        <IonText>
                                            <h3>No threads found</h3>
                                            <p>Try a different search term or filter</p>
                                        </IonText>
                                    </div>
                                ) : (
                                    <div>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <p className='search-result-count'>
                                                    {filteredThreads.length} {filteredThreads.length === 1 ? 'thread' : 'threads'} found
                                                    {selectedThreadType !== 'all' && ` • ${THREAD_TYPES.find(t => t.value === selectedThreadType)?.label}`}
                                                </p>
                                            </IonLabel>
                                        </IonItem>
                                        
                                        <div className='search-threads-container'>
                                            {displayedThreads.map((thread) => {
                                                const profilePicture = thread.author_profile?.profile_image_url || photoDefault
                                                const authorName = thread.author_profile
                                                    ? `${thread.author_profile.firstname} ${thread.author_profile.lastname}`
                                                    : thread.author_username || 'Unknown User'

                                                return (
                                                    <IonCard
                                                        key={thread.id}
                                                        button
                                                        onClick={() => handleThreadClick(thread.id)}
                                                        className='home-thread-post search-thread-card'
                                                    >
                                                        <IonCardContent>
                                                            <IonGrid>
                                                                <IonRow className='ion-align-items-center'>
                                                                    <IonCol size='auto'>
                                                                        <IonAvatar className='home-post-avatar'>
                                                                            <img src={profilePicture} alt='profile' />
                                                                        </IonAvatar>
                                                                    </IonCol>
                                                                    <IonCol>
                                                                        <IonText>
                                                                            <h3 className='home-post-name'>
                                                                                {authorName}
                                                                                <IonBadge className='thread-post-badge'>
                                                                                    {thread.thread_type}
                                                                                </IonBadge>
                                                                            </h3>
                                                                        </IonText>
                                                                        <IonText>
                                                                            <p className='home-post-date'>
                                                                                <small>{formatDate(thread.created_at)}</small>
                                                                            </p>
                                                                        </IonText>
                                                                    </IonCol>
                                                                </IonRow>

                                                                <IonRow>
                                                                    <IonCol>
                                                                        <IonText>
                                                                            <h2>
                                                                                {thread.title}
                                                                            </h2>
                                                                        </IonText>
                                                                    </IonCol>
                                                                </IonRow>
                                                            </IonGrid>
                                                        </IonCardContent>
                                                    </IonCard>
                                                )
                                            })}
                                        </div>

                                        <IonInfiniteScroll
                                            onIonInfinite={loadMoreThreads}
                                            threshold="100px"
                                            disabled={!hasMoreThreads}
                                        >
                                            <IonInfiniteScrollContent
                                                loadingSpinner="bubbles"
                                                loadingText="Loading more threads..."
                                            />
                                        </IonInfiniteScroll>

                                        {!hasMoreThreads && displayedThreads.length > 0 && (
                                            <div className='search-end-message ion-text-center ion-padding'>
                                                <IonText color='medium'>
                                                    <p>You've reached the end</p>
                                                </IonText>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </IonContent>
        </IonModal>
    )
}

export default SearchList