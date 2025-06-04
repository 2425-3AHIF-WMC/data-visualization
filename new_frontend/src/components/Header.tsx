
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Home, Database, FileText, Upload, Settings, User, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Data-Visualisation</span>
          </div>
          
          <nav className="flex space-x-6">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Home
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Datensätze
            </Button>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
              Erstellen
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Diagramme
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Import
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <span className="text-sm text-gray-600">Account-Einstellungen</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">GA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
