import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { Route, useLocation, Navigate, Routes} from 'react-router-dom'

const ProtectedRoute = ({component:Component, exact , path})=>{

  const token = useSelector(state => state.clientToken || state.providerToken)

  const requestedPath = useLocation()

  const loginpage = requestedPath.pathname.search('client') > -1 ? 'login1' : 'provider-login1'

  const isAuthed = token ? true: false

  return (
      <Route
      exact={exact}
      path={path}
      render={(props)=>
      isAuthed
      ? <Component {...props}/>
      : <div>
          <Navigate to={{
            pathname:{loginpage},
            state:{requestedPath: requestedPath.pathname}
          }}/>
        </div>
      }
    />
  )

}

export default ProtectedRoute;