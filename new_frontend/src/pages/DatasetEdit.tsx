import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Database, ArrowLeft, Save, Trash2} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {format} from "date-fns";
import {Layout} from '../components/Layout';
import {apiFetch} from "@/utils/api.ts";

interface Column {
    name: string;
    type: string;

    [key: string]: any;  // erlaubt beliebige weitere Properties
}

// Sample dataset structure
interface Dataset {
    id: number;
    name: string;
    recordCount: number;
    createdAt: Date;
    lastModified: Date;
    fileType: string;
    description?: string;
    tags?: string[];
    columns?: Column[];
    data?: { [key: string]: any }[];
}

// Sample datasets for demonstration
const sampleDatasets: Dataset[] = [
    {
        id: 1,
        name: "Verkaufsdaten 2023",
        recordCount: 1250,
        createdAt: new Date(2023, 10, 15),
        lastModified: new Date(2024, 2, 10),
        fileType: "CSV",
        description: "Monatliche Verkaufszahlen für das Jahr 2023",
        tags: ["verkauf", "2023", "monatlich"],
        columns: [
            {name: "Monat", type: "string"},
            {name: "Produkt", type: "string"},
            {name: "Umsatz", type: "number"},
            {name: "Menge", type: "number"}
        ]
    },
    {
        id: 2,
        name: "Kundendaten",
        recordCount: 856,
        createdAt: new Date(2023, 8, 22),
        lastModified: new Date(2024, 1, 28),
        fileType: "JSON",
        description: "Kundendatenbank mit Kontaktinformationen",
        tags: ["kunden", "kontakte", "datenbank"],
        columns: [
            {name: "Name", type: "string"},
            {name: "Email", type: "string"},
            {name: "Telefon", type: "string"},
            {name: "Letzte Aktivität", type: "date"}
        ]
    },
    {
        id: 3,
        name: "Produktinventar",
        recordCount: 426,
        createdAt: new Date(2024, 1, 5),
        lastModified: new Date(2024, 3, 15),
        fileType: "CSV",
        description: "Aktueller Lagerbestand aller Produkte",
        tags: ["inventar", "produkte", "lager"],
        columns: [
            {name: "Produkt-ID", type: "string"},
            {name: "Produktname", type: "string"},
            {name: "Kategorie", type: "string"},
            {name: "Menge", type: "number"},
            {name: "Preis", type: "number"}
        ]
    },
    {
        id: 4,
        name: "Finanzbericht Q1 2024",
        recordCount: 324,
        createdAt: new Date(2024, 2, 1),
        lastModified: new Date(2024, 2, 1),
        fileType: "Excel",
        description: "Finanzbericht für das erste Quartal 2024",
        tags: ["finanzen", "bericht", "Q1", "2024"],
        columns: [
            {name: "Kategorie", type: "string"},
            {name: "Januar", type: "number"},
            {name: "Februar", type: "number"},
            {name: "März", type: "number"},
            {name: "Summe", type: "number"}
        ]
    }
];

// Sample data preview
const sampleDataPreview = [
    ["Monat", "Produkt", "Umsatz", "Menge"],
    ["Januar", "Laptop", "2500", "5"],
    ["Januar", "Smartphone", "1800", "6"],
    ["Februar", "Laptop", "3000", "6"],
    ["Februar", "Smartphone", "2100", "7"],
    ["März", "Laptop", "2800", "5"],
    ["März", "Smartphone", "1500", "5"]
];

const DatasetEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {toast} = useToast();
    const token = localStorage.getItem("jwt")

    // Find dataset by ID
    const datasetId = parseInt(id || "0");
    //const initialDataset = sampleDatasets.find(ds => ds.id === datasetId);

    // State for dataset form
    //const [dataset, setDataset] = useState<Dataset | undefined>(initialDataset);
    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    // Check if dataset exists
    useEffect(() => {
        const fetchDataSet = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!token) throw new Error("Kein Auth-Token gefunden");

                const response: any = await apiFetch(
                    `datasets/${datasetId}`,
                    "GET",
                    undefined,
                    {Authorization: `Bearer ${token}`}
                );

                console.log("API-Response in DatasetEdit:", response);
                const parseGermanDate = (d: string): Date => {
                    // Exakt "31.5.2025" oder "1.12.2024"
                    const [dayStr, monthStr, yearStr] = d.split(".");
                    const day = parseInt(dayStr, 10);
                    const month = parseInt(monthStr, 10) - 1; // Monat ist 0-basiert
                    const year = parseInt(yearStr, 10);
                    return new Date(year, month, day);
                };

                const createdAtDate = parseGermanDate(response.createdAt);
                const lastModifiedDate = parseGermanDate(response.lastModified);

                let columns: Column[] = [];
                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Beispiel: response.data[0] === { ID: "1", Name: "Lena Müller", ... }
                    const firstRowObj = response.data[0];
                    columns = Object.keys(firstRowObj).map((key) => {
                        return {
                            name: key,
                            type: "string", // ggf. später dynamisch ermitteln oder aus einem Schema nehmen
                        };
                    });
                }

                const parsedDataset: Dataset = {
                    id: response.id,
                    name: response.name,
                    recordCount: Array.isArray(response.data) ? response.data.length : 0,
                    createdAt: createdAtDate,
                    lastModified: lastModifiedDate,
                    fileType: "JSON", // oder was immer deine API im Feld "fileType" enthält
                    description: response.description,
                    tags: response.tags, // falls deine API Tags liefert, hier einfügen; sonst leer
                    columns: columns,
                    data: Array.isArray(response.data) ? response.data : [],
                };

                setDataset(parsedDataset);

            } catch (error) {
                toast({
                    title: "Fehler",
                    description: "Konnte Datensatz nicht laden.",
                    variant: "destructive"
                });
            }
            setLoading(false);
        }
        fetchDataSet();

    }, [id, toast, token]);


    if (loading) {
        return <div className="p-4">Lade Datensatz...</div>;
    }
    if (!dataset) {
        return <div className="p-4 text-red-500">Datensatz nicht gefunden.</div>;
    }


    // Handle dataset updates
    const handleChange = (field: keyof Dataset, value: any) => {
        if (dataset) {
            setDataset({
                ...dataset,
                [field]: value,
                lastModified: new Date() // Update modification date
            });
        }
    };

    // Add a new tag
    const handleAddTag = () => {
        if (newTag.trim() && dataset) {
            const updatedTags = [...(dataset.tags || []), newTag.trim()];
            handleChange('tags', updatedTags);
            setNewTag("");
        }
    };

    // Remove a tag
    const handleRemoveTag = (tagToRemove: string) => {
        if (dataset && dataset.tags) {
            const updatedTags = dataset.tags.filter(tag => tag !== tagToRemove);
            handleChange('tags', updatedTags);
        }
    };

    // Save changes
    const handleSave = async () => {
        // In a real application, save to backend here
        if (!dataset) {
            return;
        }

        try {
            if (!token) {
                throw new Error("Kein Auth-Token gefunden");
            }

// Bereite den Payload vor – nur die “Allgemeinen Infos”
            //TODO: restlichen daten later

            const payload = {
                name: dataset.name,
                description: dataset.description ?? "",
                tags: dataset.tags ?? [],
            };

            await apiFetch(
                `datasets/${dataset.id}`,
                "PUT",
                payload,
                { Authorization: `Bearer ${token}` }
            );

            toast({
                title: "Änderungen gespeichert",
                description: "Die Änderungen wurden erfolgreich gespeichert."
            });
            navigate("/datasets");
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            toast({
                title: "Fehler",
                description: error.message || "Beim Speichern ist etwas schiefgelaufen.",
                variant: "destructive",
            });
        }
    };

    // Delete dataset
    const handleDelete = async () => {

        await apiFetch(
            `datasets/${datasetId}`,
            "DELETE",
            undefined,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        toast({
            title: "Datensatz gelöscht",
            description: "Der Datensatz wurde erfolgreich gelöscht."
        });
        navigate("/datasets");
    };


    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/datasets">
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Zurück
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Datensatz bearbeiten</h1>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Database className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Erstellt am {format(dataset.createdAt, "dd.MM.yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                                Zuletzt bearbeitet am {format(dataset.lastModified, "dd.MM.yyyy")}
                            </p>

                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Löschen
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2"/>
                            Speichern
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">Allgemein</TabsTrigger>
                        <TabsTrigger value="structure">Datenstruktur</TabsTrigger>
                        <TabsTrigger value="preview">Datenvorschau</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Allgemeine Informationen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name des Datensatzes</Label>
                                    <Input
                                        id="name"
                                        value={dataset.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Beschreibung</Label>
                                    <Input
                                        id="description"
                                        value={dataset.description || ''}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fileType">Dateityp</Label>
                                    <Select
                                        value={dataset.fileType}
                                        onValueChange={(value) => handleChange('fileType', value)}
                                    >
                                        <SelectTrigger id="fileType">
                                            <SelectValue placeholder="Dateityp auswählen"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSV">CSV</SelectItem>
                                            <SelectItem value="JSON">JSON</SelectItem>
                                            <SelectItem value="Excel">Excel</SelectItem>
                                            <SelectItem value="XML">XML</SelectItem>
                                            <SelectItem value="SQL">SQL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {dataset.tags?.map((tag) => (
                                            <div key={tag}
                                                 className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                                                <span className="text-sm">{tag}</span>
                                                <button
                                                    className="ml-2 text-gray-500 hover:text-red-500"
                                                    onClick={() => handleRemoveTag(tag)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Neuen Tag hinzufügen"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <Button type="button" onClick={handleAddTag} variant="outline">
                                            Hinzufügen
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="structure">
                        <Card>
                            <CardHeader>
                                <CardTitle>Datenstruktur</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="py-2 px-4 text-left">Spaltenname</th>
                                            <th className="py-2 px-4 text-left">Datentyp</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataset.columns?.map((column, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2 px-4">{column.name}</td>
                                                <td className="py-2 px-4">
                                                    <Select
                                                        value={column.type}
                                                        onValueChange={(value) => {
                                                            if (dataset.columns) {
                                                                const updatedColumns = [...dataset.columns];
                                                                updatedColumns[index] = {...column, type: value};
                                                                handleChange('columns', updatedColumns);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="string">Text</SelectItem>
                                                            <SelectItem value="number">Zahl</SelectItem>
                                                            <SelectItem value="date">Datum</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Datensatzgröße: {dataset.recordCount} Einträge</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Datenvorschau</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="bg-gray-50 border-b">
                                            {dataset.columns.map((col, i) => (
                                                <th key={i} className="py-2 px-4 text-left font-medium">{col.name}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataset.data.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b">
                                                {dataset.columns!.map((col, colIndex) => (
                                                    <td key={colIndex} className="py-2 px-4">{row[col.name]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t">
                                <p className="text-sm text-gray-500">Zeigt 6 von {dataset.recordCount} Datensätzen</p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
};

export default DatasetEdit;

