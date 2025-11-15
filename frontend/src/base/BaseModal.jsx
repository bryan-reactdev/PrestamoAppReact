import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BaseModal({ isOpen, onOpenChange, title, description }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="glass-modal">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-white/80">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="text-white">
                    Content here...
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
