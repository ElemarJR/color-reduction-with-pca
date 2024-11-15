import React, { useCallback, useRef, useState } from 'react';
import { Upload, Play, Palette, X, Download } from 'lucide-react';
import { ColorPCA } from '../lib/colorPCA';
import { Progress } from './ui/progress';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from './Header';

export function ImageProcessor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<number[][]>([]);
  const [numColors, setNumColors] = useState(16);
  const [processedNumColors, setProcessedNumColors] = useState(16);
  const [originalColorCount, setOriginalColorCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const countUniqueColors = (imageData: ImageData): number => {
    const uniqueColors = new Set<string>();
    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgb = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
      uniqueColors.add(rgb.join(','));
    }
    return uniqueColors.size;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img.src);
          setProcessedImage(null);
          setColorPalette([]);
          setProgress(0);

          const canvas = canvasRef.current!;
          const ctx = canvas.getContext('2d')!;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const uniqueColors = countUniqueColors(imageData);
          setOriginalColorCount(uniqueColors);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setColorPalette([]);
    setProgress(0);
    setOriginalColorCount(0);
  };

  const processImage = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const colorPCA = new ColorPCA((progress) => {
        setProgress(Math.round(progress));
      });

      const processedData = colorPCA.processImage(imageData.data, numColors);
      
      const newImageData = new ImageData(processedData, canvas.width, canvas.height);
      ctx.putImageData(newImageData, 0, 0);
      
      setProcessedImage(canvas.toDataURL());
      setColorPalette(colorPCA.getReducedColors());
      setProcessedNumColors(numColors);
      setIsProcessing(false);
    };
    img.src = originalImage;
  }, [originalImage, numColors]);

  const handleNumColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2 && value <= 512) {
      setNumColors(value);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      

      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-gray-900">Color Reduction with PCA</CardTitle>
              <CardDescription className="text-gray-600 max-w-2xl mx-auto">
                Upload an image and reduce its color palette using Principal Component Analysis.
                Adjust the number of colors to see how the image changes with different levels of color reduction.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center items-center min-h-[400px]">
                {!originalImage ? (
                  <div className="w-full max-w-md">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageInput"
                    />
                    <label
                      htmlFor="imageInput"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-600">Upload an image</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6 w-full">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="relative">
                          <img
                            src={originalImage}
                            alt="Original"
                            className="rounded-lg w-full object-contain max-h-96"
                          />
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {originalColorCount.toLocaleString()} unique colors
                          </div>
                          <Button
                            onClick={resetImage}
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Target Colors (2-512):
                            </label>
                            <Input
                              type="number"
                              min={2}
                              max={512}
                              value={numColors}
                              onChange={handleNumColorsChange}
                              className="w-24"
                            />
                          </div>
                          <Button
                            onClick={processImage}
                            disabled={!originalImage || isProcessing}
                            className="w-full"
                            variant="default"
                          >
                            {isProcessing ? (
                              <>Processing ({progress}%)...</>
                            ) : (
                              <>
                                <Play className="w-5 h-5 mr-2" />
                                Process Image
                              </>
                            )}
                          </Button>
                          {isProcessing && <Progress value={progress} />}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        {!processedImage ? (
                          <div className="relative">
                            <img
                              src={originalImage}
                              alt="Original"
                              className="rounded-lg w-full object-contain max-h-96"
                            />
                            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                              {originalColorCount.toLocaleString()} unique colors
                            </div>
                          </div>
                        ) : (
                          <>
                            <div 
                              className="relative"
                              onMouseEnter={() => setShowInfo(true)}
                              onMouseLeave={() => setShowInfo(false)}
                            >
                              <img
                                src={processedImage}
                                alt="Processed"
                                className="rounded-lg w-full object-contain max-h-96"
                              />
                              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                {processedNumColors} colors
                              </div>
                              <Button
                                onClick={downloadProcessedImage}
                                variant="outline"
                                size="icon"
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              {showInfo && (
                                <div className="absolute inset-0 bg-black/70 text-white p-4 rounded-lg flex items-center justify-center">
                                  <p className="text-center">
                                    The processed image uses a reduced color palette determined by color clustering.
                                    Each pixel is mapped to its nearest color in the reduced palette.
                                  </p>
                                </div>
                              )}
                            </div>

                            {colorPalette.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Color Palette
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                    {colorPalette.map((color, index) => (
                                      <div
                                        key={index}
                                        className="w-8 h-8 rounded-lg shadow-sm"
                                        style={{
                                          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                                        }}
                                        title={`RGB(${color.join(', ')})`}
                                      />
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}