
import '../global.css'
import SessionLoader from './SessionLoader'


export const metadata = {
    title: 'chatBot',
  description: 'Generated by create next app',
  icons: {
    icon: "/favicon.ico",
  },
}
function layouts({ children }) {

  return (
    <>
      <SessionLoader>
     {children}
      </SessionLoader>
  
      </>
    
  )
}

export default layouts
