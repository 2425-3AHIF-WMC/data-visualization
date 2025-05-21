
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarBig, ChartLine, ChartPie, Map, Table, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
//import SampleChart from "@/components/SampleChart";
import SampleBarChart from "@/components/SampleBarChart";
// import SamplePieChart from "@/components/SamplePieChart";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VisualizationCreator = () => {
    const [activeTab, setActiveTab] = useState("charts");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Visualisierungen erstellen</h1>
                <p className="text-gray-600">Erstellen Sie verschiedene Arten von Visualisierungen für Ihre Daten</p>
            </div>

            <Tabs defaultValue="charts" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 sm:grid-cols-5 mb-6">
                    <TabsTrigger value="charts" className="flex items-center gap-2">
                        <ChartBarBig className="h-4 w-4" />
                        <span className="hidden sm:inline">Diagramme</span>
                    </TabsTrigger>
                    <TabsTrigger value="tables" className="flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        <span className="hidden sm:inline">Tabellen</span>
                    </TabsTrigger>
                    <TabsTrigger value="maps" className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        <span className="hidden sm:inline">Karten</span>
                    </TabsTrigger>
                    <TabsTrigger value="explanations" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Erklärungen</span>
                    </TabsTrigger>
                </TabsList>

                {/* Diagramme Tab */}
                <TabsContent value="charts" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <VisualizationCard
                            title="Liniendiagramm"
                            description="Zeigt Trends und Entwicklungen über einen Zeitraum hinweg an."
                            icon={<ChartLine className="h-5 w-5 text-blue-600" />}
                        >
                            <div className="h-[180px] bg-gray-50 dark:bg-gray-800/30 rounded border flex items-center justify-center">
                                {/* <SampleChart />*/}
                            </div>
                            <p className="text-sm mt-4">Ideal für: Zeitreihen, Trends, kontinuierliche Daten</p>
                            <Button className="mt-4 w-full">Erstellen</Button>
                        </VisualizationCard>

                        <VisualizationCard
                            title="Balkendiagramm"
                            description="Vergleicht Werte verschiedener Kategorien miteinander."
                            icon={<ChartBarBig className="h-5 w-5 text-blue-600" />}
                        >
                            <div className="h-[180px] bg-gray-50 dark:bg-gray-800/30 rounded border flex items-center justify-center">
                                <SampleBarChart />
                            </div>
                            <p className="text-sm mt-4">Ideal für: Kategorische Vergleiche, Ranglisten, Verteilungen</p>
                            <Button className="mt-4 w-full">Erstellen</Button>
                        </VisualizationCard>

                        <VisualizationCard
                            title="Kreisdiagramm"
                            description="Stellt die prozentuale Verteilung von Daten dar."
                            icon={<ChartPie className="h-5 w-5 text-blue-600" />}
                        >
                            <div className="h-[180px] bg-gray-50 dark:bg-gray-800/30 rounded border flex items-center justify-center">
                                { /*<SamplePieChart />*/}
                            </div>
                            <p className="text-sm mt-4">Ideal für: Anteilsverteilung, Zusammensetzung von Daten</p>
                            <Button className="mt-4 w-full">Erstellen</Button>
                        </VisualizationCard>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Diagramm-Tipps</CardTitle>
                            <CardDescription>
                                Allgemeine Hinweise zur Auswahl des richtigen Diagrammtyps
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Liniendiagramm:</strong> Optimal für die Darstellung von Trends über Zeit und kontinuierliche Daten.</li>
                                <li><strong>Balkendiagramm:</strong> Perfekt für den Vergleich von Werten zwischen verschiedenen Kategorien.</li>
                                <li><strong>Kreisdiagramm:</strong> Geeignet für die Darstellung von prozentualen Anteilen am Gesamtwert (nicht mehr als 5-7 Kategorien).</li>
                                <li><strong>Streudiagramm:</strong> Nützlich, um Beziehungen zwischen zwei numerischen Variablen zu zeigen.</li>
                                <li><strong>Heatmap:</strong> Gut zur Visualisierung von Mustern in großen Datensätzen.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tabellen Tab */}
                <TabsContent value="tables" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tabellen erstellen</CardTitle>
                            <CardDescription>
                                Organisieren Sie Ihre Daten in übersichtlichen und interaktiven Tabellen
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p>Tabellen sind ideal für die detaillierte Darstellung von strukturierten Daten. Sie ermöglichen:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Präzise Anzeige von Datenwerten</li>
                                    <li>Sortierung nach verschiedenen Spalten</li>
                                    <li>Filterung nach bestimmten Kriterien</li>
                                    <li>Paginierung für große Datenmengen</li>
                                </ul>

                                <div className="mt-6 border rounded-lg overflow-hidden">
                                    <UITable>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produkt</TableHead>
                                                <TableHead>Kategorie</TableHead>
                                                <TableHead>Preis</TableHead>
                                                <TableHead className="text-right">Bestand</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Laptop Pro</TableCell>
                                                <TableCell>Elektronik</TableCell>
                                                <TableCell>€1299,00</TableCell>
                                                <TableCell className="text-right">45</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Smartphone XS</TableCell>
                                                <TableCell>Elektronik</TableCell>
                                                <TableCell>€699,00</TableCell>
                                                <TableCell className="text-right">28</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Bürostuhl</TableCell>
                                                <TableCell>Möbel</TableCell>
                                                <TableCell>€249,00</TableCell>
                                                <TableCell className="text-right">12</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </UITable>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Tabelle erstellen</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Karten Tab */}
                <TabsContent value="maps" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Karten erstellen</CardTitle>
                            <CardDescription>
                                Visualisieren Sie geografische Daten mit interaktiven Karten
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p>Karten sind ideal für die Visualisierung von:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Standortdaten und geografischen Verteilungen</li>
                                    <li>Regionale Verkaufszahlen oder Marktdurchdringung</li>
                                    <li>Demografische oder sozioökonomische Daten nach Region</li>
                                    <li>Logistik- und Lieferkettenverfolgung</li>
                                </ul>

                                <div className="mt-6 bg-gray-100 dark:bg-gray-800/50 h-72 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <Map className="h-12 w-12 mx-auto text-blue-600" />
                                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                                            Laden Sie einen Datensatz mit geografischen Daten hoch, um eine Karte zu erstellen
                                        </p>
                                        <Button className="mt-4">Datensatz auswählen</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Karte erstellen</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Erklärungen Tab */}
                <TabsContent value="explanations" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daten erklären und interpretieren</CardTitle>
                            <CardDescription>
                                Erstellen Sie automatische Erklärungen und Einsichten zu Ihren Daten
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p>Mit unserem Analyse-Tool können Sie:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Statistiken und Zusammenfassungen Ihrer Daten generieren</li>
                                    <li>Schlüsseltrends und Anomalien automatisch identifizieren</li>
                                    <li>Korrelationen zwischen verschiedenen Datenpunkten entdecken</li>
                                    <li>Dateninterpretationen in natürlicher Sprache erhalten</li>
                                </ul>

                                <div className="mt-6 border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                                    <h3 className="font-medium mb-2">Beispiel einer Dateninterpretation:</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        "Die Verkaufsdaten zeigen einen deutlichen Anstieg im Q4 2023 (+18% im Vergleich
                                        zum Vorjahr), wobei die Produktkategorie 'Elektronik' den größten Beitrag leistet.
                                        Die Region 'Süd' weist die höchste Wachstumsrate auf (27%), während in der Region
                                        'West' ein leichter Rückgang (-3%) zu verzeichnen ist."
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Analyse starten</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const VisualizationCard = ({ title, description, icon, children }) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/30">
                <CardTitle className="flex justify-between items-center text-base">
                    <span>{title}</span>
                    {icon}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {children}
            </CardContent>
        </Card>
    );
};

export default VisualizationCreator;
