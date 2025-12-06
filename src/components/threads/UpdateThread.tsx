import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonInput,
    IonTextarea,
    IonLoading,
    IonToast,
    IonSelect,
    IonSelectOption
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    closeCircle,
    imageOutline
} from 'ionicons/icons'

// services 
import { updateThreadPost, getThreadPostById } from '../../services/ThreadService'

interface UpdateThreadProps {
    isOpen: boolean 
    onDidDismiss: () => void
    onThreadUpdated?: () => void
    threadId: number | null
}

const UpdateThread: React.FC<UpdateThreadProps> = ({
    isOpen,
    onDidDismiss,
    onThreadUpdated,
    threadId
}) => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [threadType, setThreadType] = useState('general')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [existingImage, setExistingImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        if (isOpen && threadId) {
            fetchThreadData()
        }
    }, [isOpen, threadId])

    const fetchThreadData = async () => {
        if (!threadId) return

        setLoadingData(true)

        try {
            const data: any = await getThreadPostById(threadId)
            setTitle(data.title)
            setContent(data.content)
            setThreadType(data.thread_type || 'general')

            if (data.image) {
                setExistingImage(data.image)
            }
        } catch (error: any) {
            console.error('Failed to fetch thread:', error)
            setToastMessage('Failed to load thread data')
            setShowToast(true)
        } finally {
            setLoadingData(false)
        }
    }

    const handleUpdateThreadPost = async () => {
        
        // -- VALIDATION --
        if (!title.trim() || !content.trim()) {
            setToastMessage('Please fill in title and content')
            setShowToast(true)
            return
        }
        
        if (title.trim().length < 10) {
            setToastMessage('Title must be at least 10 characters long')
            setShowToast(true)
            return
        }

        if (content.trim().length < 20) {
            setToastMessage('Content must be at least 20 characters long')
            setShowToast(true)
            return
        }

        if (!threadId) return

        setLoading(true)

        try {
            await updateThreadPost(threadId, title, content, threadType, image || undefined)
            setToastMessage('Thread post updated successfully')
            setShowToast(true)

            // reset form
            setTitle('')
            setContent('')
            setThreadType('general')
            setImage(null)
            setImagePreview(null)
            setExistingImage(null)

            if (onThreadUpdated) {
                onThreadUpdated()
            }

            setTimeout(() => {
                setLoading(false)
                onDidDismiss()
            }, 2000)
        } catch (error: any) {
            setLoading(false)

            if (error.title) {
                setToastMessage(error.title[0])
            } else if (error.content) {
                setToastMessage(error.content[0])
            } else {
                setToastMessage(error.error || 'Failed to update thread')
            }
            
            setShowToast(true)
        }
    }

    const handleCancelUpdate = () => {
        setTitle('')
        setContent('')
        setThreadType('general')
        setImage(null)
        setImagePreview(null)
        setExistingImage(null)
        onDidDismiss()
    }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            // -- VALIDATE FILE SIZE -- 
            if (file.size > 5 * 1024 * 1024) {
                setToastMessage('Image size should be less than 5MB')
                setShowToast(true)
                return
            }

            // -- VALIDATE FILE TYPE --
            if (!file.type.startsWith('image/')) {
                setToastMessage('Please select a valid image file')
                setShowToast(true)
                return
            }

            setImage(file)
            setExistingImage(null)

            // -- PREVIEW --
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
        setImagePreview(null)
        setExistingImage(null)
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Update Thread</IonTitle>
                    <IonButton
                        slot='end'
                        fill='clear'
                        onClick={handleCancelUpdate}
                    >
                        <IonIcon size='large' icon={arrowForwardOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid className='ion-padding'>

                    <IonRow>
                        <IonCol>
                            <IonInput
                                type='text'
                                label='Title'
                                labelPlacement='floating'
                                placeholder='Write your title here'
                                maxlength={255}
                                counter={true}
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value!)}
                                disabled={loadingData}
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow className='ion-margin-top'>
                        <IonCol>
                            <IonTextarea
                                label='Content'
                                labelPlacement='floating'
                                placeholder='Write your thread content here...'
                                rows={4}
                                autoGrow={true}
                                maxlength={5000}
                                counter={true}
                                value={content}
                                onIonInput={(e) => setContent(e.detail.value!)}
                                disabled={loadingData}
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow className='ion-margin-top'>
                        <IonCol>
                            <IonButton 
                                expand='block'
                                fill='outline'
                                color='medium'
                                onClick={() => document.getElementById('update-thread-image-input')?.click()}
                                disabled={loadingData}
                            >
                                <IonIcon icon={imageOutline} slot='start' />
                                {(image || existingImage) ? 'Change image' : 'Add image'}
                            </IonButton>
                            <input
                                id='update-thread-image-input'
                                type='file'
                                accept='image/*'
                                className='thread-image-input'
                                onChange={handleImageSelect}
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol>
                            <IonSelect 
                                label="Thread Type" 
                                labelPlacement="floating" 
                                fill="outline"
                                value={threadType}
                                onIonChange={(e) => setThreadType(e.detail.value)}
                                disabled={loadingData}
                            >
                                <IonSelectOption value="general">General</IonSelectOption>
                                <IonSelectOption value="discussion">Discussion</IonSelectOption>
                                <IonSelectOption value="question">Question</IonSelectOption>
                                <IonSelectOption value="guide">Guide</IonSelectOption>
                                <IonSelectOption value="announcement">Announcement</IonSelectOption>
                                <IonSelectOption value="accomplishment">Accomplishment</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    </IonRow>

                    {(imagePreview || existingImage) && (
                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <div className="thread-image-preview">
                                    <IonImg 
                                        src={imagePreview || existingImage!} 
                                        alt='Preview' 
                                    />
                                    <IonButton
                                        fill='clear'
                                        color='danger'
                                        className='thread-button-preview'
                                        onClick={handleRemoveImage}
                                    >
                                        <IonIcon icon={closeCircle} />
                                    </IonButton>
                                </div>
                            </IonCol>
                        </IonRow>
                    )}

                    <IonRow className='ion-margin-top'>
                        <IonCol>
                            <IonButton
                                expand='block'
                                onClick={handleUpdateThreadPost}
                                disabled={loading || loadingData}
                            >
                                Update Thread
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton
                                expand='block'
                                fill='outline'
                                color='danger'
                                onClick={handleCancelUpdate}
                                disabled={loading || loadingData}
                            >
                                Cancel
                            </IonButton>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </IonContent>

            <IonLoading
                isOpen={loadingData}
                message='Loading thread data...'
                spinner='dots'
            />

            <IonLoading
                isOpen={loading}
                message='Updating thread post...'
                spinner='dots'
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                position='top'
            />

        </IonModal>
    )
}

export default UpdateThread