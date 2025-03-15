import React, { Suspense } from 'react'

function layout({ children }) {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
  )
}

export default layout