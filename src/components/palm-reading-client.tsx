"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Hand, Bot, Wand2, Loader2, FileImage, X } from "lucide-react";
import { analyzePalm, type AnalyzePalmOutput } from "@/ai/flows/ai-palm-reading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export function PalmReadingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePalmOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    const fileInput = document.getElementById('palm-image-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an image of your palm.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const photoDataUri = event.target?.result as string;
        if (photoDataUri) {
          const analysisResult = await analyzePalm({ photoDataUri });
          setResult(analysisResult);
        } else {
            throw new Error("Could not read file.");
        }
      };
      reader.onerror = (error) => {
        throw new Error("Error reading file: " + error);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const lineDetails = result ? [
    { title: "Life Line", content: result.analysis.lifeLine, icon: <Hand className="h-5 w-5 mr-2 text-primary" /> },
    { title: "Head Line", content: result.analysis.headline, icon: <Bot className="h-5 w-5 mr-2 text-primary" /> },
    { title: "Heart Line", content: result.analysis.heartLine, icon: <Wand2 className="h-5 w-5 mr-2 text-primary" /> },
    { title: "Fate Line", content: result.analysis.fateLine, icon: <Sparkles className="h-5 w-5 mr-2 text-primary" /> },
  ] : [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Upload className="h-6 w-6" /> Upload Your Palm</CardTitle>
          <CardDescription>Upload a clear image of your dominant hand's palm.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full">
              {!previewUrl ? (
                <Label
                  htmlFor="palm-image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileImage className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
                  </div>
                  <Input id="palm-image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                </Label>
              ) : (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image src={previewUrl} alt="Palm preview" layout="fill" objectFit="cover" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <Button onClick={handleAnalyze} disabled={!file || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-6 w-6" /> AI Analysis</CardTitle>
          <CardDescription>Your personalized palm reading results will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Our AI is reading your palm...</p>
              <p className="text-sm">This may take a moment.</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-muted-foreground">
              <Hand className="h-12 w-12 mb-4" />
              <p>Your future awaits.</p>
              <p className="text-sm">Upload an image to begin.</p>
            </div>
          )}
          {result && (
            <Accordion type="single" collapsible defaultValue="Life Line" className="w-full">
              {lineDetails.map(detail => (
                <AccordionItem value={detail.title} key={detail.title}>
                  <AccordionTrigger className="font-headline text-lg hover:no-underline">
                    <div className="flex items-center">
                        {detail.icon} {detail.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    {detail.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
