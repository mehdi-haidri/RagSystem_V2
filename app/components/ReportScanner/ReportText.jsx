import React from 'react'

function ReportText() {
  return (
      <>
          
<form>
   <div className="w-full mb-4 my-2 border border-gray-600 rounded-lg ">
       <div className="px-4 py-2  rounded-t-lg ">
           <label htmlFor="comment" className="sr-only"> Report </label>
           <textarea id="comment" rows="10" className="w-full px-0  outline-none font-semibold font-systemf text-lg  text-gray-200  border-0 focus:ring-0  bg-transparent" placeholder="Report..." required ></textarea>
       </div>
       <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
           <button type="submit" className="inline-flex items-center py-2.5 px-4 text-lg font-semibold text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200  hover:bg-red-800">
              Looks Good
           </button>
        
       </div>
   </div>
</form>
{/* <p className="ms-auto text-xs text-gray-500 dark:text-gray-400">Remember, contributions to this topic should follow our <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Community Guidelines</a>.</p> */}

      </>
  )
}

export default ReportText