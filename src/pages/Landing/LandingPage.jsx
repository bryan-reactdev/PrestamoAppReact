import { Link } from "react-router-dom";
import OneTwoCard from "../../components/Cards/OneTwoCard";
import NavbarLanding from "../../components/Navbar/NavbarLanding";

export default function LandingPage() {
  return (
    <div className="page landing">
        <NavbarLanding/>

        <div className="content">
            <div className="landing-hero">
                <div className="landing-left">
                    <div className="landing-title">
                        <h1>TU SOLUCIÓN RÁPIDA Y CONFIABLE</h1>
                    </div>
                    <div className="landing-description">
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Respuesta en minutos</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Requisitos mínimos</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Cuotas accesibles</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Atención personalizada</p>

                        <br />

                        <p>Te ofrecemos préstamos rápidos y accesibles desde $200 hasta $500, pensados para ayudarte en el momento justo.</p>
                        
                        <br />
                    </div>

                    <div className="button-container">
                        <button className="btn-warning outline lg">CONOCE MÁS</button>
                        <Link className="btn-warning lg" to={'/register'}>REGÍSTRATE YA</Link>
                    </div>
                </div>

                <div className="landing-right">
                    <img className='landing-section-image' src="/images/landing/hero-image.png" alt="Landing Hero" />
                </div>

                <img className="landing-hero-bg" src="/images/landing/hero-bg.png"/>
            </div>

            <div className="landing-content">
                <div className="landing-section">
                    <img className="landing-section-image" src="/images/landing/por-que.jpg" alt="Finanzia Confiable" />
                    
                    <div className="landing-section-content">
                        <h2>¿Por qué elegirnos?</h2>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Rápidez y eficiencia: Obtén tu préstamo en el menor tiempo posible, sin trámites innecesarios.</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Apoyo a microempresas: Porque creemos en tu esfuerzo y queremos impulsar tu crecimiento</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Intereses muy atractivos: Condiciones justas u competitivas para tu tranquilidad</p>
                        <p><i className="fas fa-circle-check" style={{color: 'var(--color-success-light)'}}/> Oferta especial en Bitcoin: Aprovecha beneficios exclusivos pagando en criptomonedas</p>
                    </div>
                </div>

                <div className="landing-section secondary">
                    <div className="landing-section-content">
                        <div className="centered vertical mb-lg">
                            <h2>Beneficios de Nuestros Préstamos.</h2>
                            <h4>Diseñados para brindarte la mejor experiencia financiera.</h4>
                        </div>

                        <div className="two-column-container">
                            <OneTwoCard icon={'fas fa-rocket'} color="accent" title={'Desembolsos Rápidos'}>
                                Recibe tu dinero en cuestión de horas, no días. Procesamos tu solicitud con la máxima prioridad
                            </OneTwoCard>

                            <OneTwoCard icon={'fas fa-chart-line'} color="success" title={'Mejora tu Historial Crediticio'}>
                                Pagos puntuales te ayudan a construir o mejorar tu historial crediticio para futuras operaciones
                            </OneTwoCard>

                            <OneTwoCard icon={'fas fa-shield'} color="accent-light" title={'Seguridad Garantizada'}>
                                Tus datos están protegidos. Tu privacidad es nuestra prioridad
                            </OneTwoCard>

                            <OneTwoCard icon={'fas fa-money-bill'} color="danger" title={'Apoyo financiero para pequeños negocios'}>
                                Te ofrecemos préstamos rápidos y accesibles desde $200 hasta $500, pensados para ayudarte en el momento justo
                            </OneTwoCard>

                            <OneTwoCard icon={'fas fa-sync'} color="warning" title={'Renovación Automática'}>
                                Una vez pagado tu préstamo, puedes renovarlo inmediatamente sin trámites adicionales
                            </OneTwoCard>

                            <OneTwoCard icon={'fas fa-hand-holding-heart'} color="accent" title={'El dinero a tu alcance cuando lo necesites'}>
                                Soluciónes inmediatas para urgencias médicas, imprevistoso proyectos personales
                            </OneTwoCard>
                        </div>
                    </div>
                </div>

                <div className="landing-section vertical">
                    <div className="landing-section-content">
                        <div className="centered vertical mb-lg">
                            <h2>Obten tu préstamo en 3 sencillos pasos</h2>
                            <h4>Regístrate ahora y accede a tu línea de crédito en minutos</h4>
                        </div>

                        <div className="landing-section-timeline">
                            <div className="timeline-container fade-in-up">
                                <div className="timeline-step">
                                    <div className="timeline-icon"><i className="fas fa-user-plus"></i></div>
                                    <h3>1. Regístrate</h3>
                                    <p>Crea tu cuenta en menos de 2 minutos con tu email y datos básicos.</p>
                                </div>

                                <div className="timeline-step">
                                    <div className="timeline-icon"><i className="fas fa-file-alt"></i></div>
                                    <h3>2. Completa tu solicitud</h3>
                                    <p>Proporciona la información necesaria para evaluar tu crédito.</p>
                                </div>

                                <div className="timeline-step">
                                    <div className="timeline-icon"><i className="fas fa-hand-holding-usd"></i></div>
                                    <h3>3. Recibe tu dinero</h3>
                                    <p>Aprobación inmediata y pagos en efectivo o transferencia</p>
                                </div>
                            </div>
                        </div>

                        <div className="button-container">
                            <button className="btn-warning outline lg">REGISTRARSE</button>
                            <Link className="btn-warning lg" to={'./admin/'}>INICIAR SESIÓN</Link>
                        </div>
                    </div>
                </div>

                <div className="landing-section">
                    <div className="centered">
                        <div className="landing-section-content">
                            <div className="info-card">
                                <div className="info-card-item">
                                    <i className="fas fa-phone color-warning"/>
                                    <p>(+503) 6978 9803</p>
                                </div>

                                <div className="info-card-item">
                                    <i className="fas fa-envelope color-warning"/>
                                    <p>multiprestamosatlas@gmail.com</p>
                                </div>

                                <div className="info-card-item">
                                    <i className="fas fa-map-marker color-warning"/>
                                    <p>Residencial Madrid Polígono 12 Casa 24, Ciudad Real, Santa Ana, El Salvador</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}