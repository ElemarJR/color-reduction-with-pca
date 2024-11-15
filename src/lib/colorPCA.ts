export class ColorPCA {
  private uniqueColors: number[][] = [];
  private reducedColors: number[][] = [];
  private colorMap: Map<string, number[]> = new Map();
  private onProgress?: (progress: number) => void;

  constructor(onProgress?: (progress: number) => void) {
    this.onProgress = onProgress;
  }

  private rgbToKey(rgb: number[]): string {
    return rgb.join(',');
  }

  private colorDistance(color1: number[], color2: number[]): number {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  }

  private findClosestColor(color: number[]): number[] {
    let minDistance = Infinity;
    let closestColor = color;

    for (const reducedColor of this.reducedColors) {
      const distance = this.colorDistance(color, reducedColor);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = reducedColor;
      }
    }

    return closestColor;
  }

  private kMeans(colors: number[][], k: number, maxIterations: number = 10): number[][] {
    const centroids = colors
      .sort(() => Math.random() - 0.5)
      .slice(0, k)
      .map(color => [...color]);

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      if (this.onProgress) {
        const progress = (iteration / maxIterations) * 50;
        this.onProgress(progress);
      }

      const clusters: number[][][] = Array(k).fill(null).map(() => []);
      
      for (const color of colors) {
        let minDistance = Infinity;
        let closestCentroidIndex = 0;

        for (let i = 0; i < centroids.length; i++) {
          const distance = this.colorDistance(color, centroids[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroidIndex = i;
          }
        }

        clusters[closestCentroidIndex].push(color);
      }

      let changed = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) continue;

        const newCentroid = clusters[i].reduce(
          (acc, color) => color.map((v, j) => acc[j] + v),
          [0, 0, 0]
        ).map(v => Math.round(v / clusters[i].length));

        if (JSON.stringify(newCentroid) !== JSON.stringify(centroids[i])) {
          centroids[i] = newCentroid;
          changed = true;
        }
      }

      if (!changed) break;
    }

    return centroids;
  }

  public processImage(imageData: Uint8ClampedArray, numColors: number): Uint8ClampedArray {
    if (this.onProgress) {
      this.onProgress(5);
    }

    const uniqueColorsSet = new Set<string>();
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = [imageData[i], imageData[i + 1], imageData[i + 2]];
      uniqueColorsSet.add(this.rgbToKey(rgb));
    }

    this.uniqueColors = Array.from(uniqueColorsSet).map(key => 
      key.split(',').map(Number)
    );

    if (this.onProgress) {
      this.onProgress(10);
    }

    this.reducedColors = this.kMeans(this.uniqueColors, numColors);

    if (this.onProgress) {
      this.onProgress(60);
    }

    for (const color of this.uniqueColors) {
      const closestColor = this.findClosestColor(color);
      this.colorMap.set(this.rgbToKey(color), closestColor);
    }

    if (this.onProgress) {
      this.onProgress(80);
    }

    const newImageData = new Uint8ClampedArray(imageData.length);
    const totalPixels = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = [imageData[i], imageData[i + 1], imageData[i + 2]];
      const newColor = this.colorMap.get(this.rgbToKey(rgb)) || rgb;
      
      newImageData[i] = newColor[0];
      newImageData[i + 1] = newColor[1];
      newImageData[i + 2] = newColor[2];
      newImageData[i + 3] = imageData[i + 3];

      if (this.onProgress && i % 10000 === 0) {
        const pixelProgress = (i / 4) / totalPixels;
        this.onProgress(80 + pixelProgress * 20);
      }
    }

    if (this.onProgress) {
      this.onProgress(100);
    }

    return newImageData;
  }

  public getReducedColors(): number[][] {
    return this.reducedColors;
  }
}