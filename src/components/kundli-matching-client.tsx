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
import { matchKundli, type GunaScore, type KundliProfile } from "@/lib/kundli-matching";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useUserInput } from "@/context/UserInputContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";

const personSchema = z.object({
  name: z.string().min(2, "Please enter a valid name."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
});

const formSchema = z.object({
  person1: personSchema,
  person2: personSchema,
});

type KundliMatchingResult = {
    total: number;
    details: GunaScore[];
}

export function KundliMatchingClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KundliMatchingResult | null>(null);
  const [person1CalendarOpen, setPerson1CalendarOpen] = useState(false);
  const [person2CalendarOpen, setPerson2CalendarOpen] = useState(false);
  const { toast } = useToast();
  const { userDetails } = useUserInput();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person1: { 
        name: userDetails.name || "", 
        dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
      },
      person2: { 
        name: "",
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
      // In a real app, you would first calculate the nakshatra, rashi etc. from the birth details.
      // For now, we'll use mock data to demonstrate the matching logic.
      const boy: KundliProfile = {
        name: values.person1.name,
        dob: format(values.person1.dateOfBirth, "yyyy-MM-dd"),
        gender: "male",
        nakshatra: "Rohini", // Mock
        rashi: "Vrishabha", // Mock
        nadi: "Adi", // Mock
        gana: "Deva", // Mock
      };
      
      const girl: KundliProfile = {
        name: values.person2.name,
        dob: format(values.person2.dateOfBirth, "yyyy-MM-dd"),
        gender: "female",
        nakshatra: "Mrigashira", // Mock
        rashi: "Vrishabha", // Mock
        nadi: "Madhya", // Mock
        gana: "Deva", // Mock
      };

      const analysisResult = matchKundli(boy, girl);
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
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg w-full max-w-4xl mx-auto">
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
               <p className="text-xs text-muted-foreground text-center">Note: Astrological details like Rashi and Nakshatra are currently mocked. The calculation logic is for demonstration.</p>
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-8">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Comparing cosmic blueprints...</p>
        </div>
      )}

      {result && (
        <Card className="shadow-lg w-full max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle className="font-headline">Compatibility Report</CardTitle>
            <CardDescription>The cosmic connection score will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-full w-full pr-4">
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="font-headline text-xl">Compatibility Score (Guna Milan)</h3>
                        <p className="text-5xl font-bold text-primary">{result.total}/36</p>
                        <Progress value={(result.total / 36) * 100} className="mt-2 h-2" />
                    </div>
                    <Separator />
                    <div>
                    <h4 className="font-headline text-lg mb-2">Detailed Guna Milan Score</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guna (Koota)</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.details.map((guna) => (
                                    <TableRow key={guna.guna}>
                                        <TableCell className="font-medium">{guna.guna}</TableCell>
                                        <TableCell className="text-right">{guna.score} / {guna.max}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                </ScrollArea>
            </CardContent>
        </Card>
      )}

      {!isLoading && !result && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
          <Users className="h-12 w-12 mb-4" />
          <p>Discover your compatibility.</p>
          <p className="text-sm">Enter birth details to generate the report.</p>
        </div>
      )}
    </div>
  );
}
