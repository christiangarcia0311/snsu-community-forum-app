import React, { useEffect, useCallback } from 'react'

import {
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner
    ,IonRefresher, IonRefresherContent
} from '@ionic/react'
import type { RefresherEventDetail } from '@ionic/core'

interface RssItem {
    title: string
    link: string
    contentSnippet: string
    pubDate?: string
}

const parseRssXml = (xmlText: string): RssItem[] => {
    const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
    const items: RssItem[] = []
    const itemNodes = doc.querySelectorAll('item')
    itemNodes.forEach((node) => {
        const title = node.querySelector('title')?.textContent || ''
        const link = node.querySelector('link')?.textContent || ''
        const description = node.querySelector('description')?.textContent || ''
        const pubDate = node.querySelector('pubDate')?.textContent || ''
        items.push({ title, link, contentSnippet: description, pubDate })
    })
    return items
}

const CampusFeed: React.FC = () => {
    const [posts, setPosts] = React.useState<RssItem[]>([])
    const [loading, setLoading] = React.useState(true)

    const RSS_URL = 'https://rss.app/feeds/RGT8Jxv8bnTo6c9I.xml'

    const fetchRSS = useCallback(async () => {
        try {
            const rssText = await fetch(RSS_URL).then(res => res.text())
            const items = parseRssXml(rssText)
            setPosts(items)
        } catch (err) {
            console.error('RSS fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [RSS_URL])

    useEffect(() => {
        fetchRSS()
    }, [fetchRSS])

    const doRefresh = async (event: CustomEvent<RefresherEventDetail>) => {

        setLoading(true)
        await fetchRSS()
        event.detail.complete()
    }

    const adjustImageStyles = (html: string) => {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html')
            const imgs = doc.querySelectorAll('img')
            imgs.forEach(img => {
                const prev = img.getAttribute('style') || ''
                const ensure = 'max-width:100%;height:auto;display:block;'
                // If style already contains max-width, don't duplicate; otherwise append
                if (!/max-width\s*:\s*100%/.test(prev)) {
                    const newStyle = (prev ? prev + ';' : '') + ensure
                    img.setAttribute('style', newStyle)
                }
            })
            return doc.body.innerHTML
        } catch {
            return html.replace(/<img(?![^>]*style=)([^>]*)>/gi, `<img$1 style="max-width:100%;height:auto;display:block;">`)
        }
    }

    return (
        <>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={(e) => doRefresh(e as CustomEvent<RefresherEventDetail>)}>
                    <IonRefresherContent pullingText="Pull to refresh" refreshingSpinner="circles" />
                </IonRefresher>
                {
                    loading ? (
                        <div className='ion-text-center'>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : (
                        posts.map((post, idx) => (
                            <IonCard key={idx} className='adjust-background home-thread-post'>
                                <IonCardHeader>
                                    <IonCardTitle>{post.title}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <div dangerouslySetInnerHTML={{ __html: adjustImageStyles(post.contentSnippet) }}></div>
                                    {
                                        post.link && (
                                            <a
                                                href={post.link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                View Full Post
                                            </a>
                                        )
                                    }
                                </IonCardContent>
                            </IonCard>
                        ))
                    )
                }
            </IonContent>
        </>
    )
}

export default CampusFeed