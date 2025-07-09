import { BLOG_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import SearchForm from "@/components/SearchForm";
import BlogCard, { BlogTypeCard } from "@/components/BlogCard";
import LandingSection from "@/components/LandingSection";
import LandingContainer from "@/components/LandingContainer";
import CheersSection from "@/components/CheersSection";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ query: string }> }) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const posts = await client.fetch(BLOG_QUERY, params);

  return (
    <>
      <LandingSection
          landingContainer={<LandingContainer />}
        />

      <CheersSection/>
      <section className="section_container">
  <p className="text-30-semibold">{query ? `Search results for "${query}"` : `Recent Posts`}</p>
  <SearchForm query={query} />
  <ul className="mt-7 card_grid">
    {posts?.length > 0 ? (
      posts.slice(0, 3).map((post: BlogTypeCard) => <BlogCard key={post?._id} post={post} />)
    ) : (
      <p>No valid search</p>
    )}
  </ul>

  <div className="mt-10 text-right">
    <Link href="/blogPage" className="startup-card_btn_primary mt-6 px-4 py-2 border rounded">
      View All Blogs
    </Link>
  </div>
</section>

    </>
  );
}
