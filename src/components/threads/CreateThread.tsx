import React, { useState } from 'react'

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
    IonItem,
    IonLabel,
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
import { createThreadPost } from '../../services/ThreadService'

interface CreateThreadProps {
    isOpen: boolean 
    onDidDismiss: () => void
    onThreadCreated?: () => void
}

const CreateThread: React.FC<CreateThreadProps> = ({
    isOpen,
    onDidDismiss,
    onThreadCreated
}) => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [threadType, setThreadType] = useState('general')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const handleCreateThreadPost = async () => {
        
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

        setLoading(true)

        // create post 
        try {
            await createThreadPost(title, content, threadType, image || undefined)
            setToastMessage('Thread post created')
            setShowToast(true)

            // reset form after
            setTitle('')
            setContent('')
            setThreadType('general')
            setImage(null)
            setImagePreview(null)

            // calback ni bai 
            if (onThreadCreated) {
                onThreadCreated()
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
                setToastMessage(error.error || 'Failed to create thread')
            }
            
            setShowToast(true)
        }

    }

    const handleCancelThreadPost = () => {
        setTitle('')
        setContent('')
        setThreadType('general')
        setImage(null)
        setImagePreview(null)
        onDidDismiss()
    }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {

            // -- VALIDATED FILE SIZE -- 
            if (file.size > 5 * 1024 * 1024) {
                setToastMessage('Image size should be less than 5MB')
                setShowToast(true)
                return
            }

            setImage(file)

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
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Thread</IonTitle>
                    <IonButton
                        slot='end'
                        fill='clear'
                        onClick={handleCancelThreadPost}
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
                                    fill='outline'
                                    type='text'
                                    label='Title'
                                    labelPlacement='floating'
                                    placeholder='Write your title here'
                                    maxlength={255}
                                    counter={true}
                                    value={title}
                                    onIonInput={(e) => setTitle(e.detail.value!)}
                                />
                        </IonCol>
                    </IonRow>

                    <IonRow className='ion-margin-top'> 
                        <IonCol>
                            <IonSelect 
                                label="Thread Type" 
                                labelPlacement="floating" 
                                fill="outline"
                                value={threadType}
                                onIonChange={(e) => setThreadType(e.detail.value)}
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

                    <IonRow className='ion-margin-top'>
                        <IonCol>
                                <IonTextarea
                                    fill='outline'
                                    label='Content'
                                    labelPlacement='floating'
                                    placeholder='Write your thread content here...'
                                    rows={4}
                                    autoGrow={true}
                                    maxlength={5000}
                                    counter={true}
                                    value={content}
                                    onIonInput={(e) => setContent(e.detail.value!)}
                                />
                        </IonCol>
                    </IonRow>

                    <IonRow className='ion-margin-top'>
                        <IonCol>
                            <IonButton 
                                expand='block'
                                fill='outline'
                                color='medium'
                                onClick={() => document.getElementById('thread-image-input')?.click()}
                            >
                                <IonIcon icon={imageOutline} slot='start' />
                                {image ? 'Change image' : 'Add image'}
                            </IonButton>
                            <input
                                id='thread-image-input'
                                type='file'
                                accept='image/*'
                                className='thread-image-input'
                                onChange={handleImageSelect}
                            />
                        </IonCol>
                    </IonRow>

                    {imagePreview && (
                        <IonRow className='ion-marhin-top'>
                            <IonCol>
                                <div className="thread-image-preview">
                                    <IonImg src={imagePreview} alt='Preview' />
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
                                onClick={handleCreateThreadPost}
                            >
                                Publish
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton
                                expand='block'
                                fill='outline'
                                color='danger'
                                onClick={handleCancelThreadPost}
                            >
                                Cancel
                            </IonButton>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </IonContent>

            <IonLoading
                isOpen={loading}
                message='Creating thread post...'
                spinner='dots'
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                duration={2000}
                position='top'
            />

        </IonModal>
    )
}

export default CreateThread