"use client"

import React from 'react';
import Image from "next/image";
import { useUser, UserButton } from '@clerk/nextjs';


function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-5xl'>
        <Image src={'./logo.svg'}
        alt = 'logo'
        width = {200}
        height = {270}
        />
       

        { isSignedIn?
        <UserButton/> : 
        <a
          className="inline-block text-base rounded-3xl border-4 border-indigo-600 bg-indigo-600 px-4 py-1 font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="/sign-in"
        >
          Sign In
        </a>
        }
        
    </div>
  )
}

export default Header