import React from 'react'

/**
 * Detects URLs in text and converts them to clickable links
 * @param text - The text to process
 * @returns React elements with linkified URLs
 */
export const linkifyText = (text: string): React.ReactNode => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w\-._~:?#[\]@!$&'()*+,;=]*)?)/gi
    
    // Split text by URLs
    const parts = text.split(urlRegex).filter(Boolean)
    
    return (
        <>
            {parts.map((part, index) => {
                // Check if the part is a URL
                if (part && (part.match(/^https?:\/\//i) || part.match(/^www\./i) || part.match(/^[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i))) {
                    // Ensure URL has protocol
                    let url = part
                    if (!url.match(/^https?:\/\//i)) {
                        url = 'https://' + url
                    }
                    
                    return (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#3880ff',
                                textDecoration: 'underline',
                                wordBreak: 'break-all'
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            {part}
                        </a>
                    )
                }
                
                return <span key={index}>{part}</span>
            })}
        </>
    )
}

/**
 * Simple version that returns linkified text as string with HTML
 * @param text - The text to process
 * @returns HTML string with linkified URLs
 */
export const linkifyTextHTML = (text: string): string => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w\-._~:?#[\]@!$&'()*+,;=]*)?)/gi
    
    return text.replace(urlRegex, (url) => {
        let href = url
        if (!url.match(/^https?:\/\//i)) {
            href = 'https://' + url
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #3880ff; text-decoration: underline; word-break: break-all;">${url}</a>`
    })
}
