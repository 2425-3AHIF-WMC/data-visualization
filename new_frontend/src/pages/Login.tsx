
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login erfolgreich",
      description: "Sie wurden erfolgreich eingeloggt.",
    });
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
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Passwort</Label>
                  <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                    Passwort vergessen?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Anmelden</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Noch kein Konto?{" "}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                Registrieren
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
