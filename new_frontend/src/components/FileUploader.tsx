
import React, { useCallback, useState, ReactNode } from 'react';
import { cn } from '../lib/utils';
import { FileUp, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

type FileUploaderProps = {
  onFileUpload: (file: File) => void;
  accept: string;
  className?: string;
  children?: ReactNode;
};

export function FileUploader({ onFileUpload, accept, className, children }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = useCallback((file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension) {
      toast({
        title: "Fehler bei der Datei",
        description: "Die Datei hat keine Erweiterung.",
        variant: "destructive",
      });
      return;
    }

    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );

    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Nicht unterstütztes Format",
        description: `Die Datei muss eines der folgenden Formate haben: ${accept}`,
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    onFileUpload(file);
    
    toast({
      title: "Datei hochgeladen",
      description: `${file.name} wurde erfolgreich hochgeladen.`,
    });
  }, [accept, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 transition-all text-center",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
          {fileName ? (
            <FileUp className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">
            {fileName ? 'Datei bereit' : 'Datei hochladen'}
          </h3>
          
          {fileName ? (
            <p className="text-sm text-muted-foreground">{fileName}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ziehen Sie eine Datei hierher oder klicken Sie, um eine auszuwählen
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            Unterstützte Formate: {accept}
          </p>
        </div>

        <input
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {children || (
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Datei auswählen
          </Button>
        )}
      </div>
    </div>
  );
}
