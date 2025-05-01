import ImageWithContent from '@/components/ImageWithContent'
import React from 'react'
import { useTranslations } from "next-intl";


const Page = () => {

  const tComingSoon = useTranslations("ComingSoon");

  return (
    <>
      <section className='mt-[90px] md:mt-[140px]'>
        <ImageWithContent
          imageSrc="/bg1-mobile.webp"
          title={tComingSoon("heading")}
          description={tComingSoon("subheading")}
        />
      </section>
    </>
  )
}

export default Page