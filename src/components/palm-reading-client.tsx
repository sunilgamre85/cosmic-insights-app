

"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Hand, Bot, Wand2, Loader2, FileImage, X, Sparkles, Heart, Brain, AlertTriangle, Sun, Shapes, BookCopy, User, Briefcase, Shield, Download, LifeBuoy } from "lucide-react";
import { analyzePalms, type AnalyzePalmsOutput } from "@/ai/flows/ai-palm-reading";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import React from 'react';
import { cn } from "@/lib/utils";
import html2pdf from 'html2pdf.js';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type SinglePalmAnalysis = AnalyzePalmsOutput['leftHandAnalysis'];
type AnalysisMode = 'left' | 'right' | 'both';

const lineColors = {
    lifeLine: 'stroke-red-500',
    headline: 'stroke-blue-500',
    heartLine: 'stroke-pink-500',
    fateLine: 'stroke-purple-500',
    sunLine: 'stroke-yellow-500',
    healthLine: 'stroke-green-500',
    marriageLine: 'stroke-orange-500',
};

const highlightedLineColors = {
    lifeLine: 'stroke-red-400',
    headline: 'stroke-blue-400',
    heartLine: 'stroke-pink-400',
    fateLine: 'stroke-purple-400',
    sunLine: 'stroke-yellow-400',
    healthLine: 'stroke-green-400',
    marriageLine: 'stroke-orange-400',
};

const lineTextColors = {
    lifeLine: 'text-red-500',
    headline: 'text-blue-500',
    heartLine: 'text-pink-500',
    fateLine: 'text-purple-500',
    sunLine: 'text-yellow-500',
    healthLine: 'text-green-500',
    marriageLine: 'text-orange-500',
};

const LeftHandOutline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-muted-foreground">
        <path d="M56.5,111.5 C56.5,111.5 19,108.5 19,82.5 C19,56.5 28,45.5 35.5,39.5 C43,33.5 48.5,33.5 48.5,23.5 C48.5,13.5 43,2.5 50,2.5 C57,2.5 61.5,13.5 61.5,23.5 C61.5,33.5 68,34.5 73,40.5 C78,46.5 86,54.5 86,81.5 C86,108.5 56.5,111.5 56.5,111.5 Z" stroke="currentColor" fill="none"/>
        <path d="M48.5,22.5 C48.5,22.5 49,27.5 45.5,29.5" stroke="currentColor" fill="none"/>
        <path d="M35.5,39.5 C35.5,39.5 31,43.5 33,47.5" stroke="currentColor" fill="none"/>
        <path d="M61.5,22.5 C61.5,22.5 61,27.5 64.5,29.5" stroke="currentColor" fill="none"/>
        <path d="M73,40.5 C73,40.5 77.5,43.5 75.5,47.5" stroke="currentColor" fill="none"/>
    </svg>
);

const RightHandOutline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-muted-foreground">
        <path d="M63.5,111.5 C63.5,111.5 101,108.5 101,82.5 C101,56.5 92,45.5 84.5,39.5 C77,33.5 71.5,33.5 71.5,23.5 C71.5,13.5 77,2.5 70,2.5 C63,2.5 58.5,13.5 58.5,23.5 C58.5,33.5 52,34.5 47,40.5 C42,46.5 34,54.5 34,81.5 C34,108.5 63.5,111.5 63.5,111.5 Z" stroke="currentColor" fill="none"/>
        <path d="M71.5,22.5 C71.5,22.5 71,27.5 74.5,29.5" stroke="currentColor" fill="none"/>
        <path d="M84.5,39.5 C84.5,39.5 89,43.5 87,47.5" stroke="currentColor" fill="none"/>
        <path d="M58.5,22.5 C58.5,22.5 59,27.5 55.5,29.5" stroke="currentColor" fill="none"/>
        <path d="M47,40.5 C47,40.5 42.5,43.5 44.5,47.5" stroke="currentColor" fill="none"/>
    </svg>
);


