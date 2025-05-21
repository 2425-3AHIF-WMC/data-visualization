import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Layout} from '../components/Layout';
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/components/ui/use-toast';
import {apiFetch} from "@/utils/api.ts";
//import {useRouter} from 'next/router';

export default function Login() {
    const { toast } = useToast();
//const router = useRouter();
    // State für die Eingabewerte
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    // Form-Submit-Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = await apiFetch('auth/login', 'POST', {email, password});

            localStorage.setItem('jwt',token as string);

            toast({
                title: "Login erfolgreich",
                description: "Sie wurden erfolgreich eingeloggt.",
            });

            // Vielleicht enthält res ein JWT - Token idk
            // natürlich überprüfen blabla

            // TODO zuletzt Weiterleitung zu Dashboard nach dem  einloggen
            // noch nicht fertig irgend ein problem mit next router gibt es
//await router.push('/');
            navigate('/');

        } catch (err: any) {
            toast({title: "Fehler", description: err.message});
        }


    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center py-10">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
                        <CardDescription>
                            Geben Sie Ihre Anmeldedaten ein, um auf Ihr Konto zuzugreifen
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email"
                                       type="email"
                                       placeholder="name@example.com"
                                       value = {email} // Wert des Eingabefeldes aus dem Zustand
                                        onChange={(e)=>setEmail(e.target.value)} //Aktualisiert den Zustand bei der Eingabe
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Passwort</Label>
                                    <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                                        Passwort vergessen?
                                    </a>
                                </div>
                                <Input id="password"
                                       type="password"
                                       value={password}
                                       onChange={(e)=>setPassword(e.target.value)}
                                       required/>
                            </div>
                            <Button type="submit" className="w-full">Anmelden</Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            Noch kein Konto?{" "}
                            <a href="/signIn" className="text-primary underline-offset-4 hover:underline">
                                Registrieren
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}
