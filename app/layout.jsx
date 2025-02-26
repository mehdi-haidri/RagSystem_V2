'use client';
import { SessionProvider } from 'next-auth/react'
import './global.css'



function layouts({ children }) {
  return (
              <SessionProvider>
      <html>
        <body className={"  place-items-center flex flex-row relative " }> 

              {children}
                  
                  
             
                
          </body>
     </html>
          </SessionProvider>
  )
}

export default layouts
