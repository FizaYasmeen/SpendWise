"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import { usePathname, useRouter  } from 'next/navigation';

function SideNav() {
  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { id: 2, name: 'Budget', icon: PiggyBank, path: '/dashboard/budgets' },
    { id: 3, name: 'Expenses', icon: ReceiptText, path: '/dashboard/expenses' },
    { id: 4, name: 'Upgrade', icon: ShieldCheck, path: '/dashboard/upgrade' },
  ];

  const {user,isSignedIn, isLoaded} = useUser();
  const path = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  // Update path only on client to avoid hydration mismatch
  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

      
      const HomePage = () => {
          if (isSignedIn) {
              router.push("/");
          }
      };

  return (
    <div className='p-5 mb-6 h-screen border shadow-sm'>
      <Image
        src={'/logo.svg'}
        alt='logo'
        width={160}
        height={170}
      />

      <div className='mt-5'>
        {menuList.map((menu) => (
          
            <h2 key={menu.id}
            onClick={() => router.push(menu.path)}
              className={`flex gap-2 items-center mb-2 text-gray-500 font-medium p-5 cursor-pointer rounded-md
                hover:text-indigo-600 hover:bg-blue-100 ${
                  currentPath === menu.path ? 'text-indigo-600 bg-blue-100' : ''
                }`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          
        ))}
      </div>

      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <UserButton />
        <div>
        <h3 className='font-semibold text-1xl text-indigo-700 cursor-pointer' onClick={HomePage}> {user?.fullName} </h3>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
