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
import { CalendarIcon, Loader2, Smartphone, Wand2, Sparkles, Gem, Star, MessageCircle, ShieldCheck } from "lucide-react";
import { mobileNumerologyAnalysis, type MobileNumerologyAnalysisOutput } from "@/ai/flows/mobile-numerology-analysis";
import { useUserInput } from "@/context/UserInputContext";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const formSchema = z.object({
  mobileNumber: z.string().min(10, "Please enter a valid 10-digit mobile number.").max(15, "Please enter a valid mobile number."),
  name: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export function MobileNumerologyClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MobileNumerologyAnalysisOutput | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { userDetails, setUserDetails } = useUserInput();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: "",
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
        ...form.getValues(),
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
    });
  }, [userDetails, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      if (values.name && values.dateOfBirth && (!userDetails.name || !userDetails.dateOfBirth)) {
        setUserDetails({
          name: values.name,
          dateOfBirth: values.dateOfBirth.toISOString(),
        });
      }

      const analysisResult = await mobileNumerologyAnalysis({
        mobileNumber: values.mobileNumber,
        name: values.name,
        dateOfBirth: values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd") : undefined,
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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Check Your Mobile Number Vibration</CardTitle>
          <CardDescription>Enter your mobile number for a numerological analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 9876543210" {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <CardDescription>For a more personalized reading, add your name and date of birth.</CardDescription>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
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
                    <FormLabel>Date of Birth (Optional)</FormLabel>
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
                            {field.value ? format(field.value, "PPP") : (
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> Analyze My Number</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Your Mobile Number Report</CardTitle>
          <CardDescription>The vibration and compatibility of your number will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Calculating your number's cosmic frequency...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Smartphone className="h-12 w-12 mb-4" />
              <p>Is your mobile number lucky for you?</p>
              <p className="text-sm">Enter your number to find out.</p>
            </div>
          )}
          {result && (
            <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
            <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center p-4 rounded-lg bg-secondary">
                    <h3 className="font-headline text-lg text-secondary-foreground">Vibration Number</h3>
                    <p className="text-6xl font-bold text-primary">{result.vibrationNumber}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary"/> Personalized Affirmation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg italic text-center text-foreground/90">"{result.affirmation}"</p>
                    </CardContent>
                </Card>

                <Accordion type="single" collapsible defaultValue="analysis" className="w-full">
                    <AccordionItem value="analysis">
                        <AccordionTrigger className="font-headline text-lg">Vibration Analysis</AccordionTrigger>
                        <AccordionContent className="text-base whitespace-pre-wrap">{result.analysis}</AccordionContent>
                    </AccordionItem>
                    {result.compatibility && (
                        <AccordionItem value="compatibility">
                            <AccordionTrigger className="font-headline text-lg">Compatibility with Life Path</AccordionTrigger>
                            <AccordionContent className="text-base whitespace-pre-wrap">{result.compatibility}</AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
                
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Cosmic Guidance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Star className="h-6 w-6 text-accent" />
                            <div>
                                <h4 className="font-semibold">Ruling Planet</h4>
                                <p className="text-muted-foreground">{result.rulingPlanet}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Gem className="h-6 w-6 text-accent" />
                            <div>
                                <h4 className="font-semibold">Lucky Gemstone</h4>
                                <p className="text-muted-foreground">{result.gemstone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Simple Remedies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                            {result.remedies.map((remedy, index) => <li key={index}>{remedy}</li>)}
                        </ul>
                    </CardContent>
                </Card>

            </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
