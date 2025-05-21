import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {apiFetch} from "@/utils/api.ts";


export interface RegisterResponse {
    token: string;
    user: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        telNr?: string;
    };
}
//import { useRouter } from 'next/router';

export default function SignIn() {
    const {toast}= useToast();
    // const router = useRouter();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telNr, setTelNr]= useState('');
    //Todo Profilbild fehlt halt noch

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await apiFetch('auth/register', 'POST', {
                firstname,
                lastname,
                email,
                password,
                telNr
            }) as RegisterResponse;

            // Beispiel: Token speichern
            localStorage.setItem('jwt', res.token);

            toast({
                title: "Registrierung erfolgreich",
                description: "Sie können sich jetzt einloggen.",
            });

            // TODO: Weiterleitung nach erfolgreicher Registrierung zu profilbild-frage
            // await router.push('/'); dashboard

        } catch (err: any) {
            toast({ title: "Error", description: err.message });
        }
    };

    return(
        <Layout>
            <div className="flex flex-col items-center justify-center py-10">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
                        <CardDescription>
                            Erstellen Sie ein neues Konto, um Zugang zu erhalten
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Firstname</Label>
                                <Input
                                    id="firstname"
                                    type="text"
                                    placeholder="Jane"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Lastname</Label>
                                <Input
                                    id="lastname"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Passwort</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefon number">Telefon Number (optional)</Label>
                            <Input
                                id="telNr"
                                type="telNr"
                                value={telNr}
                                onChange={(e) => setTelNr(e.target.value)}
                            />
                            </div>
                            <Button type="submit" className="w-full">Registrieren</Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            Bereits ein Konto?{" "}
                            <a href="/login" className="text-primary underline-offset-4 hover:underline">
                                Anmelden
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}