import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hand, Gem, Sparkles, Newspaper, Bot, Star, HeartHandshake, Smartphone, BookOpen, CalendarDays } from 'lucide-react';

const features = [
  {
    title: 'Palm Reading',
    description: 'Upload a photo of your palm and our AI will reveal the secrets held within your hands.',
    link: '/palm-reading',
    icon: <Hand className="h-8 w-8 text-primary" />,
    cta: 'Read Your Palm',
  },
  {
    title: 'Numerology Analysis',
    description: 'Discover your life path, destiny, and personality numbers based on your name and birth date.',
    link: '/numerology',
    icon: <Gem className="h-8 w-8 text-primary" />,
    cta: 'Analyze Your Numbers',
  },
  {
    title: 'Daily Horoscope',
    description: 'Get your personalized daily horoscope and see what the stars have in store for you.',
    link: '/horoscope',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    cta: 'Check Your Horoscope',
  },
    {
    title: 'Daily Panchang',
    description: 'Check today\'s Tithi, Nakshatra, Yoga, and other important astrological details.',
    link: '/panchang',
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    cta: 'View Today\'s Panchang',
  },
  {
    title: 'Tarot Reading',
    description: 'Get insights into your past, present, and future with a three-card tarot spread.',
    link: '/tarot-reading',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    cta: 'Get a Reading',
  },
  {
    title: 'Janam Kundli',
    description: 'Generate your detailed Vedic birth chart for deep insights into your life and destiny.',
    link: '/janam-kundli',
    icon: <Star className="h-8 w-8 text-primary" />,
    cta: 'Get Your Kundli',
  },
  {
    title: 'Kundli Matching',
    description: 'Check marriage compatibility by comparing two birth charts for a harmonious union.',
    link: '/kundli-matching',
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    cta: 'Match Kundlis',
  },
  {
    title: 'Mobile Numerology',
    description: 'Find out the hidden vibration and secrets behind your mobile number.',
    link: '/mobile-numerology',
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    cta: 'Check Your Number',
  },
  {
    title: 'Astrology Blog',
    description: 'Explore our articles on zodiac signs, planetary movements, and cosmic events.',
    link: '/blog',
    icon: <Newspaper className="h-8 w-8 text-primary" />,
    cta: 'Read The Blog',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background to-purple-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                Cosmic Insights
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Unlock the secrets of the universe. Your journey into the mystical arts of astrology starts here.
              </p>
              <Link href="/palm-reading">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Link href={feature.link} className="mt-auto">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        {feature.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-100">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline text-foreground">
                Meet Our AI Astrologer
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our advanced AI tools provide deep, personalized insights. While not a substitute for human astrologers, they offer a fascinating starting point for self-discovery.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link href="/chat">
                <Button>Chat with AI Astrologer</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Cosmic Insights. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
