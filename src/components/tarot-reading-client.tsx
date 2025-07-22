"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tarotCardReading, type TarotCardReadingOutput } from "@/ai/flows/tarot-card-reading";
import type { TarotCard } from "@/lib/astrology-data";
import { useToast } from "@/hooks/use-toast";

const shuffle = (array: TarotCard[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export function TarotReadingClient({ cards }: { cards: TarotCard[] }) {
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TarotCardReadingOutput | null>(null);
  const { toast } = useToast();

  const handleDraw = () => {
    setResult(null);
    const shuffled = shuffle([...cards]);
    setDrawnCards(shuffled.slice(0, 3));
  };
  
  const handleAnalysis = async () => {
    if (drawnCards.length < 3) return;
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await tarotCardReading({
        card1: drawnCards[0].name,
        card2: drawnCards[1].name,
        card3: drawnCards[2].name,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Tarot analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try drawing cards again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardPositions = ["Past", "Present", "Future"];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 min-h-[350px]">
        <AnimatePresence>
          {drawnCards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 50, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: index * 10 - 10 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-headline text-xl text-foreground">{cardPositions[index]}</p>
              <Card className="w-48 h-72 p-2 shadow-lg hover:shadow-2xl transition-shadow relative overflow-hidden">
                <Image src={card.imageUrl} alt={card.name} layout="fill" objectFit="cover" data-ai-hint={card.dataAiHint} />
              </Card>
              <p className="font-semibold text-muted-foreground">{card.name}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleDraw} size="lg" disabled={isLoading}>Draw Cards</Button>
        {drawnCards.length > 0 && (
          <Button onClick={handleAnalysis} size="lg" disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2"/>}
            Interpret Reading
          </Button>
        )}
      </div>

      {result && (
         <Card className="w-full max-w-4xl shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Tarot Reading</CardTitle>
                <CardDescription>An interpretation of your three-card spread.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-headline text-xl text-primary">Past: {drawnCards[0].name}</h3>
                    <p className="text-foreground/90">{result.pastInterpretation}</p>
                </div>
                 <div>
                    <h3 className="font-headline text-xl text-primary">Present: {drawnCards[1].name}</h3>
                    <p className="text-foreground/90">{result.presentInterpretation}</p>
                </div>
                 <div>
                    <h3 className="font-headline text-xl text-primary">Future: {drawnCards[2].name}</h3>
                    <p className="text-foreground/90">{result.futureInterpretation}</p>
                </div>
                 <div>
                    <h3 className="font-headline text-xl text-primary">Overall Summary</h3>
                    <p className="text-foreground/90">{result.overallSummary}</p>
                </div>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
