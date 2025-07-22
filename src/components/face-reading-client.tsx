"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, User, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Placeholder for the AI flow - we will create this next
// import { analyzeFace, type AnalyzeFaceOutput } from "@/ai/flows/ai-face-reading";

export function FaceReadingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null); // Replace 'any' with AnalyzeFaceOutput
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFile(selectedFile);
        setResult(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !previewUrl) {
      toast({
        title: "Missing Image",
        description: "Please upload an image of your face.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      // const analysisResult = await analyzeFace({ photoDataUri: previewUrl });
      // setResult(analysisResult);
      // Mock result for now:
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({
        forehead: "A wide forehead suggests intelligence and a practical nature.",
        eyebrows: "Strong eyebrows indicate a determined and confident personality.",
        eyes: "Bright, clear eyes suggest a sharp mind and honesty.",
        nose: "A straight nose points to a well-balanced and organized character.",
        lips: "Full lips are often associated with a caring and generous nature.",
        chin: "A prominent chin indicates a strong will and determination."
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "The AI was unable to analyze your face. Please try again with a clear, well-lit image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
          <CardDescription>A clear, front-facing photo without glasses works best.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="face-image">Face Image</Label>
            <Input id="face-image" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {previewUrl && (
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
              <Image src={previewUrl} alt="Face preview" layout="fill" objectFit="contain" />
            </div>
          )}
          <Button onClick={handleAnalyze} disabled={!file || isLoading} className="w-full">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4" /> Analyze My Face</>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
         <div className="flex flex-col items-center justify-center text-muted-foreground pt-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Our AI is analyzing your facial features...</p>
        </div>
      )}

      {result && (
        <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline">Your Face Reading Report</CardTitle>
                <CardDescription>Insights based on your unique facial features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(result).map(([feature, analysis]) => (
                    <div key={feature}>
                        <h3 className="font-headline text-lg capitalize text-primary">{feature}</h3>
                        <p className="text-foreground/90">{analysis as string}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

      {!isLoading && !result && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
            <User className="h-12 w-12 mb-4" />
            <p>Your face tells a story.</p>
            <p className="text-sm">Upload a photo to discover yours.</p>
        </div>
      )}
    </div>
  );
}
