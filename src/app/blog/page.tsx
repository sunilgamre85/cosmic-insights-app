import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '@/lib/astrology-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Astrology Blog"
        description="Explore articles on zodiac signs, planetary insights, and cosmic wisdom."
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={post.dataAiHint}
                />
              </div>
            </Link>
            <CardHeader>
              <div className="flex gap-2 flex-wrap mb-2">
                {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="font-headline text-xl">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                <span>{post.date}</span> by <span>{post.author}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
                <Link href={`/blog/${post.slug}`} className="w-full">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
