import React, {useEffect, useRef, useState} from "react";
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
import {User, Bell, Shield,} from "lucide-react";
import {Layout} from "@/components/Layout.tsx";
import {apiFetch} from "@/utils/api.ts";
import {useNavigate} from 'react-router-dom';


export function AccountSettings() {
    const navigate= useNavigate()
    const {toast} = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
const [preview, setPreview]= useState<string>("");
    const [user, setUser] = useState(null);
    // ganz am Anfang deiner Function Component:
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        profile_pic: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("jwt");


    // Beim Mount: User-Daten vom Server holen
    useEffect(() => {
        if (!token) {
            toast({title: "Nicht authentifiziert", description: "Bitte einloggen.", variant: "destructive"});
            setLoading(false);
            return;
        }

        const fetchUser = async () => {

            try {
                //     console.log("Token-Typ:", typeof token);
                //     console.log("Token-Inhalt:", token);

                const data: any = await apiFetch('user/profile', 'GET', undefined, {
                    Authorization: `Bearer ${token}`
                });

                console.log("TelNr vom Backend:", data.user.telNr);
                console.log(data.user)

                let profilePicUrl = "";
                if (data.user.profile_pic) {
                    const blob = data.user.profile_pic;
                    profilePicUrl = URL.createObjectURL(blob);
                }

                setUser(data.user);
                setFormData({
                    firstName: data.user.firstname || '',
                    lastName: data.user.lastname || '',
                    email: data.user.email || 'empty mail',
                    phone: data.user.telnr || 'no telNr',
                    profile_pic: profilePicUrl,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setPreview(data.user.profile_pic_url||'');
            } catch (err) {
                console.error('Fehler beim Laden des Profils', err);
                toast({title: "Fehler", description: "Profil konnte nicht geladen werden", variant: "destructive"});
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token, toast]);


    const handleInputChange = (e) => {
        /*const {id, value} = e.target;
        setFormData({...formData, [id]: value});*/
        const {id, value} = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };

    const handleDeleteAccount = async () => {
        if (!token) return;
        if (!confirm('Möchtest du wirklich deinen Account löschen?')) return;

        try {
            await apiFetch('user/account/delete', 'DELETE', undefined, {Authorization: `Bearer ${token}`});
            toast({title: 'Account gelöscht', description: 'Bis bald!'});
            handleLogout();

        } catch (err) {
            console.error('Fehler beim Löschen', err);
            toast({title: 'Fehler', description: 'Account konnte nicht gelöscht werden', variant: 'destructive'});
        }

    };

    const handlePicUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.size > 2 * 1024 * 1024) {
            toast({title: "Datei zu groß", description: "Maximal 2MB", variant: "destructive"});
            return;
        }
        setFile(selected); // 🔄 Speichere Datei fürs spätere Hochladen
        setPreview(URL.createObjectURL(selected)); // 🔄 Lokale Vorschau erstellen
    };

    const handlePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // TODO: Das Bild einfach von selbst verkleinenern eigentlich aber das kommt noch
        if (file.size > 2 * 1024 * 1024) {
            toast({title: "Datei zu groß", description: "Maximal 2MB", variant: "destructive"});
            return;
        }
        const formDataUpload = new FormData();
        formDataUpload.append("profile_pic", file);

        try {
            await apiFetch('user/profile-picture/set', 'POST', formDataUpload, {
                Authorization: `Bearer ${token}`
            });
            toast({title: "Profilbild aktualisiert"});
            // TODO: IDK was jetzt wichtig ist
            window.location.reload(); // oder: fetchUser();
        } catch (error) {
            console.error('Upload fehlgeschlagen', error);
            toast({title: "Fehler beim Upload", variant: "destructive"});
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        window.location.reload();
        navigate('/');
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
                'user/profile',
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
            if (file) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', file);
                await apiFetch(
                    'user/profile-picture/set',
                    'POST',
                    uploadData,
                    { Authorization: `Bearer ${token}` }
                );
            }
            if (formData.newPassword) {
                await apiFetch(
                    'user/change-password',
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
            toast({title: "Gespeichert", description: "Deine Änderungen wurden gespeichert"});
            const updated = await apiFetch('user/profile', 'GET', undefined, {Authorization: `Bearer ${token}`});
            setUser(updated);
            setFile(null);

        } catch (error) {
            console.error('Fehler beim Speichern', error);
            toast({title: "Fehler", description: "Speichern fehlgeschlagen", variant: "destructive"});
        } finally {
            setLoading(false);
        }

    };

    if (loading) {
        return <Layout><p>Lade Profil …</p></Layout>;
    }

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
                        <TabsList className="grid grid-cols-2 gap-2 mb-6">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User size={16}/>
                                <span className="hidden sm:inline">Profil</span>
                            </TabsTrigger>

                            <TabsTrigger value="privacy" className="flex items-center gap-2">
                                <Shield size={16}/>
                                <span className="hidden sm:inline">Datenschutz</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20 border">
                                    {preview ? (
                                        // 1) Zeige lokale Vorschau, wenn ein neues Bild ausgewählt wurde
                                        <AvatarImage src={preview} />
                                    ) : formData.profile_pic ? (
                                        // 2) Ansonsten das gespeicherte Profilbild
                                        <AvatarImage src={formData.profile_pic} />
                                    ) : (
                                        // 3) Wenn kein Bild vorhanden ist, zeige Initialen
                                        <AvatarFallback className="text-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                            {(formData.firstName?.[0] ?? "U").toUpperCase()}
                                            {(formData.lastName?.[0] ?? "").toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                <div className="space-y-1">
                                    <h3 className="font-medium">Profilbild</h3>
                                    <p className="text-sm text-muted-foreground">JPG, GIF oder PNG. Maximal 2MB.</p>
                                    <div className="flex gap-2 mt-2">
                                        {/* verstecktes native File-Input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePicChange}
                                            style={{ display: "none" }}
                                        />

                                        {/* Button öffnet per Ref den File-Dialog */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handlePicUploadClick}
                                        >
                                            Hochladen
                                        </Button>


                                        <Button size="sm" variant="ghost">Entfernen</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Vorname / Nachname */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Vorname</Label>
                                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nachname</Label>
                                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange}/>
                                </div>
                            </div>

                            {/* E-Mail / Telefonnummer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-Mail</Label>
                                    <Input id="email" name="email" type="email" autoComplete="off" value={formData.email} onChange={handleInputChange}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange}/>
                                </div>
                            </div>

                            {/* Passwort ändern */}
                            <div className="pt-4 border-t">
                                <h3 className="font-medium mb-4">Passwort ändern</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                                        <Input id="currentPassword"  type="password"  value={formData.currentPassword}
                                               onChange={handleInputChange}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Neues Passwort</Label>
                                        <Input id="newPassword" type="password" value={formData.newPassword}
                                               onChange={handleInputChange}/>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                                        <Input id="confirmPassword" type="password" value={formData.confirmPassword}
                                               onChange={handleInputChange}/>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>


                        <TabsContent value="privacy">
                            <div className="space-y-6">
                                <div className="pt-4 border-t flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium mb-2">Datenlöschung</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs">
                                            Das Löschen deines Kontos entfernt alle deine Daten und kann nicht rückgängig gemacht werden.
                                        </p>
                                    </div>
                                    <Button variant="destructive" onClick={handleDeleteAccount} size="sm">
                                        Account löschen
                                    </Button>
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