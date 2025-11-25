import React from 'react'
import { Redirect, Route } from 'react-router-dom'

interface PublicRouteProps {
    component: React.ComponentType<any>
    path: string
    exact?: boolean
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('access_token')

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? <Redirect to='/tabs/home' /> : <Component {...props} />
            }
        />
    )
}

export default PublicRoute