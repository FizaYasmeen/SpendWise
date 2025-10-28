import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';

export default function Page() {
  
 return (
    <div className="flex h-screen">
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
         <div>
             <Image src={'./wallet_.svg'}
                    alt = 'logo'
                    width = {500}
                    height = {280}
                    />
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full bg-white lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-bold mb-4 text-black-600 text-center">
            Sign In
          </h1>

          
          <SignIn />

         
        </div>
      </div>
    </div>
  );
}
