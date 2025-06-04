import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface ExportPanelProps {
    onExport: (format: 'png' | 'svg' | 'json') => void;
    onClose: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, onClose }) => {
    return (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Visualisierung exportieren</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" onClick={() => onExport('png')}>
                        <Download className="h-4 w-4 mr-2" /> PNG
                    </Button>
                    <Button variant="outline" onClick={() => onExport('svg')}>
                        <Download className="h-4 w-4 mr-2" /> SVG
                    </Button>
                    <Button variant="outline" onClick={() => onExport('json')}>
                        <Download className="h-4 w-4 mr-2" /> JSON
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExportPanel;