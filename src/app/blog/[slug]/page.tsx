import { notFound } from 'next/navigation';
import Image from 'next/image';
import { blogPosts } from '@/lib/astrology-data';
import { Badge } from '@/components/ui/badge';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="flex gap-2 flex-wrap mb-4 justify-center">
            {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
          {post.title}
        </h1>
        <p className="text-muted-foreground">
          Posted on {post.date} by {post.author}
        </p>
      </header>
      <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={post.dataAiHint}
        />
      </div>
      <div
        className="prose dark:prose-invert max-w-none text-lg text-foreground/90 space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
