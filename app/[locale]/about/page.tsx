import ImageWithContent from '@/components/ImageWithContent'
import React from 'react'
import { useTranslations } from "next-intl";


const Page = () => {

  const tAbout = useTranslations("About");

  return (
    <>
      <section className='mt-[90px] md:mt-[140px]'>
        <ImageWithContent
          imageSrc="/bg1-mobile.webp"
          title={tAbout("heading")}
          description={tAbout("subheading")}
        />
      </section>
    </>
  )
}

export default Page