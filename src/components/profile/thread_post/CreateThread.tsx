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
    IonCol
} from '@ionic/react'

// icons
import {
    arrowForwardOutline
} from 'ionicons/icons'

const CreateThread = () => {
    return (
        <IonModal>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Thread</IonTitle>
                    <IonButton
                        slot='end'
                        fill='clear'
                    >
                        <IonIcon size='large' icon={arrowForwardOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
        </IonModal>
    )
}