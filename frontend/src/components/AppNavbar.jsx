import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useUsuarioStore } from "../stores/useUsuarioStore";

export default function AppNavbar() {
    const { logout } = useUsuarioStore();

    return (
        <div className="w-full border-none">
            <ButtonGroup className="flex w-full justify-between px-4">
                <ButtonGroup className="flex items-center">
                    <Button variant={"link"}>
                        <h1 className="text-xl font-extrabold font-inter text-white">MULTIPRÉSTAMOS ATLAS</h1>
                    </Button>
                </ButtonGroup>

                <div className="flex flex-row">
                    <Button onClick={() => logout()}>Cerrar sesión</Button>
                </div>
            </ButtonGroup>
        </div>
    );
}
