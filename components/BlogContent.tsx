"use client";

interface BlogContentProps {
  category: string;
  content: string; // Markdown converted to HTML
}

const BlogContent: React.FC<BlogContentProps> = ({ category, content }) => {
  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 lg:px-12 py-12">
      {/* Blog Category */}
      <div className="mb-4">
        <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      {/* Blog Content */}
      <div
        className="prose lg:prose-lg max-w-none text-gray-800 bg-white p-6 rounded-lg shadow-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
};

export default BlogContent;
