"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone, Wand2 } from "lucide-react";
import { analyzeMobileNumber, type NumerologyResult } from "@/lib/mobile-numerology";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  mobileNumber: z.string().min(10, "Please enter a valid 10-digit mobile number.").max(15, "Please enter a valid mobile number."),
});

export function MobileNumerologyClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      // Using the local function instead of an AI flow
      const analysisResult = analyzeMobileNumber(values.mobileNumber);
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
          <CardDescription>The vibration and meaning of your number will appear below.</CardDescription>
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
            <ScrollArea className="h-full w-full pr-4">
            <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="text-center p-4 rounded-lg bg-secondary">
                    <h3 className="font-headline text-lg text-secondary-foreground">Final Number</h3>
                    <p className="text-6xl font-bold text-primary">{result.reduced}</p>
                    <p className="text-sm text-muted-foreground">Total Sum: {result.sum}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Meaning of Number {result.reduced}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-center text-foreground/90">
                           {result.meaning}
                        </p>
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
