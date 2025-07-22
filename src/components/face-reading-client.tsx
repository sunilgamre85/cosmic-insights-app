
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, User, Wand2, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { analyzeFace, type AnalyzeFaceOutput } from "@/ai/flows/ai-face-reading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";

export function FaceReadingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeFaceOutput | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    // Stop camera stream when component unmounts or tab changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    } else {
      setHasCameraPermission(false);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null);
    setPreviewUrl(null);
    setFile(null);
    if (value === 'camera') {
        startCamera();
    } else {
        stopCamera();
    }
  }

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
  
  const handleCapture = () => {
      if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setPreviewUrl(dataUrl);
          
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                setFile(new File([blob], "face-capture.jpg", { type: "image/jpeg" }));
            });
          stopCamera();
      }
  };

  const handleAnalyze = async () => {
    if (!previewUrl) {
      toast({
        title: "Missing Image",
        description: "Please upload or capture an image of your face.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeFace({ photoDataUri: previewUrl });
      setResult(analysisResult);
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/> Upload Photo</TabsTrigger>
                <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Use Camera</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
                 <CardHeader>
                    <CardTitle>Upload Your Photo</CardTitle>
                    <CardDescription>A clear, front-facing photo without glasses works best.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="face-image">Face Image</Label>
                    <Input id="face-image" type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                </CardContent>
            </TabsContent>
            <TabsContent value="camera">
                 <CardHeader>
                    <CardTitle>Use Your Camera</CardTitle>
                    <CardDescription>Position your face in the frame and capture the photo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border bg-black">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                         {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50">
                               <Alert variant="destructive">
                                  <Camera className="h-4 w-4" />
                                  <AlertTitle>Camera Access Required</AlertTitle>
                                  <AlertDescription>
                                    Please allow camera access in your browser to use this feature.
                                  </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <Button onClick={handleCapture} disabled={hasCameraPermission !== true} className="w-full">
                        <Camera className="mr-2 h-4 w-4" /> Capture Photo
                    </Button>
                </CardContent>
            </TabsContent>
        </Tabs>

        {(previewUrl && activeTab) && (
            <CardContent className="space-y-4 pt-6">
                 <Separator />
                <h3 className="text-center font-semibold pt-4">Image Preview</h3>
                <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
                    <Image src={previewUrl} alt="Face preview" layout="fill" objectFit="contain" />
                </div>
                <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                    {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                    <><Wand2 className="mr-2 h-4 w-4" /> Analyze My Face</>
                    )}
                </Button>
            </CardContent>
        )}
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
                    (analysis && typeof analysis === 'string') && (
                        <div key={feature}>
                            <h3 className="font-headline text-lg capitalize text-primary">{feature.replace(/([A-Z])/g, ' $1')}</h3>
                            <p className="text-foreground/90">{analysis}</p>
                        </div>
                    )
                ))}
            </CardContent>
        </Card>
      )}

      {!isLoading && !result && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8">
            <User className="h-12 w-12 mb-4" />
            <p>Your face tells a story.</p>
            <p className="text-sm">Upload a photo or use your camera to discover yours.</p>
        </div>
      )}
    </div>
  );
}
