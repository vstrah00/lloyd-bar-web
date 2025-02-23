import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'your_project_id',
  dataset: 'your_dataset',
  useCdn: true,
});

export const fetchContent = async (language) => {
  const query = `*[_type == "page"]{
    title,
    "content": content[language == "${language}"].text
  }`;

  const result = await client.fetch(query);
  return result;
};