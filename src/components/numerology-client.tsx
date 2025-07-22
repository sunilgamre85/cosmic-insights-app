"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Gem, User, Star, Activity, Heart, Briefcase, Feather, Sun, Moon, Diamond, Gift } from "lucide-react";
import { aiNumerologyAnalysis, type AiNumerologyAnalysisOutput } from "@/ai/flows/ai-numerology-analysis";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  name: z.string().min(2, "Please enter a valid name."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
});

export function NumerologyClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiNumerologyAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await aiNumerologyAnalysis({
        ...values,
        dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const NumberCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center text-center h-full">
      {icon}
      <h3 className="font-headline text-md mt-2">{title}</h3>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
  );
  
  const InfoCard = ({ title, content, icon }: { title: string, content: string | React.ReactNode, icon: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-secondary">
      <h3 className="font-headline text-lg mb-2 flex items-center gap-2">{icon} {title}</h3>
      <div className="text-base text-foreground/90 whitespace-pre-wrap">{content}</div>
    </div>
  );


  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Enter Your Details</CardTitle>
          <CardDescription>Provide your full name and date of birth for an accurate reading.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
                  </>
                ) : (
                  <>
                    <Gem className="mr-2 h-4 w-4" /> Get My Reading
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline">Your Numerology Report</CardTitle>
          <CardDescription>Your personalized numerology insights will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Calculating your cosmic blueprint...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
              <Gem className="h-12 w-12 mb-4" />
              <p>Your numbers hold the key.</p>
              <p className="text-sm">Enter your details to generate your report.</p>
            </div>
          )}
          {result && (
            <ScrollArea className="h-[calc(100vh-300px)] w-full pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <NumberCard title="Life Path" value={result.lifePathNumber} icon={<Activity className="h-6 w-6 text-primary"/>} />
                  <NumberCard title="Destiny" value={result.destinyNumber} icon={<Star className="h-6 w-6 text-primary"/>} />
                  <NumberCard title="Soul Urge" value={result.soulUrgeNumber} icon={<Feather className="h-6 w-6 text-primary"/>} />
                  <NumberCard title="Personality" value={result.personalityNumber} icon={<User className="h-6 w-6 text-primary"/>} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberCard title="Birth Day" value={result.birthDayNumber} icon={<Gift className="h-6 w-6 text-primary"/>} />
                  <NumberCard title="Maturity" value={result.maturityNumber} icon={<Sun className="h-6 w-6 text-primary"/>} />
                  <NumberCard title="Personal Year" value={result.personalYearNumber} icon={<Moon className="h-6 w-6 text-primary"/>} />
              </div>
              <Separator />
              <InfoCard title="Lucky Elements" icon={<Diamond className="h-5 w-5 text-primary"/>} content={
                  <div className="flex flex-wrap items-center gap-4">
                      <div><span className="font-semibold">Numbers:</span> {result.luckyNumbers.map(n => <Badge key={n} variant="secondary" className="text-lg ml-1">{n}</Badge>)}</div>
                      <div><span className="font-semibold">Color:</span> <Badge style={{backgroundColor: result.luckyColor.toLowerCase()}} className="text-lg ml-1 text-white">{result.luckyColor}</Badge></div>
                      <div><span className="font-semibold">Day:</span> <Badge variant="secondary" className="text-lg ml-1">{result.luckyDay}</Badge></div>
                      <div><span className="font-semibold">Gemstone:</span> <Badge variant="secondary" className="text-lg ml-1">{result.luckyGemstone}</Badge></div>
                  </div>
              } />
              <InfoCard title="Detailed Analysis" icon={<User className="h-5 w-5 text-primary"/>} content={result.detailedAnalysis} />
              <InfoCard title="Career Suggestions" icon={<Briefcase className="h-5 w-5 text-primary"/>} content={result.careerSuggestions} />
              <InfoCard title="Relationship Compatibility" icon={<Heart className="h-5 w-5 text-primary"/>} content={result.relationshipCompatibility} />

            </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
