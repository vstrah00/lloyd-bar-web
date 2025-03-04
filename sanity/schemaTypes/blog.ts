import { StickyNote } from "lucide-react";
import { defineField, defineType } from "sanity";

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: StickyNote,
  fields: [
    defineField({
      name: "title",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "hr", title: "Croatian", type: "string" },
      ],
      validation: (Rule) => Rule.required().error("Title is required in both languages!"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title.en", // Use English title for slug generation
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "text" },
        { name: "hr", title: "Croatian", type: "text" },
      ],
      validation: (Rule) => Rule.required().error("Description is required in both languages!"),
    }),
    defineField({
      name: "category",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "hr", title: "Croatian", type: "string" },
      ],
      validation: (Rule) =>
        Rule.required().error("Category is required in both languages!"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "markdown" },
        { name: "hr", title: "Croatian", type: "markdown" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en", // Use English title for preview
    },
  },
});