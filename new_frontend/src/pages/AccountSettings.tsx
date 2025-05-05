import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AccountSettings(){
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Account-Einstellungen</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Account-Einstellungen</DialogTitle>
                    <DialogDescription>
                        Verwalte dein Profil, Passwort und andere persönliche Informationen.
                    </DialogDescription>
                </DialogHeader>

                {/* Beispielinhalt */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                            <AvatarImage src="" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <Label htmlFor="avatar">Profilbild ändern</Label>
                            <Input type="file" id="avatar" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                    </div>

                    <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" defaultValue="john@example.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="current-password">Aktuelles Passwort</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div>
                            <Label htmlFor="new-password">Neues Passwort</Label>
                            <Input id="new-password" type="password" />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Abbrechen</Button>
                    </DialogClose>
                    <Button type="submit">Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}