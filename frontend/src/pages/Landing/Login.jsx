import { Link, useNavigate } from "react-router-dom";
import FormField from "../../components/Form/FormField";
import NavbarLanding from "../../components/Navbar/NavbarLanding";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useState } from "react";
import { Button } from "../../components/ui/button";

export default function Login() {
    const { login, isAuthenticating, currentUsuario } = useUsuarioStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        const user = await login(formData);
        
        if (user) {
            const isAdmin = !user.rol?.includes("USER");
            navigate(isAdmin ? "/admin/" : "/usuario/");
        }
    };

    // -- Handler para el formData --
    const handleChange = (e) => {
    const { name, value } = e.target;

    // Dynamically add/update the field
    setFormData((prev) => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
    }));
    };

    return (
        <div className="page landing">
            <NavbarLanding activePage="login" />

            <div className="content">
                <div className="landing-hero color-primary" style={{ width: '100%' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)', justifyContent: 'center', alignItems: 'center', borderTop: 'var(--border-width-lg) solid #fff', borderRadius: 'var(--border-lg)', borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 'var(--space-2xl)'}}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h1 style={{ fontSize: 'var(--font-3xl)', margin: 0, padding: 0, color: 'white' }}>Bienvenido de Nuevo</h1>
                            <small style={{ margin: 0, padding: 0, color: 'rgba(255,255,255,0.8)' }}>Inicia sesión para acceder a tu cuenta</small>
                        </div>

                        <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                            <FormField
                                label={'Número de DUI (Incluir guión)'}
                                classNames={'simple'}
                                style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
                                placeholder='Ingresa tu DUI'
                                name='username'
                                value={formData.username}
                                onChange={handleChange}
                            />

                            <FormField
                                label={'Contraseña'}
                                classNames={'simple'}
                                style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
                                type="password"
                                placeholder='********'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <Button variant={"default"} size={"lg"} onClick={onSubmit} disabled={isAuthenticating}>
                                {isAuthenticating
                                    ? <span className="spinner small"/>
                                    : <span>INICIAR SESIÓN</span>
                                }
                            </Button>

                            <small style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, color: 'rgba(255,255,255,0.8)' }}>¿No tienes una cuenta? <Link className="color-warning" style={{ paddingInline: 'var(--space-xs)' }} to={'/register'}>REGÍSTRATE AQUÍ</Link></small>
                        </form>
                    </div>

                    <img className="landing-hero-bg" src="/images/landing/hero-bg.png" />
                </div>
            </div>
        </div>
    )
}