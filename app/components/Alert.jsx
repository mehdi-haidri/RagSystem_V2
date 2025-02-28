import React from 'react'

function Alert({message  , type ,setAlert}) {
  return (
      <>
      <div role="alert" className={"alert "+type+" absolute z-50 top-10 left-1/2 -translate-x-1/2 w-fit "}>
              <svg
                  onClick={() => setAlert(null)}
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current rounded hover:bg-gray-300"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{message}</span>
</div></>
  )
}

export default Alert