import { useState, useRef } from "react";
import { useCreateImage } from "@/hooks/use-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import MemeCanvas, { MemeCanvasHandle } from "@/components/MemeCanvas";
import { ImagePlus, Download, RefreshCcw, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Step = "create" | "download";

export default function Home() {
  const [step, setStep] = useState<Step>("create");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<MemeCanvasHandle>(null);
  const { toast } = useToast();
  
  const createMutation = useCreateImage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setTopText("");
        setBottomText("");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!imageSrc) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first!",
        variant: "destructive",
      });
      return;
    }

    const dataUrl = canvasRef.current?.getDataUrl();
    if (!dataUrl) {
      toast({
        title: "Error",
        description: "Failed to generate image.",
        variant: "destructive",
      });
      return;
    }

    // Save to backend (fire and forget for UI, but await for correctness)
    try {
      await createMutation.mutateAsync({
        originalImageUrl: imageSrc,
        generatedImageUrl: dataUrl,
        topText: topText || null,
        bottomText: bottomText || null,
      });
      
      setGeneratedImage(dataUrl);
      setStep("download");
      toast({
        title: "Success!",
        description: "Meme generated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save generated image to server.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.download = `mentang-trend-${Date.now()}.jpg`;
    link.href = generatedImage;
    link.click();
  };

  const resetForm = () => {
    setStep("create");
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto space-y-2">
        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wide uppercase mb-2">
          Official Generator
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Mentang² <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Trend</span>
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Buat foto trend mentang-mentang dengan mudah dan cepat.
        </p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-lg mx-auto overflow-hidden border-0 shadow-2xl shadow-primary/5 ring-1 ring-slate-900/5">
        
        {/* Progress Steps */}
        <div className="flex border-b bg-slate-50/50">
          <div 
            className={cn(
              "flex-1 py-4 text-center text-sm font-semibold transition-colors duration-300 relative",
              step === "create" ? "text-primary bg-white" : "text-slate-400 bg-slate-50"
            )}
          >
            1. Upload & Tulis
            {step === "create" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in slide-in-from-left-4" />
            )}
          </div>
          <div 
            className={cn(
              "flex-1 py-4 text-center text-sm font-semibold transition-colors duration-300 relative",
              step === "download" ? "text-primary bg-white" : "text-slate-400 bg-slate-50"
            )}
          >
            2. Download
            {step === "download" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in slide-in-from-right-4" />
            )}
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          
          {step === "create" ? (
            <div className="space-y-6 animate-in slide-in-from-left-8 fade-in duration-300">
              {/* Image Upload Area */}
              <div 
                className={cn(
                  "relative aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group overflow-hidden bg-slate-50",
                  imageSrc ? "border-primary/50" : "border-slate-200 hover:border-primary/50 hover:bg-slate-100"
                )}
                onClick={() => !imageSrc && fileInputRef.current?.click()}
              >
                {imageSrc ? (
                  <>
                    <div className="absolute inset-0 z-0 bg-slate-100 flex items-center justify-center">
                       {/* Canvas Preview */}
                       <MemeCanvas 
                         ref={canvasRef}
                         imageSrc={imageSrc} 
                         topText={topText} 
                         bottomText={bottomText} 
                       />
                    </div>
                    {/* Change Image Button Overlay */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <ImagePlus className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Upload Foto Kamu</h3>
                      <p className="text-sm text-slate-500 mt-1">Klik untuk memilih foto</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>

              {/* Text Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Teks Atas</label>
                  <Input 
                    placeholder="CONTOH: MENTANG-MENTANG..." 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)}
                    className="font-bold uppercase placeholder:normal-case"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Teks Bawah</label>
                  <Input 
                    placeholder="CONTOH: JADI LUPA TEMAN" 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)}
                    className="font-bold uppercase placeholder:normal-case"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full text-lg h-12 shadow-xl shadow-primary/20" 
                  variant="gradient"
                  disabled={!imageSrc || createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <span className="flex items-center gap-2">Generating...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> Generate Meme
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Gambar Siap!</h3>
                <p className="text-slate-500">Meme kamu sudah jadi dan siap disimpan.</p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border bg-slate-100">
                {generatedImage && (
                  <img src={generatedImage} alt="Generated Meme" className="w-full h-auto" />
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  onClick={handleDownload} 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                >
                  <Download className="w-5 h-5 mr-2" /> Simpan Gambar
                </Button>
                
                <Button 
                  onClick={resetForm} 
                  variant="outline" 
                  size="lg"
                  className="w-full"
                >
                  Edit Lagi
                </Button>
              </div>

              <div className="pt-6 border-t">
                <a 
                  href="https://whatsapp.com/channel/0029Vb6kx8FFi8xZBhjm2g0m" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-all"
                >
                  Join Saluran Ray 🚀 <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
      
      <footer className="mt-12 text-slate-400 text-sm text-center">
        <p>© {new Date().getFullYear()} Mentang² Trend Generator. Have fun!</p>
      </footer>
    </div>
  );
}
