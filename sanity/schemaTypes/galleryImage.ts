import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "hr", title: "Croatian", type: "string" },
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "text" },
        { name: "hr", title: "Croatian", type: "text" },
      ],
    }),
    defineField({
      name: "eventDate",
      title: "Photo/Event Date",
      type: "date",
      description: "Optional date shown on the gallery card. Use this for when the photo was taken or when the event happened.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "caption.en",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled gallery image",
        subtitle,
        media,
      };
    },
  },
});
