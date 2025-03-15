'use client';
import { SessionProvider } from 'next-auth/react'
import './global.css'



function layouts({ children }) {
  return (
              <SessionProvider>
      <html> 
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        </head>
        <body className={"  place-items-center flex flex-row relative w-screen h-screen" }> 

              {children}
                  
                  
             
                
          </body>
     </html>
          </SessionProvider>
  )
}

export default layouts
