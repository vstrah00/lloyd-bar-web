import React from 'react';
import Link from 'next/link';
import { auth, signIn, signOut } from '@/auth';

const LoginSignout = async () => {
  const session = await auth();

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 p-4 text-black md:justify-between md:gap-8">
      {session && session.user ? (
        <>
          <Link href={`/user/${session.user.email}`}>
            <span className="navbar-item hover:border-transparent">
              {session.user.name}
            </span>
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="navbar-item bg-gray-300 px-4 py-2 text-black focus:ring-2 focus:ring-red-300 md:text-base"
            >
              Logout
            </button>
          </form>

        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="navbar-item bg-primary-100 px-4 py-2 text-black focus:ring-2 focus:ring-red-300 md:text-base"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginSignout;
