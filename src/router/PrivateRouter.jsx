import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRouter = ({ children }) => {
  const location = useLocation()

  const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
    if (match) return match[2]
    return null
  }

  const token = getTokenFromCookie()

  if (token) {
    return children
  }

  return <Navigate to='/login' state={{ from: location }} replace />
}

export default PrivateRouter

//i will not be needing this since only admin can login no other user can login
