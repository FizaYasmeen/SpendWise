import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex items-center justify-between relative'>
        <div>
             <h2 className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-indigo-600'>“Spending smart is the new flex” </h2>
        </div>
        <div>
            <UserButton />
         </div>
    </div>
  )
}

export default DashboardHeader