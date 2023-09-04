/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable-next-line no-unused-vars*/
import { createContext, useContext, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
const SOCKET_URL = process.env.SOCKET_IO_URL || 'https://backend.zizle.de'
const ConnectionContext = createContext()
export const ConnectionProvider = (props) => {
  const accessToken = localStorage.getItem('token')

  const socket =
    useMemo(() => {
      const socket = io(`${SOCKET_URL}`, { transports: ['websocket'], query: { token: accessToken } })
      return socket;
    }, [])



  useEffect(() => {
    socket.on('connect', () => {
    })
    socket.on('receiveMessage', (data) => {
    })

    return () => {
      socket.off('connect')
    }
  }, [socket])

  const value = {
    socket,
  }
  return (
    <>
      <ConnectionContext.Provider value={value} {...props} />
    </>
  )
}
export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider')
  }
  return context
}