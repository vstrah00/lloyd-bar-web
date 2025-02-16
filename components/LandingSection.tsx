import { ReactNode } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import LoginSignout from "./LoginSigonut";

const LandingSection = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-screen bg-cover bg-center bg-scroll z-0 border-8 border-black bg-clip-padding">
        <Image src="/bg1.jpg" alt="Background Image" layout="fill" objectFit="cover" />
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar>
          <LoginSignout />
        </Navbar>
      </div>

      {/* Content */}
      {/* Use margin-top to push content below navbar */}
      <div className="relative z-5 mt-[5rem] md:mt-[6rem] lg:mt-[7rem]">
        {children}
      </div>

    </div>
  );
};

export default LandingSection;
