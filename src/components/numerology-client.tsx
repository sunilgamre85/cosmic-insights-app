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
import { CalendarIcon, Loader2, Gem, User, Star, Activity } from "lucide-react";
import { aiNumerologyAnalysis, type AiNumerologyAnalysisOutput } from "@/ai/flows/ai-numerology-analysis";

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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Your Numerology Report</CardTitle>
          <CardDescription>Your personalized numerology insights will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Calculating your cosmic blueprint...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-muted-foreground">
              <Gem className="h-12 w-12 mb-4" />
              <p>Your numbers hold the key.</p>
              <p className="text-sm">Enter your details to generate your report.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center text-center">
                    <Activity className="h-6 w-6 mb-2 text-primary"/>
                    <h3 className="font-headline text-lg">Life Path Number</h3>
                    <p className="text-4xl font-bold text-primary">{result.lifePathNumber}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center text-center">
                    <Star className="h-6 w-6 mb-2 text-primary"/>
                    <h3 className="font-headline text-lg">Destiny Number</h3>
                    <p className="text-4xl font-bold text-primary">{result.destinyNumber}</p>
                </div>
              </div>
              <div>
                <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Personality Traits</h3>
                <p className="text-base text-foreground/90">{result.personalityTraits}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
