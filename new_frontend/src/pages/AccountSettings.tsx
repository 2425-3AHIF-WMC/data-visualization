import React, { useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

/**
 * AccountSettingsPage
 *
 * Frontend für die Account-Einstellungen mit allen Standardfunktionen:
 * - Profilbild ändern
 * - Name, E-Mail, Telefonnummer
 * - Passwort ändern
 * - Logout
 * - Account löschen
 */
export default function AccountSettingsPage() {
    const [form, setForm] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+49 123 456789',
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API-Call zum Speichern
        console.log('Speichern', form);
    };

    const handleLogout = () => {
        // TODO: Logout-Logic
        console.log('Logout');
    };

    const handleDeleteAccount = () => {
        // TODO: Account-Lösch-Logic mit Bestätigung
        if (confirm('Möchtest du wirklich deinen Account löschen?')) {
            console.log('Account gelöscht');
        }
    };

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container mx-auto max-w-3xl p-6 bg-card shadow rounded-lg space-y-6">
                <h1 className="text-2xl font-semibold">Account-Einstellungen</h1>
                <p className="text-muted-foreground">
                    Verwalte dein Profil, deine Kontaktdaten und Sicherheitseinstellungen.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profil */}
                    <section>
                        <h2 className="text-lg font-medium mb-4">Profil</h2>
                        <div className="flex items-center gap-6">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src="/path/to/profile.jpg" alt="Profilbild" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label htmlFor="avatar">Profilbild ändern</Label>
                                <Input type="file" id="avatar" className="mt-1" />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Persönliche Daten */}
                    <section>
                        <h2 className="text-lg font-medium mb-4">Persönliche Daten</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} onChange={handleChange} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="email">E-Mail</Label>
                                <Input id="email" type="email" value={form.email} onChange={handleChange} className="mt-1" />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="phone">Telefonnummer</Label>
                                <Input id="phone" type="tel" value={form.phone} onChange={handleChange} className="mt-1" />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Sicherheit */}
                    <section>
                        <h2 className="text-lg font-medium mb-4">Sicherheit</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                                <Input id="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="newPassword">Neues Passwort</Label>
                                <Input id="newPassword" type="password" value={form.newPassword} onChange={handleChange} className="mt-1" />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Aktionen */}
                    <section>
                        <h2 className="text-lg font-medium mb-4">Aktionen</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button variant="outline" onClick={handleLogout} className="w-full md:w-auto">
                                Logout
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount} className="w-full md:w-auto">
                                Account löschen
                            </Button>
                        </div>
                    </section>

                    {/* Speichern */}
                    <div className="flex justify-end">
                        <Button type="submit">Speichern</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
