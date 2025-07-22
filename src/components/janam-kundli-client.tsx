
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
import { CalendarIcon, Loader2, Star, Shield, Sun, AlertTriangle } from "lucide-react";
import { janamKundliAnalysis, type JanamKundliAnalysisOutput } from "@/ai/flows/janam-kundli-analysis";
import { ScrollArea } from "./ui/scroll-area";
import { useUserInput } from "@/context/UserInputContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { LagnaChart } from "./lagna-chart";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "Please enter a valid name."),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  hourOfBirth: z.string({ required_error: "Please select an hour." }),
  minuteOfBirth: z.string({ required_error: "Please select a minute." }),
  placeOfBirth: z.string().min(2, "Please enter a valid place of birth."),
});

export function JanamKundliClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JanamKundliAnalysisOutput | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { userDetails, setUserDetails } = useUserInput();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
      hourOfBirth: "12",
      minuteOfBirth: "00",
      placeOfBirth: "Delhi, India",
    },
  });

  useEffect(() => {
    form.reset({
      name: userDetails.name || "",
      dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : undefined,
      hourOfBirth: form.getValues("hourOfBirth") || "12",
      minuteOfBirth: form.getValues("minuteOfBirth") || "00",
      placeOfBirth: form.getValues("placeOfBirth") || "Delhi, India",
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
      const analysisResult = await janamKundliAnalysis({
        name: values.name,
        dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
        timeOfBirth: `${values.hourOfBirth}:${values.minuteOfBirth}`,
        placeOfBirth: values.placeOfBirth,
      });
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please check your API configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Enter Your Birth Details</CardTitle>
          <CardDescription>Provide accurate information for a precise Kundli report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Feature Temporarily Disabled</AlertTitle>
                  <AlertDescription>
                   The Janam Kundli generation is currently unavailable due to technical issues. The form will submit, but will return a sample report. We are working on a fix.
                  </AlertDescription>
              </Alert>
              <FormField
                control={form.control}
                name="name"
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
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="hourOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hour of Birth (24hr)</FormLabel>
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
                  name="minuteOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minute of Birth</FormLabel>
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
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Delhi, India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" /> Generate My Kundli
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Your Janam Kundli Report</CardTitle>
          <CardDescription>Your personalized Vedic birth chart analysis will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Generating your comprehensive Kundli report...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Star className="h-12 w-12 mb-4" />
              <p>Your Vedic birth chart awaits.</p>
              <p className="text-sm">Enter your details to generate your report.</p>
            </div>
          )}
          {result && (
            <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
                <div className="space-y-6">
                    {result.chartData && (
                        <div>
                            <h3 className="font-headline text-xl mb-2">Lagna Chart (South Indian Style)</h3>
                            <LagnaChart chartData={result.chartData} />
                        </div>
                    )}
                    <Separator />
                     {result.yogasAndDoshas && result.yogasAndDoshas.length > 0 && (
                        <div>
                            <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/> Key Yogas & Doshas</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.yogasAndDoshas.map((yoga) => (
                                    <Badge key={yoga.name} variant={yoga.name === "Feature Disabled" ? "destructive" : "secondary"} className="text-sm">{yoga.name}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <Separator />
                    <div>
                        <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><Sun className="h-5 w-5 text-primary"/> AI Generated Analysis</h3>
                        <div
                            className="prose dark:prose-invert max-w-none text-base text-foreground/90 whitespace-pre-wrap p-4 border rounded-lg bg-secondary/30"
                        >{result.report}</div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-headline text-xl mb-2">Vimshottari Mahadasha Periods</h3>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Dasha Lord</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.mahadashas.map((dasha, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{dasha.dashaLord}</TableCell>
                                        <TableCell>{dasha.startDate}</TableCell>
                                        <TableCell>{dasha.endDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
