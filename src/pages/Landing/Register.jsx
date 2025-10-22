import { Link } from "react-router-dom";
import FormField from "../../components/Form/FormField";
import NavbarLanding from "../../components/Navbar/NavbarLanding";

export default function Register() {
    const onSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="page landing">
            <NavbarLanding activePage="register" />

            <div className="content">
                <div className="landing-hero color-primary" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--landing-secondary)', padding: 'var(--space-lg)', justifyContent: 'center', alignItems: 'center', borderTop: 'var(--border-width-lg) solid var(--color-warning)', borderRadius: 'var(--border-lg)', borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 'var(--space-2xl)'}}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h1 style={{ fontSize: 'var(--font-3xl)', margin: 0, padding: 0 }}>Crea una Cuenta</h1>
                            <small className="color-secondary" style={{ maxWidth: '750px', margin: 0, padding: 0 }}> Asegúrate de ingresar datos reales y completos; Información incorrecta o incompleta puede causar atrasos o rechazo de tu solicitud.</small>
                        </div>

                        <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                            <div className="two-column-container" style={{gap: 'var(--space-md'}}>
                                <FormField
                                    label={'Nombre Completo'}
                                    classNames={'simple two'}
                                    style={{ width: '100%'}}
                                    placeholder='Ingresa tu nombre completo'
                                />
                                <FormField
                                    label={'Email'}
                                    classNames={'simple one'}
                                    style={{ width: '100%'}}
                                    type="email"
                                    placeholder='usuario@email.com'
                                />

                                <FormField
                                    label={'Número de teléfono'}
                                    classNames={'simple one'}
                                    style={{ width: '100%'}}
                                    placeholder='1212 3434'
                                />
                                <FormField
                                    label={'Número de DUI (Incluir guión)'}
                                    classNames={'simple one'}
                                    style={{ width: '100%'}}
                                    placeholder='12345678-9'
                                />

                                <FormField
                                    label={'Contraseña'}
                                    classNames={'simple one'}
                                    style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
                                    type="password"
                                    placeholder='********'
                                />

                                <FormField
                                    label={'Foto de DUI (frente)'}
                                    classNames={'simple one'}
                                    style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
                                    type="file"
                                />

                                <FormField
                                    label={'Foto de DUI (atrás)'}
                                    classNames={'simple one'}
                                    style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
                                    type="file"
                                />
                            </div>

                            <button style={{ width: '100%', padding: 'var(--space-md)' }} className="btn-primary" onClick={onSubmit}>REGISTRARSE</button>

                            <small className="color-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>¿Ya tienes una cuenta? <Link className="color-warning" style={{ paddingInline: 'var(--space-xs)' }} to={'/login'}>INICIA SESIÓN AQUÍ</Link></small>
                        </form>
                    </div>

                    <img className="landing-hero-bg" src="/images/landing/hero-bg.png" />
                </div>
            </div>
        </div>
    )
}