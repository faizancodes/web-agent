export interface ResumeResult {
  url: string;
  relevanceScore: number;
  explanation: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  headings: {
    h1: string;
    h2: string;
  };
}

export interface AnalysisResult {
  analysis: any; // Keep as any for now since we don't know the exact structure
  metadata: PageMetadata;
}

export interface FormState {
  url: string;
  prompt: string;
}

export interface LoadingState {
  isLoading: boolean;
  isAnalyzingResume: boolean;
}

export interface ErrorState {
  error: string | null;
}
