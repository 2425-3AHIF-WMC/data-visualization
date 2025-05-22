import React, {useEffect, useState} from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {User,  Bell, Shield, } from "lucide-react";
import {Layout} from "@/components/Layout.tsx";
import {apiFetch} from "@/utils/api.ts";

export function AccountSettings() {
    const {toast} = useToast();

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        profile_pic:"",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);

    const token= localStorage.getItem("jwt");


    // Beim Mount: User-Daten vom Server holen
    useEffect(() => {
        if (!token) {
            toast({ title: "Nicht authentifiziert", description: "Bitte einloggen.", variant: "destructive" });
            setLoading(false);
            return;
        }

        const fetchUser = async () => {

            try {
                console.log("Token-Typ:", typeof token);
                console.log("Token-Inhalt:", token);

                const data:any = await apiFetch('user/profile', 'GET', undefined, {
                    Authorization: `Bearer ${token}`
                });
                setUser(data.user);
                setFormData({
                    firstName: data.user.firstname || '',
                    lastName: data.user.lastname || '',
                    email: data.user.mail || '',
                    phone: data.user.telNr || '',
                    profile_pic: data.user.profile_pic,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch (err) {
                console.error('Fehler beim Laden des Profils', err);
                toast({ title: "Fehler", description: "Profil konnte nicht geladen werden", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

     fetchUser();
    }, [token, toast]);



    const handleInputChange = (e) => {
        /*const {id, value} = e.target;
        setFormData({...formData, [id]: value});*/
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        if (!token) return;

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast({
                title: "Fehler",
                description: "Die neuen Passwörter stimmen nicht überein",
                variant: "destructive"
            });
            return;
        }

        try {
            await apiFetch(
                '/user/profile',
                'PUT',
                {
                    firstname: formData.firstName,
                    lastname: formData.lastName,
                    mail: formData.email,
                    telNr: formData.phone
                },
                {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            );

            if(formData.newPassword){
                await apiFetch(
                    '/user/change-password',
                    'POST',
                    {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    },
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                );
            }
            toast({ title: "Gespeichert", description: "Deine Änderungen wurden gespeichert" });
            const updated = await apiFetch('/user/profile', 'GET', undefined, { Authorization: `Bearer ${token}` });
            setUser(updated);

        } catch (error) {
            console.error('Fehler beim Speichern', error);
            toast({ title: "Fehler", description: "Speichern fehlgeschlagen", variant: "destructive" });
        }
        const handleLogout = () => {
            localStorage.removeItem('jwt');
            window.location.reload();
        };

        const handleDeleteAccount = async () => {
            if (!token) return;
            if (!confirm('Möchtest du wirklich deinen Account löschen?')) return;

            try {
                await apiFetch('/user/account', 'DELETE', undefined, { Authorization: `Bearer ${token}` });
                toast({ title: 'Account gelöscht', description: 'Bis bald!' });
                handleLogout();
            } catch (err) {
                console.error('Fehler beim Löschen', err);
                toast({ title: 'Fehler', description: 'Account konnte nicht gelöscht werden', variant: 'destructive' });
            }
        };

        if (loading) {
            return <Layout><p>Lade Profil …</p></Layout>;
        }

     /*   const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email
        };*/

      /*  localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);*/

        toast({
            title: "Gespeichert",
            description: "Deine Änderungen wurden erfolgreich gespeichert"
        });
    };

    return (
        <Layout>
            <div className="flex justify-center px-4 py-10">
                <div className="w-full max-w-4xl space-y-10">
                    <div>
                        <h1 className="text-3xl font-bold">Account-Einstellungen</h1>
                        <p className="text-muted-foreground">
                            Verwalte dein Profil, Passwort und persönliche Einstellungen.
                        </p>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid grid-cols-3 gap-2 mb-6">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User size={16}/>
                                <span className="hidden sm:inline">Profil</span>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell size={16}/>
                                <span className="hidden sm:inline">Benachrichtigungen</span>
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="flex items-center gap-2">
                                <Shield size={16}/>
                                <span className="hidden sm:inline">Datenschutz</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20 border">
                                    <AvatarImage src={formData.profile_pic} />
                                    <AvatarFallback className="text-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                        {(formData.firstName?.charAt(0) ?? "U").toUpperCase()}
                                        {(formData.lastName?.charAt(0) ?? "").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="font-medium">Profilbild</h3>
                                    <p className="text-sm text-muted-foreground">JPG, GIF oder PNG. Maximal 2MB.</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" variant="outline">Hochladen</Button>
                                        <Button size="sm" variant="ghost">Entfernen</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Vorname / Nachname */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Vorname</Label>
                                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nachname</Label>
                                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* E-Mail / Telefonnummer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-Mail</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* Passwort ändern */}
                            <div className="pt-4 border-t">
                                <h3 className="font-medium mb-4">Passwort ändern</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                                        <Input id="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Neues Passwort</Label>
                                        <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                                        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>


                        <TabsContent value="notifications">
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Neue Kommentare",
                                        desc: "Benachrichtigungen über neue Kommentare zu deinen Visualisierungen"
                                    },
                                    {
                                        title: "Dashboard Updates",
                                        desc: "Benachrichtigungen über Änderungen an deinen Dashboards"
                                    },
                                    {
                                        title: "Newsletter",
                                        desc: "Monatliche Updates zu neuen Features"
                                    }
                                ].map((notif, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{notif.title}</p>
                                            <p className="text-sm text-muted-foreground">{notif.desc}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">Aus</Button>
                                            <Button variant="outline" size="sm" className="bg-purple-50">Ein</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="privacy">
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Profil öffentlich sichtbar",
                                        desc: "Andere Nutzer können dein Profil sehen"
                                    },
                                    {
                                        title: "Datennutzung",
                                        desc: "Anonyme Nutzungsdaten sammeln, um den Service zu verbessern"
                                    }
                                ].map((privacy, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{privacy.title}</p>
                                            <p className="text-sm text-muted-foreground">{privacy.desc}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">Aus</Button>
                                            <Button variant="outline" size="sm" className="bg-purple-50">Ein</Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t">
                                    <h3 className="font-medium mb-3">Datenlöschung</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Das Löschen deines Kontos entfernt alle deine Daten und kann nicht rückgängig
                                        gemacht werden.
                                    </p>
                                    <Button variant="destructive" size="sm">Account löschen</Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="secondary">Zurück</Button>
                        <Button onClick={handleSave}>Speichern</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AccountSettings;