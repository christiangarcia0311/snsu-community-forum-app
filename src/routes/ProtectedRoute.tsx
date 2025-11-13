import { Redirect, Route } from 'react-router-dom'


interface ProtectedRouteProps {
  component: React.ComponentType<any>
  path: string
  exact?: boolean
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('access_token')

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? <Component {...props} /> : <Redirect to='/auth/signin' />
            }
        />
    )
}

export default ProtectedRoute
