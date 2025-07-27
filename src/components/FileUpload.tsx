import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onNext: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onNext }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const supportedTypes = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel'
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && Object.keys(supportedTypes).includes(file.type)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleGenerate = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onNext();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Smart Document Analyzer
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your document and let AI generate intelligent quiz questions
        </p>
      </div>

      <Card className="border-dashed border-2 transition-all duration-300 hover:shadow-medium">
        <CardContent className="p-8">
          {!selectedFile ? (
            <div
              className={cn(
                "relative rounded-lg transition-all duration-300 p-8 text-center",
                isDragOver 
                  ? "bg-primary/5 border-primary/20 border-2 border-dashed" 
                  : "bg-muted/30 border-border border-2 border-dashed"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 animate-float">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                </div>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.xlsx"
                  onChange={handleFileSelect}
                />
                
                <Button asChild variant="hero" size="lg">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>

                <div className="flex flex-wrap gap-2 mt-6">
                  {Object.values(supportedTypes).map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-success-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="success"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-success-foreground border-t-transparent" />
                    Analyzing Document...
                  </>
                ) : (
                  "Generate Quiz Questions"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;