import SearchForm from "../../components/SearchForm";
import BlogCard, { BlogTypeCard } from "../../components/BlogCard";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

export default async function Home({ searchParams }: { searchParams: Promise<{ query: string }> }) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const posts = await client.fetch(BLOG_QUERY, params);

  return (
    <>
      <section className="section_container">
        <p className="text-30-semibold">{query ? `Search results for "${query}"` : `All Posts`}</p>
        <SearchForm query={query} />
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: BlogTypeCard) => <BlogCard key={post?._id} post={post} />)
          ) : (
            <p>No valid search</p>
          )}
        </ul>
      </section>
    </>
  );
}
