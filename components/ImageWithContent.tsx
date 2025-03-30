"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithContentProps {
  imageSrc: string;
  title: string;
  description: string;
  reverse?: boolean; // ✅ Random only if not provided
  useUnoptimized?: boolean;
}

const ImageWithContent: React.FC<ImageWithContentProps> = ({
  imageSrc,
  title,
  description,
  reverse, // Now handled in useEffect
  useUnoptimized = false,
}) => {
  const [randomReverse, setRandomReverse] = useState(reverse);

  useEffect(() => {
    if (reverse === undefined) {
      setRandomReverse(Math.random() < 0.5);
    }
  }, [reverse]);

  return (
    <section className="w-full bg-gray-100 py-6 md:py-16 ">
      <div
        className={`container mx-auto flex flex-col lg:flex-row ${
          randomReverse ? "lg:flex-row-reverse" : ""
        } items-center px-6 lg:px-12`}
      >
        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-80 lg:h-[400px] relative rounded-xl overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            unoptimized={useUnoptimized}
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:pl-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">{title}</h2>
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ImageWithContent;
