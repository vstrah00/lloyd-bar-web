// app/[locale]/blog/[id]/page.tsx (Server Component)

import BlogContent from "@/components/BlogContent";
import ImageWithContent from "@/components/ImageWithContent";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY } from "@/sanity/lib/queries";
import markdownit from "markdown-it";
import { notFound } from "next/navigation";

const md = markdownit();

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { id, locale } = await params;

  // Fetch the post from Sanity
  const post = await client.fetch(BLOG_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const lang = locale || "en";
  const title = post.title?.[lang] || post.title?.en || "No Title";
  const imageSrc = post.image || "/bg1-mobile.webp";
  const description = post.description?.[lang] || post.description?.en || "No Description";
  const category = post.category?.[lang] || post.category?.en || "Uncategorized";
  const pitchContent = post.pitch?.[lang] || post.pitch?.en || "";

  // Convert markdown to HTML
  const parsedContent = md.render(pitchContent);

  // Pass data as props to the client component
  return (
    <>
      {/* Blog Post Content */}
      <section className='mt-[140px]'>
        <ImageWithContent
          imageSrc={imageSrc}
          title={title}
          description={description}
          useUnoptimized={true}
        />

      <BlogContent category={category} content={parsedContent} />

      </section>
    </>
  );
}
