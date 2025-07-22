"use client";

import { useState, useEffect } from "react";
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
import { CalendarIcon, Loader2, Gem, User, Star, Activity, Heart, Briefcase, Feather, Sun, Moon, Diamond, Gift, BookOpen } from "lucide-react";
import { aiNumerologyAnalysis, type AiNumerologyAnalysisOutput } from "@/ai/flows/ai-numerology-analysis";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useUserInput } from "@/context/UserInputContext";

const formSchema = z.object({
  name: z.string().min(2, "Please enter a valid name."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
});

export function NumerologyClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiNumerologyAnalysisOutput | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { userDetails, setUserDetails } = useUserInput();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
    });
  }, [userDetails, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      setUserDetails({
        name: values.name,
        dateOfBirth: values.dateOfBirth.toISOString(),
      });
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

  const analysisItems = result ? [
    {
      title: "Life Path Number",
      value: result.lifePathNumber.number,
      content: result.lifePathNumber.analysis,
      icon: <Activity className="h-5 w-5 text-primary"/>,
      id: "life-path"
    },
    {
      title: "Destiny Number",
      value: result.destinyNumber.number,
      content: result.destinyNumber.analysis,
      icon: <Star className="h-5 w-5 text-primary"/>,
      id: "destiny"
    },
    {
      title: "Soul Urge Number",
      value: result.soulUrgeNumber.number,
      content: result.soulUrgeNumber.analysis,
      icon: <Feather className="h-5 w-5 text-primary"/>,
      id: "soul-urge"
    },
    {
      title: "Personality Number",
      value: result.personalityNumber.number,
      content: result.personalityNumber.analysis,
      icon: <User className="h-5 w-5 text-primary"/>,
      id: "personality"
    },
    {
        title: "Birth Day Number",
        value: result.birthDayNumber.number,
        content: result.birthDayNumber.analysis,
        icon: <Gift className="h-5 w-5 text-primary"/>,
        id: "birth-day"
    },
    {
        title: "Maturity Number",
        value: result.maturityNumber.number,
        content: result.maturityNumber.analysis,
        icon: <Sun className="h-5 w-5 text-primary"/>,
        id: "maturity"
    },
    {
        title: "Personal Year Number",
        value: result.personalYearNumber.number,
        content: result.personalYearNumber.analysis,
        icon: <Moon className="h-5 w-5 text-primary"/>,
        id: "personal-year"
    },
  ] : [];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg w-full max-w-2xl mx-auto">
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
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Calculating your cosmic blueprint...</p>
        </div>
      )}

      {result && (
        <Card className="shadow-lg w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline">Your Numerology Report</CardTitle>
                <CardDescription>Your personalized numerology insights appear below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {analysisItems.map((item, index) => (
                    <div key={item.id}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline text-xl flex items-center gap-2">
                                {item.icon}
                                {item.title}
                            </h3>
                            <Badge className="text-xl">{item.value}</Badge>
                        </div>
                        <p className="mt-2 text-base text-foreground/90 whitespace-pre-wrap pl-7">
                            {item.content}
                        </p>
                        {index < analysisItems.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
                
                <Separator />

                <Card className="bg-secondary">
                    <CardHeader className="pb-4">
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><Diamond className="h-5 w-5 text-primary"/> Lucky Elements</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div><span className="font-semibold">Numbers:</span> {result.luckyElements.luckyNumbers.map(n => <Badge key={n} variant="outline" className="text-lg ml-1 bg-background">{n}</Badge>)}</div>
                        <div><span className="font-semibold">Color:</span> <Badge style={{backgroundColor: result.luckyElements.luckyColor.toLowerCase()}} className="text-lg ml-1 text-white">{result.luckyElements.luckyColor}</Badge></div>
                        <div><span className="font-semibold">Day:</span> <Badge variant="outline" className="text-lg ml-1 bg-background">{result.luckyElements.luckyDay}</Badge></div>
                        <div><span className="font-semibold">Gemstone:</span> <Badge variant="outline" className="text-lg ml-1 bg-background">{result.luckyElements.luckyGemstone}</Badge></div>
                    </CardContent>
                </Card>
                 <Separator />

                <div>
                    <h3 className="font-headline text-xl flex items-center gap-2 mb-2"><BookOpen className="h-5 w-5 text-primary"/> Overall Analysis</h3>
                    <p className="text-base text-foreground/90 whitespace-pre-wrap">
                        {result.overallAnalysis}
                    </p>
                </div>
                 <Separator />

                <div>
                    <h3 className="font-headline text-xl flex items-center gap-2 mb-2"><Briefcase className="h-5 w-5 text-primary"/> Career Suggestions</h3>
                    <p className="text-base text-foreground/90 whitespace-pre-wrap">
                        {result.careerSuggestions}
                    </p>
                </div>
                 <Separator />

                <div>
                    <h3 className="font-headline text-xl flex items-center gap-2 mb-2"><Heart className="h-5 w-5 text-primary"/> Relationship Compatibility</h3>
                    <p className="text-base text-foreground/90 whitespace-pre-wrap">
                        {result.relationshipCompatibility}
                    </p>
                </div>

            </CardContent>
        </Card>
      )}

      {!isLoading && !result && (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-muted-foreground">
          <Gem className="h-12 w-12 mb-4" />
          <p>Your numbers hold the key.</p>
          <p className="text-sm">Enter your details to generate your report.</p>
        </div>
      )}
    </div>
  );
}
