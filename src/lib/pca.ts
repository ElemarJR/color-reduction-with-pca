export class PCA {
  private mean: number[] = [];
  private eigenvectors: number[][] = [];

  // Standardize the data
  private standardize(data: number[][]): number[][] {
    const n = data.length;
    const p = data[0].length;
    this.mean = new Array(p).fill(0);

    // Calculate mean
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        this.mean[j] += data[i][j];
      }
    }
    this.mean = this.mean.map(m => m / n);

    // Center the data
    return data.map(row =>
      row.map((val, j) => val - this.mean[j])
    );
  }

  // Calculate covariance matrix
  private covariance(data: number[][]): number[][] {
    const n = data.length;
    const p = data[0].length;
    const cov = Array(p).fill(0).map(() => Array(p).fill(0));

    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += data[k][i] * data[k][j];
        }
        cov[i][j] = sum / (n - 1);
      }
    }
    return cov;
  }

  // Power iteration method to find principal eigenvector
  private powerIteration(matrix: number[][], iterations: number = 100): number[] {
    const n = matrix.length;
    let eigenvector = Array(n).fill(0).map(() => Math.random());
    
    for (let iter = 0; iter < iterations; iter++) {
      // Matrix multiplication
      const newVector = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newVector[i] += matrix[i][j] * eigenvector[j];
        }
      }
      
      // Normalize
      const norm = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
      eigenvector = newVector.map(val => val / norm);
    }
    
    return eigenvector;
  }

  // Fit the PCA model
  public fit(data: number[][], components: number): void {
    const standardizedData = this.standardize(data);
    const covMatrix = this.covariance(standardizedData);
    
    this.eigenvectors = [];
    let currentMatrix = covMatrix;
    
    for (let i = 0; i < components; i++) {
      const eigenvector = this.powerIteration(currentMatrix);
      this.eigenvectors.push(eigenvector);
      
      // Deflate the matrix
      const projection = Array(covMatrix.length).fill(0).map(() => Array(covMatrix.length).fill(0));
      for (let j = 0; j < covMatrix.length; j++) {
        for (let k = 0; k < covMatrix.length; k++) {
          projection[j][k] = eigenvector[j] * eigenvector[k];
        }
      }
      
      currentMatrix = currentMatrix.map((row, j) =>
        row.map((val, k) => val - projection[j][k])
      );
    }
  }

  // Transform data using fitted PCA
  public transform(data: number[][]): number[][] {
    const centered = data.map(row =>
      row.map((val, j) => val - this.mean[j])
    );
    
    return centered.map(row => 
      this.eigenvectors.map(eigenvector =>
        row.reduce((sum, val, j) => sum + val * eigenvector[j], 0)
      )
    );
  }

  // Inverse transform to reconstruct original data
  public inverseTransform(transformed: number[][]): number[][] {
    return transformed.map(row =>
      Array(this.mean.length).fill(0).map((_, i) =>
        row.reduce((sum, val, j) => sum + val * this.eigenvectors[j][i], 0) + this.mean[i]
      )
    );
  }
}