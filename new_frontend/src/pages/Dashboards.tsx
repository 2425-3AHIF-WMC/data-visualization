import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {LayoutDashboard, Search, Trash2, Edit, Share2, Plus} from "lucide-react";
import {format} from "date-fns";
import {useToast} from "@/hooks/use-toast";
import {Link} from "react-router-dom";
import {Layout} from "../components/Layout";

const sampleDashboards = [
    {
        id: 1,
        name: "Umsatzübersicht",
        description: "Monatlicher Umsatz und wichtige KPIs",
        createdAt: new Date(2023, 11, 10),
        lastModified: new Date(2024, 3, 5),
        chartCount: 4
    },
    {
        id: 2,
        name: "Marketing Analytics",
        description: "Kampagnen-Performance und Conversion-Raten",
        createdAt: new Date(2024, 0, 15),
        lastModified: new Date(2024, 2, 28),
        chartCount: 6
    },
    {
        id: 3,
        name: "Produktperformance",
        description: "Produktverkäufe und Bestandsübersicht",
        createdAt: new Date(2024, 1, 22),
        lastModified: new Date(2024, 2, 18),
        chartCount: 5
    }
];

const Dashboards = () => {
    const {toast} = useToast();
    const [dashboards, setDashboards] = useState(sampleDashboards);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: number) => {
        setDashboards(dashboards.filter(dashboard => dashboard.id !== id));
        toast({
            title: "Dashboard gelöscht",
            description: "Das Dashboard wurde erfolgreich entfernt."
        });
    };

    const handleShare = (name: string) => {
        toast({
            title: "Link kopiert",
            description: `Link zum Dashboard "${name}" wurde in die Zwischenablage kopiert.`
        });
    };

    const filteredDashboards = dashboards.filter(dashboard =>
        dashboard.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Meine Dashboards</h1>
                    <p className="text-gray-600">Verwalten und bearbeiten Sie Ihre Dashboards</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"/>
                        <Input
                            placeholder="Suchen nach Namen..."
                            className="pl-9 w-full sm:w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button asChild>
                        <Link to="/dashboards/new">
                            <Plus className="h-4 w-4 mr-2"/>
                            Dashboard erstellen
                        </Link>
                    </Button>
                </div>

                {filteredDashboards.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                            <LayoutDashboard className="h-8 w-8 text-blue-600"/>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Keine Dashboards gefunden</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? "Versuchen Sie, Ihre Suchkriterien anzupassen"
                                : "Erstellen Sie Ihr erstes Dashboard, um Ihre Daten zu visualisieren"}
                        </p>
                        <Button asChild>
                            <Link to="/dashboards/new">Dashboard erstellen</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDashboards.map((dashboard) => (
                            <Card key={dashboard.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 dark:bg-gray-800/30">
                                    <CardTitle className="flex justify-between items-center text-base">
                                        <span className="truncate">{dashboard.name}</span>
                                        <LayoutDashboard className="h-5 w-5 text-blue-600 shrink-0"/>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{dashboard.description}</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Diagramme:</span>
                                            <span className="font-medium">{dashboard.chartCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Erstellt am:</span>
                                            <span
                                                className="font-medium">{format(dashboard.createdAt, "dd.MM.yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Zuletzt geändert:</span>
                                            <span
                                                className="font-medium">{format(dashboard.lastModified, "dd.MM.yyyy")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-wrap gap-2 p-4 border-t">
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(dashboard.id)}>
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        Löschen
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleShare(dashboard.name)}>
                                        <Share2 className="h-4 w-4 mr-2"/>
                                        Teilen
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/dashboards/${dashboard.id}`}>
                                            <Edit className="h-4 w-4 mr-2"/>
                                            Bearbeiten
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboards;