export function PalmReadingClient() {
  const [leftHandFile, setLeftHandFile] = useState<File | null>(null);
  const [rightHandFile, setRightHandFile] = useState<File | null>(null);
  const [leftPreviewUrl, setLeftPreviewUrl] = useState<string | null>(null);
  const [rightPreviewUrl, setRightPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePalmsOutput | null>(null);
  const [highlightedLine, setHighlightedLine] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('both');
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (hand: 'left' | 'right') => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const url = reader.result as string;
          if(hand === 'left') {
              setLeftHandFile(selectedFile);
              setLeftPreviewUrl(url);
          } else {
              setRightHandFile(selectedFile);
              setRightPreviewUrl(url);
          }
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleRemoveImage = (hand: 'left' | 'right') => () => {
    if (hand === 'left') {
        setLeftHandFile(null);
        setLeftPreviewUrl(null);
    } else {
        setRightHandFile(null);
        setRightPreviewUrl(null);
    }
    setResult(null);
    setHighlightedLine(null);
    const fileInput = document.getElementById(`palm-image-upload-${hand}`) as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  }
  
  const isAnalyzeDisabled = useMemo(() => {
    if (isLoading) return true;
    if (analysisMode === 'left' && !leftHandFile) return true;
    if (analysisMode === 'right' && !rightHandFile) return true;
    if (analysisMode === 'both' && (!leftHandFile || !rightHandFile)) return true;
    return false;
  }, [isLoading, analysisMode, leftHandFile, rightHandFile]);


  const handleAnalyze = async () => {
    if (isAnalyzeDisabled) {
       toast({
        title: "Missing Image(s)",
        description: "Please upload the required image(s) for the selected analysis type.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setHighlightedLine(null);

    try {
        const analysisResult = await analyzePalms({ 
            leftHandPhoto: analysisMode !== 'right' ? leftPreviewUrl! : undefined,
            rightHandPhoto: analysisMode !== 'left' ? rightPreviewUrl! : undefined,
        });
        
        if (analysisResult.error) {
            toast({
                title: 'Analysis Error',
                description: analysisResult.error,
                variant: 'destructive',
            });
            setResult(null);
        } else {
            setResult(analysisResult);
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

  const handleDownload = () => {
    const element = reportRef.current;
    if (element) {
        const opt = {
            margin:       0.5,
            filename:     'CosmicInsights_Palm_Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    }
  };
  
  const svgPath = (points: {x: number, y: number}[]) => {
      if (!points || points.length === 0) return "";
      return `M ${points.map(p => `${p.x * 100}% ${p.y * 100}%`).join(' L ')}`;
  };
  
  const FileUploader = ({hand, previewUrl, onFileChange, onRemove, disabled = false}: {hand: 'left' | 'right', previewUrl: string | null, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void, disabled?: boolean}) => (
    <div className={cn("w-full transition-opacity", disabled && "opacity-40 pointer-events-none")}>
        <h3 className="font-headline text-lg text-center mb-2 capitalize">{hand} Hand</h3>
        {!previewUrl ? (
        <Label
            htmlFor={`palm-image-upload-${hand}`}
            className={cn("flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors", disabled && "cursor-not-allowed")}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {hand === 'left' ? <LeftHandOutline /> : <RightHandOutline />}
            <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 4MB)</p>
            </div>
            <Input id={`palm-image-upload-${hand}`} type="file" className="hidden" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" disabled={disabled}/>
        </Label>
        ) : (
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
            <Image src={previewUrl} alt={`${hand} palm preview`} layout="fill" objectFit="contain" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10" onClick={onRemove} disabled={disabled}>
            <X className="h-4 w-4" />
            </Button>
        </div>
        )}
  </div>
  );

  const AnalysisDisplay = ({ analysis, handTitle, previewUrl }: { analysis: SinglePalmAnalysis, handTitle: string, previewUrl: string | null }) => {
    if (!analysis) return null;

    const lineDetails = [
        ...(analysis.lifeLine ? [{ key: 'lifeLine', title: "Life Line", data: analysis.lifeLine, icon: <LifeBuoy className="h-5 w-5" /> }] : []),
        ...(analysis.headline ? [{ key: 'headline', title: "Head Line", data: analysis.headline, icon: <Brain className="h-5 w-5" /> }] : []),
        ...(analysis.heartLine ? [{ key: 'heartLine', title: "Heart Line", data: analysis.heartLine, icon: <Heart className="h-5 w-5" /> }] : []),
        ...(analysis.fateLine ? [{ key: 'fateLine', title: "Fate Line", data: analysis.fateLine, icon: <Sparkles className="h-5 w-5" /> }] : []),
        ...(analysis.sunLine ? [{ key: 'sunLine', title: "Sun Line (Apollo)", data: analysis.sunLine, icon: <Sun className="h-5 w-5" /> }] : []),
        ...(analysis.healthLine ? [{ key: 'healthLine', title: "Health Line", data: analysis.healthLine, icon: <Shield className="h-5 w-5" /> }] : []),
        ...(analysis.marriageLine ? [{ key: 'marriageLine', title: "Marriage Line", data: analysis.marriageLine, icon: <Heart className="h-5 w-5" /> }] : []),
    ];

    return (
        <Card className="flex-1 min-w-0">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">{handTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {previewUrl && (
                    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
                        <Image src={previewUrl} alt={`${handTitle} palm analysis`} layout="fill" objectFit="contain" />
                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {lineDetails.map(line => line.data && line.data.path && (
                                <path
                                    key={line.key}
                                    d={svgPath(line.data.path)}
                                    className={cn('fill-none transition-all duration-200',
                                        highlightedLine === line.key
                                        ? highlightedLineColors[line.key as keyof typeof highlightedLineColors]
                                        : lineColors[line.key as keyof typeof lineColors]
                                    )}
                                    strokeWidth={highlightedLine === line.key ? 3 : 1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                        </svg>
                    </div>
                )}
                {lineDetails.length > 0 ? lineDetails.map((detail) => detail.data && (
                    <div 
                        key={detail.key}
                        onMouseEnter={() => setHighlightedLine(detail.key)}
                        onMouseLeave={() => setHighlightedLine(null)}
                        className="cursor-pointer p-2 rounded-md hover:bg-secondary"
                    >
                        <h4 className={`font-headline text-lg flex items-center gap-2 ${lineTextColors[detail.key as keyof typeof lineTextColors]}`}>
                            {React.cloneElement(detail.icon, { className: `h-5 w-5 ${lineTextColors[detail.key as keyof typeof lineTextColors]}` })} 
                            {detail.title}
                        </h4>
                        <p className="mt-1 text-sm text-foreground/90 pl-7">{detail.data.analysis}</p>
                    </div>
                )) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Analysis Incomplete</AlertTitle>
                        <AlertDescription>
                            The AI was unable to identify the standard palm lines in this image.
                        </AlertDescription>
                    </Alert>
                )}
                
                {analysis.generalAnalysis && (
                    <div className="p-2 rounded-md hover:bg-secondary">
                    <h4 className="font-headline text-lg flex items-center gap-2 text-primary">
                        <Shapes className="h-5 w-5" /> General Palm Features
                    </h4>
                    <div className="space-y-2 mt-2 pl-7">
                        {analysis.generalAnalysis.handShape && (
                            <div>
                            <h5 className="font-semibold text-sm">Hand Shape</h5>
                            <p className="text-sm text-foreground/90">{analysis.generalAnalysis.handShape}</p>
                            </div>
                        )}
                        {analysis.generalAnalysis.mounts && (
                            <div>
                            <h5 className="font-semibold text-sm">Mounts Analysis</h5>
                            <p className="text-sm text-foreground/90">{analysis.generalAnalysis.mounts}</p>
                            </div>
                        )}
                    </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
  }

  const ReportSection = ({ title, content, icon }: { title: string, content: string | undefined, icon: React.ReactNode }) => {
    if (!content) return null;
    return (
        <div>
            <h3 className="font-headline text-2xl flex items-center gap-2 text-primary">
                {icon} {title}
            </h3>
            <p className="mt-2 text-base text-foreground/90 whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Upload className="h-6 w-6" /> Upload Your Palm(s)</CardTitle>
          <CardDescription>Choose an analysis type, then upload clear images for your reading.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label className="text-base font-semibold">Analysis Type</Label>
                <RadioGroup
                    value={analysisMode}
                    onValueChange={(value) => setAnalysisMode(value as AnalysisMode)}
                    className="grid grid-cols-3 gap-4 mt-2"
                >
                    <Label className="flex items-center justify-center gap-2 cursor-pointer rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
                        <RadioGroupItem value="left" id="left" />
                        Left Hand
                    </Label>
                    <Label className="flex items-center justify-center gap-2 cursor-pointer rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
                        <RadioGroupItem value="right" id="right" />
                        Right Hand
                    </Label>
                    <Label className="flex items-center justify-center gap-2 cursor-pointer rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
                        <RadioGroupItem value="both" id="both" />
                        Both Hands
                    </Label>
                </RadioGroup>
            </div>
            <Separator />
          <div className="grid md:grid-cols-2 gap-8 items-start">
             <FileUploader hand="left" previewUrl={leftPreviewUrl} onFileChange={handleFileChange('left')} onRemove={handleRemoveImage('left')} disabled={analysisMode === 'right'}/>
             <FileUploader hand="right" previewUrl={rightPreviewUrl} onFileChange={handleFileChange('right')} onRemove={handleRemoveImage('right')} disabled={analysisMode === 'left'}/>
          </div>
            <div className="mt-8">
                <Button onClick={handleAnalyze} disabled={isAnalyzeDisabled} className="w-full">
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-muted-foreground pt-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Our AI is reading your palm(s)...</p>
            <p className="text-sm">This may take a moment.</p>
        </div>
      )}
      
      {result && result.error && (
          <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>
                  {result.error}
              </AlertDescription>
          </Alert>
      )}

      {result && !result.error && (
        <Card className="shadow-lg" id="palm-report">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-6 w-6" /> Your Comprehensive AI Analysis</CardTitle>
                  <CardDescription>
                    {result.leftHandAnalysis && result.rightHandAnalysis ? "Left hand shows potential, right hand shows action. See the full story below." : "Here is the analysis for the selected hand."}
                  </CardDescription>
                </div>
                <Button onClick={handleDownload} variant="outline" size="icon">
                    <Download className="h-4 w-4"/>
                    <span className="sr-only">Download Report</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent ref={reportRef} className="space-y-8 p-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {result.leftHandAnalysis && <AnalysisDisplay analysis={result.leftHandAnalysis} handTitle="Left Hand" previewUrl={leftPreviewUrl} />}
                    {result.rightHandAnalysis && <AnalysisDisplay analysis={result.rightHandAnalysis} handTitle="Right Hand" previewUrl={rightPreviewUrl} />}
                </div>
                
                {result.combinedReport && (
                    <>
                        <Separator />
                        <div className="space-y-6">
                            <ReportSection title="Overall Personality" content={result.combinedReport.personalityTraits} icon={<User className="h-6 w-6" />} />
                            <Separator />
                            <ReportSection title="Love & Relationships" content={result.combinedReport.loveAndRelationships} icon={<Heart className="h-6 w-6" />} />
                            <Separator />
                            <ReportSection title="Career & Success" content={result.combinedReport.careerAndSuccess} icon={<Briefcase className="h-6 w-6" />} />
                            <Separator />
                            <ReportSection title="Health & Vitality" content={result.combinedReport.healthAndVitality} icon={<Hand className="h-6 w-6" />} />
                            <Separator />
                            <ReportSection title="Warnings & Opportunities" content={result.combinedReport.warningsAndOpportunities} icon={<AlertTriangle className="h-6 w-6" />} />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
      )}
      
      {!isLoading && !result && (
         <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
            <Hand className="h-12 w-12 mb-4" />
            <p>Your future awaits in your hands.</p>
            <p className="text-sm">Select an analysis type and upload image(s) to begin.</p>
        </div>
      )}

    </div>
  );
}
