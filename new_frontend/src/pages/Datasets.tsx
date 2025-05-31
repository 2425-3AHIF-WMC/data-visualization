import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Navbar} from '@/components/Navbar';
import {Database, Search, Trash2, Edit, Plus} from "lucide-react";
import {format} from "date-fns";
import {useToast} from "@/hooks/use-toast";
import {Link} from "react-router-dom";
import {Layout} from '../components/Layout';
import {apiFetch} from "@/utils/api.ts";


export const sampleDatasets = [
    {
        id: 1,
        name: "Verkaufsdaten 2023",
        recordCount: 1250,
        createdAt: new Date(2023, 10, 15),
        lastModified: new Date(2024, 2, 10),
        fileType: "CSV",
        data: [
            { Monat: "Januar", Umsatz: 12000 },
            { Monat: "Februar", Umsatz: 13000 },
            { Monat: "Juni", Umsatz: 13511 },
            { Monat: "Juli", Umsatz: 20024 },
            { Monat: "Dezember", Umsatz: 15000 }
        ],
        fields: ["Monat", "Umsatz"]
    },
    {
        id: 2,
        name: "Kundendaten",
        recordCount: 856,
        createdAt: new Date(2023, 8, 22),
        lastModified: new Date(2024, 1, 28),
        fileType: "JSON",
        data: [
            { Region: "Nord", Kundenanzahl: 150 },
            { Region: "Süd", Kundenanzahl: 200 },
            { Region: "Ost", Kundenanzahl: 180 },
            { Region: "West", Kundenanzahl: 170 },
            { Region: "Mitte", Kundenanzahl: 190 },
        ],
        fields: ["Region", "Kundenanzahl"],
    },
    {
        id: 3,
        name: "Produktinventar",
        recordCount: 426,
        createdAt: new Date(2024, 1, 5),
        lastModified: new Date(2024, 3, 15),
        fileType: "CSV",
        data: [
            { Artikel: "Tisch", Lagerbestand: 45 },
            { Artikel: "Stuhl", Lagerbestand: 120 },
            { Artikel: "Lampe", Lagerbestand: 70 },
            { Artikel: "Sofa", Lagerbestand: 25 },
            { Artikel: "Regal", Lagerbestand: 60 },
        ],
        fields: ["Artikel", "Lagerbestand"],
    },
    {
        id: 4,
        name: "Finanzbericht Q1 2024",
        recordCount: 324,
        createdAt: new Date(2024, 2, 1),
        lastModified: new Date(2024, 2, 1),
        fileType: "Excel",
        data: [
            { Quartal: "Q1", Gewinn: 30000 },
            { Quartal: "Q2", Gewinn: 25000 },
            { Quartal: "Q3", Gewinn: 40000 },
            { Quartal: "Q4", Gewinn: 35000 },
            { Quartal: "Q5", Gewinn: 37000 },
            { Quartal: "Q6", Gewinn: 39000 },
        ],
        fields: ["Quartal", "Gewinn"],
    }
];



const Datasets = () => {
    const {toast} = useToast();
    const [datasets, setDatasets] = useState(sampleDatasets);
    const [searchTerm, setSearchTerm] = useState('');


    // 1. useEffect, um User-Datasets beim Mounten zu laden
    useEffect(() => {
        const fetchUserDatasets=async ()=>{
            try{
                const token = localStorage.getItem("jwt");
                if (!token) {
                    throw new Error("Kein Auth-Token gefunden");
                }

                // 2. Mit apiFetch den GET-Request absetzen und Authorization-Header mitschicken
                const json = await apiFetch<{
                    datasets: Array<{
                        id: number;
                        name: string;
                        recordCount: number;
                        createdAt: string;
                        lastModified: string;
                        fileType: string;
                        data: any[];
                        fields: string[];
                    }>;
                }>(
                    "datasets",         // -> wird zu http://localhost:3000/api/datasets
                    "GET",
                    undefined,
                    {
                        Authorization: `Bearer ${token}`,
                    }
                );

                if (Array.isArray(json.datasets)) {
                    // 3. Rückgabe ins richtige Format umwandeln (Date-Strings -> Date-Objekte)
                    const userDatasets = json.datasets.map((ds) => ({
                        id: ds.id,
                        name: (ds as any).datasetName ?? (ds as any).name ?? "Unbenannt",
                        recordCount: ds.recordCount,
                        createdAt: new Date(ds.createdAt),
                        lastModified: new Date(ds.lastModified),
                        fileType: ds.fileType,
                        data: ds.data,
                        fields: ds.fields,
                          }));

                    setDatasets((prev) => [...prev, ...userDatasets]);}
            }catch (error){
                    console.error("Error fetching user datasets:", error);
                    toast({
                        title: "Fehler",
                        description: "Konnte Nutzerdatensätze nicht laden.",
                        variant: "destructive",
                    });
            }
        };
        fetchUserDatasets();
    }, [toast]);

    const handleDelete = (id: number) => {
        setDatasets(datasets.filter(dataset => dataset.id !== id));
        toast({
            title: "Datensatz gelöscht",
            description: "Der Datensatz wurde erfolgreich entfernt."
        });
    };

    const filteredDatasets = datasets.filter(dataset =>
        dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Meine Datensätze</h1>
                    <p>Verwalten Sie Ihre importierten Datensätze</p>
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
                        <Link to="/import">
                            <Plus className="h-4 w-4 mr-2"/>
                            Datensatz importieren
                        </Link>
                    </Button>
                </div>

                {filteredDatasets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                            <Database className="h-8 w-8 text-blue-600"/>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Keine Datensätze gefunden</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? "Versuchen Sie, Ihre Suchkriterien anzupassen"
                                : "Importieren Sie Ihren ersten Datensatz, um loszulegen"}
                        </p>
                        <Button asChild>
                            <Link to="/upload">Datensatz importieren</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDatasets.map((dataset) => (
                            <Card key={dataset.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 dark:bg-gray-800/30">
                                    <CardTitle className="flex justify-between items-center text-base">
                                        <span className="truncate">{dataset.name}</span>
                                        <Database className="h-5 w-5 text-blue-600 shrink-0"/>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Datensätze:</span>
                                            <span className="font-medium">{dataset.recordCount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Format:</span>
                                            <span className="font-medium">{dataset.fileType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Erstellt am:</span>
                                            <span
                                                className="font-medium">{format(dataset.createdAt, "dd.MM.yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Zuletzt geändert:</span>
                                            <span
                                                className="font-medium">{format(dataset.lastModified, "dd.MM.yyyy")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-4 border-t">
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(dataset.id)}>
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        Löschen
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/datasets/${dataset.id}`}>
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

export default Datasets;
