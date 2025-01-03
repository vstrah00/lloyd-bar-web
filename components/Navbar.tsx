import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signIn, signOut} from '@/auth';

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-white shadow-md pb-2 px-5">
      <nav className="flex justify-between items-center">
        <div className='flex items-center gap-5'>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={150} height={50} />
          </Link>
        </div>

      <div className='flex items-center gap-5 text-black'>
        {session && session?.user ? (
          <>
            <Link href="/startup/create">
              <span>Create</span>
            </Link>

            <form action={async () => {
              "use server";

              await signOut({redirectTo:"/"});
            }}>
              <button type="submit">
                <span>Logout</span>
              </button>
            </form>
            
            <Link href={`/user/${session?.id}`}>
              <span>{session?.user?.name}</span>
            </Link>
          </>
        ): (
          <form action={async () => {
            "use server";

            await signIn('github');
          }}>
            <button type="submit">
              <span>Login</span>
            </button>
          </form>
        )}
      </div>
      </nav>
    </header>
  );
};

export default Navbar;
