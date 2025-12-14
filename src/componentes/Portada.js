import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';

import fotoPerfil from '../../public/img/fotoPerfil.jpg';
import logoColaboracion from '../../public/img/logoColaboracion.png';
import LogoUTN from '../../public/img/update/LogoUTN.png';
import teamjoyLogo from '../../public/img/teamjoy-logo.jpg';

const Portada = () => {
    const [teamJoyModalIsOpen, setTeamJoyModalIsOpen] = useState(false);

    const youtubeVideoId = '9u4c2CqIc-A'; 
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
    const youtubeFullUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

    return (
        
        <div
            className="d-flex justify-content-center row"
            style={{
                backgroundColor: 'var(--bg-dark-neomorph)',
                color: 'var(--text-light-gray)',
                position: 'relative', 
                overflow: 'hidden',
                minHeight: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0
            }}
        >
           
            <div
                className="video-background-container"
                style={{
                    position: 'absolute', 
                    top: '0px',    
                    left: '0',
                    width: '100vw',
                    height: '100vh', 
                    zIndex: 0, 
                    pointerEvents: 'none' 
                }}
            >
                <iframe
                    src={youtubeEmbedUrl}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="video-background-iframe"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100vw',
                        height: '100vh',
                        transform: 'translate(-50%, -50%)',
                        objectFit: 'cover'
                    }}
                ></iframe>
              
                <a
                    href={youtubeFullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-background-overlay" 
                    style={{ zIndex: 1, display: 'none' }}
                >
                    <span className="video-background-play-icon" style={{ display: 'none' }}>►</span>
                </a>
            </div>

            
            <div style={{ position: 'relative', zIndex: 10 }}> 

                <div className="d-flex superior justify-content-end animate__animated animate__fadeIn animate__delay-5s"
                    style={{
                        position: 'absolute', 
                        top: '20px',
                        right: '20px',
                        zIndex: 100 
                    }}>
                    <a href="https://mpago.la/242gBtS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neomorph-donate-button font-sm"
                        style={{ alignItems: 'center' }}
                    >
                        <img src={logoColaboracion.src} alt="colaborar" className="logoColab me-2" />
                        <span className="fw-bold" style={{ color: 'var(--bg-dark-neomorph)' }}>Ayudar</span>
                    </a>
                </div>


               <div className="d-flex justify-content-center" style={{ marginTop: '0em', marginLeft: '2.2em', zIndex: 90 }}>
                    <Image
                        src={fotoPerfil}
                        alt="Foto de Perfil de Gabriel"
                        className="foto-perfil neomorph-profile-picture efecto" 
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover', marginTop: '12.5em' }}
                    />
                    <Image
                        src={LogoUTN}
                        alt="Logo UTN"
                        className="burbuja-flotante neomorph-floating-bubble animate__animated animate__bounceInDown border border-3"
                        width={40}
                        height={40}
                        style={{ marginTop: '19.3em' }} // Aquí se añade el margen superior
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <div className="mt-2 mb-5 text-center">
                        <h3 className="text-center fst-normal animate__animated animate__bounceInLeft portada-text-highlight">
                            Gabriel (fungirak) Lazzarini
                        </h3>
                        <h5 className="text-center fst-normal animate__animated animate__bounceInRight animate__delay-1s portada-text-normal">
                            Desarrollador de Software Full Stack
                        </h5>
                        <h5 className="text-center fw-normal animate__animated animate__fadeIn animate__delay-2s portada-text-normal">
                            Tecnicatura en Tecnologías de la Información
                        </h5>
                        <h6 className="text-center fw-lighter animate__animated animate__fadeIn animate__delay-3s portada-text-normal">
                            UTN FRSF
                        </h6>
                    </div>
                </div>

                {/* 5 Cards debajo del video */}
                <div className="d-flex justify-content-center gap-3 mt-5" style={{ paddingTop: '2rem', zIndex: 20 }}>
                    {/* Card 1 - Team Joy */}
                    <div
                        className="neomorph-out-element"
                        onClick={() => setTeamJoyModalIsOpen(true)}
                        style={{
                            width: '150px',
                            height: '220px',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 0 20px rgba(0, 255, 157, 0.4), 10px 10px 20px rgba(0, 0, 0, 0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            transition: 'transform 0.2s ease'
                        }}
                    >
                        <Image 
                            src={teamjoyLogo} 
                            alt="Team Joy Logo" 
                            width={120} 
                            height={120}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    {/* Card 2 - Iconos de gestión inmobiliaria */}
                    <div
                        className="neomorph-out-element"
                        style={{
                            width: '150px',
                            height: '220px',
                            borderRadius: '10px',
                            backgroundColor: '#D3D3D3',
                            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15), -5px -5px 15px rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                    >
                        {/* Icono Casa - Arriba (azul) */}
                        <div style={{
                            position: 'absolute',
                            top: '55px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)'
                        }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="#4A90E2">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>

                        {/* Icono Servicio Técnico - Abajo Izquierda (amarillo) */}
                        <div style={{
                            position: 'absolute',
                            bottom: '55px',
                            left: '25px',
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)'
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5C542">
                                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                            </svg>
                        </div>

                        {/* Icono Inquilino - Abajo Derecha (verde) */}
                        <div style={{
                            position: 'absolute',
                            bottom: '55px',
                            right: '25px',
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)'
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="#50C878">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>

                        {/* Texto "Muy Pronto" */}
                        <div style={{
                            position: 'absolute',
                            bottom: '15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#666666',
                            textAlign: 'center'
                        }}>
                            Muy Pronto
                        </div>
                    </div>

                    {/* Card 3 - Libro */}
                    <div
                        className="neomorph-out-element"
                        style={{
                            width: '150px',
                            height: '220px',
                            borderRadius: '10px',
                            backgroundColor: '#D3D3D3',
                            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15), -5px -5px 15px rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>

                    {/* Card 4 - Libro */}
                    <div
                        className="neomorph-out-element"
                        style={{
                            width: '150px',
                            height: '220px',
                            borderRadius: '10px',
                            backgroundColor: '#D3D3D3',
                            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15), -5px -5px 15px rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>

                    {/* Card 5 - Nota Musical Doble */}
                    <div
                        className="neomorph-out-element"
                        style={{
                            width: '150px',
                            height: '220px',
                            borderRadius: '10px',
                            backgroundColor: '#D3D3D3',
                            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15), -5px -5px 15px rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </div>
                </div>

                {/* Modal de Team Joy */}
                <Modal 
                    isOpen={teamJoyModalIsOpen} 
                    onRequestClose={() => setTeamJoyModalIsOpen(false)}
                    className="modal-team-joy"
                    style={{
                        content: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            background: '#FFFFFF',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '3rem',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            boxShadow: '0 0 40px rgba(0, 255, 157, 0.6), 0 0 80px rgba(0, 255, 157, 0.3)'
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            zIndex: 3000
                        }
                    }}
                >
                    <button
                        onClick={() => setTeamJoyModalIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'none',
                            border: 'none',
                            fontSize: '2rem',
                            color: '#333',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        &times;
                    </button>
                    
                    <div style={{ color: '#333', textAlign: 'center', backgroundColor: '#FFFFFF', width: '100%' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000', paddingBottom: '0.8rem', borderBottom: '1px solid #E0E0E0' }}>
                            👋 ¡Hola! Soy FUNGIRAK
                        </h2>
                        
                        <p className="dev-description" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', marginTop: '1.5rem', color: '#555', paddingBottom: '0.8rem', borderBottom: '1px solid #E0E0E0' }}>
                            <span className="dev-main">💻 Desarrollador Full-Stack</span>
                            <span className="dev-subtitle">apasionado por la innovación.</span>
                        </p>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '1.5rem', color: '#000' }}>
                            🚀 Proyectos Destacados
                        </h3>

                        <h4 className="team-joy-title" style={{ fontSize: '1.3rem', marginBottom: '1rem', marginTop: '1.5rem', color: '#2C3E50', fontWeight: 'bold', paddingBottom: '0.8rem', borderBottom: '1px solid #E0E0E0' }}>
                            <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', marginBottom: '-15px' }}>
                                <Image 
                                    src={teamjoyLogo} 
                                    alt="Team Joy Logo" 
                                    width={260} 
                                    height={260}
                                    quality={100}
                                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                />
                            </div>
                            <span className="team-joy-subtitle" style={{ marginTop: '0' }}>La Experiencia Lúdica para la Oficina</span>
                        </h4>

                        <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem', color: '#444', textAlign: 'left' }}>
                            🌈 <strong>Team Joy</strong> es la <strong>PRIMERA RED SOCIAL PARA EMPLEADOS PÚBLICOS</strong> diseñada para revitalizar la vida laboral y combatir el burnout en la Administración Pública de Santa Fe y el sector privado.
                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem', color: '#444', textAlign: 'left' }}>
                            <strong>Misión:</strong> crear comunidad y transformar la rutina en una experiencia significativa.
                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem', color: '#444', textAlign: 'left' }}>
                            <strong>Impacto:</strong> Mejora la cultura organizacional, fomenta la conexión y motiva a los equipos.
                        </p>

                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000', textAlign: 'left' }}>
                            💡 Características Principales:
                        </h4>

                        <ul style={{ textAlign: 'left', lineHeight: '2', fontSize: '0.95rem', color: '#444', marginBottom: '2rem', listStyle: 'none', paddingLeft: 0 }}>
                            <li>✨ <strong>Oficinas & Comunidades:</strong> Crea o únete a tu oficina.</li>
                            <li>💰 <strong>Finanzas Sociales:</strong> Recauda fondos, organiza campañas de donación (¡Integrado con Mercado Pago!).</li>
                            <li>🤝 <strong>Compras Grupales:</strong> Propuestas con votación y transferencia de pagos instantánea.</li>
                            <li>🎉 <strong>Eventos:</strong> Organiza almuerzos, after offices y eventos al instante.</li>
                            <li>🗳️ <strong>Interacción:</strong> Realiza encuestas, preguntas y sorteos.</li>
                            <li>🏅 <strong>Gamificación:</strong> Gana coins e insignias, compra/vende stickers para tu perfil.</li>
                            <li>🔄 <strong>Conexión Diaria:</strong> Comparte Rutinas (historias) y Metas del Día (estados).</li>
                        </ul>

                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>
                            🔗 ¡Conócela en acción!
                        </h4>

                        <p style={{ fontSize: '1.1rem', marginBottom: '0', color: '#444' }}>
                            <strong>Sitio Web:</strong> <a href="https://teamjoy.site" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--contrast-electric-green)', textDecoration: 'none', fontWeight: 'bold' }}>https://teamjoy.site</a>
                        </p>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Portada;