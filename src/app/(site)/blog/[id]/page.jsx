import React from "react";
import { notFound } from "next/navigation";
import BlogPost from "@/components/pages/BlogPost";
import { getPublishedPost } from "@/lib/posts-server";
import { getAuthor } from "@/lib/authors";

const SITE_URL = "https://www.sansai-online.com";

// 記事本文をサーバー側で描画し（Googlebot が JS を実行しなくても本文を読める）、
// 10分ごとに再生成する。
export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPublishedPost(id);

  if (!post) {
    return {
      title: "ブログ記事",
      description: "山菜採りオンラインのブログ記事",
      robots: { index: false },
    };
  }

  const description =
    post.excerpt || `山菜採りオンラインのブログ記事「${post.title || ""}」`;
  const url = `${SITE_URL}/blog/${post.id}`;

  return {
    title: post.title || "ブログ記事",
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: "SANSAI ONLINE",
      locale: "ja_JP",
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await getPublishedPost(id);

  if (!post) {
    notFound();
  }

  const author = getAuthor(post.authorId);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.thumbnail || undefined,
    datePublished: post.createdAt || undefined,
    dateModified: post.updatedAt || post.createdAt || undefined,
    author: author
      ? { "@type": "Person", name: author.name, url: `${SITE_URL}${author.link}` }
      : { "@type": "Organization", name: "山菜採りオンライン" },
    publisher: { "@type": "Organization", name: "SANSAI ONLINE", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost initialPost={post} />
    </>
  );
}
