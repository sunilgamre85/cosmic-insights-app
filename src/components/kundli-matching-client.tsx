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
import { CalendarIcon, Loader2, HeartHandshake, User, Users } from "lucide-react";
import { kundliMatchingAnalysis, type KundliMatchingAnalysisOutput } from "@/ai/flows/kundli-matching-analysis";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useUserInput } from "@/context/UserInputContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const personSchema = z.object({
  name: z.string().min(2, "Please enter a valid name."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  hourOfBirth: z.string({ required_error: "Please select an hour." }),
  minuteOfBirth: z.string({ required_error: "Please select a minute." }),
  placeOfBirth: z.string().min(2, "Please enter a valid place of birth."),
});

const formSchema = z.object({
  person1: personSchema,
  person2: personSchema,
});

export function KundliMatchingClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KundliMatchingAnalysisOutput | null>(null);
  const [person1CalendarOpen, setPerson1CalendarOpen] = useState(false);
  const [person2CalendarOpen, setPerson2CalendarOpen] = useState(false);
  const { toast } = useToast();
  const { userDetails, setUserDetails } = useUserInput();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person1: { 
        name: userDetails.name || "", 
        dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
        hourOfBirth: "12",
        minuteOfBirth: "00", 
        placeOfBirth: "" 
      },
      person2: { 
        name: "",
        hourOfBirth: "12", 
        minuteOfBirth: "00",
        placeOfBirth: "" 
      },
    },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      person1: {
        ...form.getValues("person1"),
        name: userDetails.name || "",
        dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
      },
    });
  }, [userDetails, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      // Save person 1's details if they seem to be the primary user
      if (values.person1.name && values.person1.dateOfBirth) {
        setUserDetails({
            name: values.person1.name,
            dateOfBirth: values.person1.dateOfBirth.toISOString(),
        });
      }
      
      const analysisResult = await kundliMatchingAnalysis({
        person1: {
          ...values.person1,
          dateOfBirth: format(values.person1.dateOfBirth, "yyyy-MM-dd"),
          timeOfBirth: `${values.person1.hourOfBirth}:${values.person1.minuteOfBirth}`,
        },
        person2: {
          ...values.person2,
          dateOfBirth: format(values.person2.dateOfBirth, "yyyy-MM-dd"),
          timeOfBirth: `${values.person2.hourOfBirth}:${values.person2.minuteOfBirth}`,
        },
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

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const renderPersonFields = (
    person: "person1" | "person2", 
    title: string, 
    isCalendarOpen: boolean, 
    setCalendarOpen: (open: boolean) => void
  ) => (
    <div className="space-y-4">
      <h3 className="font-headline text-lg flex items-center gap-2"><User /> {title}</h3>
      <FormField
        control={form.control}
        name={`${person}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${person}.dateOfBirth`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")} 
                    initialFocus />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${person}.hourOfBirth`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hour</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hours.map(hour => <SelectItem key={hour} value={hour}>{hour}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${person}.minuteOfBirth`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minute</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {minutes.map(minute => <SelectItem key={minute} value={minute}>{minute}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${person}.placeOfBirth`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Place of Birth</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Kandivali, Mumbai" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Enter Birth Details</CardTitle>
          <CardDescription>Provide details for both individuals for a compatibility report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {renderPersonFields("person1", "Person 1", person1CalendarOpen, setPerson1CalendarOpen)}
                {renderPersonFields("person2", "Person 2", person2CalendarOpen, setPerson2CalendarOpen)}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <HeartHandshake className="mr-2 h-4 w-4" /> Check Compatibility
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Compatibility Report</CardTitle>
          <CardDescription>The cosmic connection score will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Comparing cosmic blueprints...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p>Discover your compatibility.</p>
              <p className="text-sm">Enter birth details to generate the report.</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
                <div className="text-center">
                    <h3 className="font-headline text-xl">Compatibility Score (Guna Milan)</h3>
                    <p className="text-5xl font-bold text-primary">{result.compatibilityScore}/36</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-headline text-lg">Overall Summary</h4>
                  <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <p className="text-base text-foreground/90 whitespace-pre-wrap">{result.summary}</p>
                  </ScrollArea>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
