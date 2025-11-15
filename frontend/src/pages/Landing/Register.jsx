import { Link, useNavigate } from "react-router-dom";
import FormField from "../../components/Form/FormField";
import NavbarLanding from "../../components/Navbar/NavbarLanding";
import RegisterInfoModal from "../../components/Modal/Auth/RegisterInfoModal";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";

export default function Register() {
    const navigate = useNavigate();

    const { isAuthenticating, register } = useUsuarioStore();
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        dui: '',
        password: '',
        duiDelante: null,
        duiAtras: null,
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        const user = await register(formData);
        
        if (user) {
            navigate("/login");
        }
    };

    const handleChange = e => {
        const { name, type, value, files } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value,
        }))
    }

    return (
        <div className="page landing">
            <RegisterInfoModal/>

            <NavbarLanding activePage="register" />

            <div className="content">
                <div className="landing-hero color-primary" style={{ width: '100%' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)', justifyContent: 'center', alignItems: 'center', borderTop: 'var(--border-width-lg) solid #fff', borderRadius: 'var(--border-lg)', borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 'var(--space-2xl)'}}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h1 style={{ fontSize: 'var(--font-3xl)', margin: 0, padding: 0, color: 'white' }}>Crea una Cuenta</h1>
                            <small className="text-muted" style={{ maxWidth: '750px', margin: 0, padding: 0 }}> Asegúrate de ingresar datos reales y completos; Información incorrecta o incompleta causará atrasos y el rechazo de tus solicitudes.</small>
                        </div>

                        <form ref={formRef} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                            <div className="two-column-container" style={{gap: 'var(--space-md)'}}>
                                <FormField
                                    label="Nombres"
                                    classNames="simple one"
                                    placeholder="Ingresa tus nombres"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                />

                                <FormField
                                    label="Apellidos"
                                    classNames="simple one"
                                    placeholder="Ingresa tus apellidos"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                />

                                <FormField
                                    label="Email"
                                    classNames="simple one"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <FormField
                                    label="Número de teléfono"
                                    classNames="simple one"
                                    placeholder="1212 3434"
                                    type="phone"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    required
                                />

                                <FormField
                                    label="Número de DUI (Incluir guión)"
                                    classNames="simple one"
                                    placeholder="12345678-9"
                                    name="dui"
                                    value={formData.dui}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{8}-[0-9]{1}"
                                />

                                <FormField
                                    label="Contraseña"
                                    classNames="simple one"
                                    type="password"
                                    placeholder="********"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={4}
                                />

                                <FormField
                                    label="Foto de DUI (frente)"
                                    classNames="simple one"
                                    type="file"
                                    name="duiDelante"
                                    preview={formData.duiDelante}
                                    onChange={handleChange}
                                    accept="image/*"
                                    required
                                />

                                <FormField
                                    label="Foto de DUI (atrás)"
                                    classNames="simple one"
                                    type="file"
                                    name="duiAtras"
                                    preview={formData.duiAtras}
                                    onChange={handleChange}
                                    accept="image/*"
                                    required
                                />
                            </div>

                            <Button variant="default" size="lg" onClick={onSubmit} disabled={isAuthenticating}>
                                {isAuthenticating
                                    ? <span className="spinner small"/>
                                    : <span>REGISTRARSE</span>
                                }
                            </Button>

                            <small className="text-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>¿Ya tienes una cuenta? <Link className="color-warning" style={{ paddingInline: 'var(--space-xs)' }} to={'/login'}>INICIA SESIÓN AQUÍ</Link></small>
                        </form>
                    </div>

                    <img className="landing-hero-bg" src="/images/landing/hero-bg.png" />
                </div>
            </div>
        </div>
    )
}