
"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Hand, Bot, Wand2, Loader2, FileImage, X, Sparkles, Heart, Brain, AlertTriangle, Sun, Shapes } from "lucide-react";
import { analyzePalm, type AnalyzePalmOutput } from "@/ai/flows/ai-palm-reading";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import React from 'react';

const lineColors = {
    lifeLine: 'stroke-red-500',
    headline: 'stroke-blue-500',
    heartLine: 'stroke-pink-500',
    fateLine: 'stroke-purple-500',
    sunLine: 'stroke-yellow-500',
};

const highlightedLineColors = {
    lifeLine: 'stroke-red-400',
    headline: 'stroke-blue-400',
    heartLine: 'stroke-pink-400',
    fateLine: 'stroke-purple-400',
    sunLine: 'stroke-yellow-400',
};

const lineTextColors = {
    lifeLine: 'text-red-500',
    headline: 'text-blue-500',
    heartLine: 'text-pink-500',
    fateLine: 'text-purple-500',
    sunLine: 'text-yellow-500',
};


export function PalmReadingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePalmOutput | null>(null);
  const [highlightedLine, setHighlightedLine] = useState<string | null>(null);
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
    setHighlightedLine(null);
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
    setHighlightedLine(null);

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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Analysis Failed",
        description: `The AI was unable to analyze your palm. Please try again with a clear, well-lit image. (Error: ${errorMessage})`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const lineDetails = result ? [
    ...(result.lifeLine ? [{ key: 'lifeLine', title: "Life Line", data: result.lifeLine, icon: <Hand className="h-5 w-5" /> }] : []),
    ...(result.headline ? [{ key: 'headline', title: "Head Line", data: result.headline, icon: <Brain className="h-5 w-5" /> }] : []),
    ...(result.heartLine ? [{ key: 'heartLine', title: "Heart Line", data: result.heartLine, icon: <Heart className="h-5 w-5" /> }] : []),
    ...(result.fateLine ? [{ key: 'fateLine', title: "Fate Line", data: result.fateLine, icon: <Sparkles className="h-5 w-5" /> }] : []),
    ...(result.sunLine ? [{ key: 'sunLine', title: "Sun Line (Apollo)", data: result.sunLine, icon: <Sun className="h-5 w-5" /> }] : [])
  ] : [];

  const svgPath = (points: {x: number, y: number}[]) => {
      if (!points || points.length === 0) return "";
      return `M ${points.map(p => `${p.x * 100}% ${p.y * 100}%`).join(' L ')}`;
  };


  return (
    <div className="space-y-8">
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
                <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
                  <Image src={previewUrl} alt="Palm preview" layout="fill" objectFit="contain" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {previewUrl && 
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
            }
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-muted-foreground pt-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Our AI is reading your palm...</p>
            <p className="text-sm">This may take a moment.</p>
        </div>
      )}

      {result && (
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-6 w-6" /> AI Analysis</CardTitle>
            <CardDescription>Hover over a line's analysis to see it highlighted on the image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {previewUrl && (
                    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
                        <Image src={previewUrl} alt="Palm analysis" layout="fill" objectFit="contain" />
                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {lineDetails.map(line => line.data && line.data.path && (
                                <path
                                    key={line.key}
                                    d={svgPath(line.data.path)}
                                    className={`fill-none transition-all duration-200 ${
                                        highlightedLine === line.key
                                        ? highlightedLineColors[line.key as keyof typeof highlightedLineColors]
                                        : lineColors[line.key as keyof typeof lineColors]
                                    }`}
                                    strokeWidth={highlightedLine === line.key ? 3 : 1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                        </svg>
                    </div>
                )}
                 {lineDetails.length > 0 ? lineDetails.map((detail, index) => detail.data && (
                    <React.Fragment key={detail.key}>
                      <div 
                        onMouseEnter={() => setHighlightedLine(detail.key)}
                        onMouseLeave={() => setHighlightedLine(null)}
                        className="cursor-pointer"
                      >
                          <h3 className={`font-headline text-xl flex items-center gap-2 ${lineTextColors[detail.key as keyof typeof lineTextColors]}`}>
                              {React.cloneElement(detail.icon, { className: `h-5 w-5 ${lineTextColors[detail.key as keyof typeof lineTextColors]}` })} 
                              {detail.title}
                          </h3>
                          <p className="mt-2 text-base text-foreground/90 pl-7">
                              {detail.data.analysis}
                          </p>
                      </div>
                      <Separator className="mt-6" />
                    </React.Fragment>
                )) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Analysis Incomplete</AlertTitle>
                        <AlertDescription>
                            The AI was unable to identify the standard palm lines in the provided image. Please try again with a clearer, more direct photo of your palm.
                        </AlertDescription>
                    </Alert>
                )}
                
                {result.generalAnalysis && (
                  <div>
                    <h3 className="font-headline text-xl flex items-center gap-2 text-primary">
                        <Shapes className="h-5 w-5" /> General Palm Features
                    </h3>
                    <div className="space-y-4 mt-2 pl-7">
                        {result.generalAnalysis.handShape && (
                           <div>
                             <h4 className="font-semibold">Hand Shape</h4>
                             <p className="text-base text-foreground/90">{result.generalAnalysis.handShape}</p>
                           </div>
                        )}
                        {result.generalAnalysis.mounts && (
                           <div>
                             <h4 className="font-semibold">Mounts Analysis</h4>
                             <p className="text-base text-foreground/90">{result.generalAnalysis.mounts}</p>
                           </div>
                        )}
                    </div>
                  </div>
                )}
            </CardContent>
        </Card>
      )}
      
      {!isLoading && !result && (
         <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
            <Hand className="h-12 w-12 mb-4" />
            <p>Your future awaits.</p>
            <p className="text-sm">Upload an image to begin.</p>
        </div>
      )}

    </div>
  );
}
