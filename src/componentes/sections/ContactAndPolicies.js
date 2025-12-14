import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';

import logoGithub from '../../../public/img/logoGithub.svg';
import logoLinkedin from '../../../public/img/logoLinkedin.png';

// Imports para modales
import fungi1 from '../../../public/img/fungi1.jpg';
import fungi2 from '../../../public/img/fungi2.jpg';
import utnLogo from '../../../public/img/update/LogoUTN.png';
import unlLogo from '../../../public/img/logoUNL.png';
import logoGobiernoSantaFe from '../../../public/img/logoGobiernoSantaFe.png';
import logoYoProgramo from '../../../public/img/update/certif-yoprogramo.jpg';
import logoUxUi from '../../../public/img/update/certif-ux.png';
import logoMetodologias from '../../../public/img/update/certif-metodologias.png';
import logoSeguridad from '../../../public/img/update/certif-seguridad.jpg';

// Portfolio imports
import logoFlecha from '../../../public/img/logoFlecha.png';
import logoJs from '../../../public/img/logoJs.png';
import logoTs from '../../../public/img/logoTs.png';
import logoMongodb from '../../../public/img/logoMongodb.svg';
import logoExpress from '../../../public/img/logoExpress.svg';
import logoReact from '../../../public/img/logoReact.svg';
import logoNodejs from '../../../public/img/logoNodejs.svg';
import logoMysql from '../../../public/img/logoMysql.svg';
import logoCss from '../../../public/img/logoCss.png';
import logoSass from '../../../public/img/logoSass.svg';
import logoGit from '../../../public/img/logoGit.svg';
import logoJava from '../../../public/img/update/logoJava.png';
import logoPHP from '../../../public/img/update/logoPHP.svg';
import logoSpringJWT from '../../../public/img/logoSpringJWT.jpg';
import logoWebsite from '../../../public/img/logoWebsite.png';

import Logoskills from '../../componentes/helpers/Logoskills';

const ContactAndPolicies = ({ posicionar, policyModalIsOpen, policyModalHandler }) => {

    // Estados para los modales de secciones
    const [sectionModalIsOpen, setSectionModalIsOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    
    // Estados para certificaciones dentro del modal MyJourney
    const [certModalIsOpen, setCertModalIsOpen] = useState(false);
    const [currentCertImage, setCurrentCertImage] = useState(null);

    const openSectionModal = (sectionKey) => {
        setCurrentSection(sectionKey);
        setSectionModalIsOpen(true);
    };

    const closeSectionModal = () => {
        setSectionModalIsOpen(false);
        setCurrentSection(null);
    };

    const openCertModal = (imageSrc) => {
        setCurrentCertImage(imageSrc);
        setCertModalIsOpen(true);
    };

    const closeCertModal = () => {
        setCertModalIsOpen(false);
        setCurrentCertImage(null);
    };

    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    // Skills data para Portfolio
    const urlJavascript = "https://developer.mozilla.org/es/docs/Web/JavaScript"; 
    const urlTypescript = "https://www.typescriptlang.org"; 
    const urlMongodb = "https://www.mongodb.com/es"; 
    const urlExpress = "https://expressjs.com/es/"; 
    const urlReactjs = "https://es.reactjs.org/"; 
    const urlNodejs = "https://nodejs.org/es/"; 
    const urlMysql = "https://www.mysql.com/"; 
    const urlCss = "https://developer.mozilla.org/en-US/docs/Web/CSS"; 
    const urlSass = "https://sass-lang.com/"; 
    const urlGit = "https://git-scm.com/"; 
    const urlJava = "https://www.java.com/en/download/help/whatis_java.html"; 
    const urlPHP = "https://www.php.net/"; 

    const allSkills = [
        { name: 'Java', logo: logoJava.src, url: urlJava },
        { name: 'JavaScript', logo: logoJs.src, url: urlJavascript },
        { name: 'TypeScript', logo: logoTs.src, url: urlTypescript },
        { name: 'PHP', logo: logoPHP.src, url: urlPHP },
        { name: 'MongoDB', logo: logoMongodb.src, url: urlMongodb },
        { name: 'Express.js', logo: logoExpress.src, url: urlExpress },
        { name: 'React.js', logo: logoReact.src, url: urlReactjs },
        { name: 'Node.js', logo: logoNodejs.src, url: urlNodejs },
        { name: 'MySQL', logo: logoMysql.src, url: urlMysql },
        { name: 'CSS 3', logo: logoCss.src, url: urlCss },
        { name: 'Sass', logo: logoSass.src, url: urlSass },
        { name: 'GIT', logo: logoGit.src, url: urlGit },
    ];

    // Contenido COMPLETO e IDÉNTICO de las secciones para los modales
    const sectionsContent = {
        'acerca-de-mi': {
            title: 'Acerca de Mí',
            content: (
                <div className="d-flex justify-content-center mt-3 p-3" style={{ flexWrap: 'wrap', margin: '0 auto' }}>
                    <div className="row d-flex justify-content-center m-0 w-100">
                        <div className="card col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-light-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <div className="card-header d-flex justify-content-center bg-transparent border-0 pb-2" style={{ padding: '0.75rem' }}>
                                <Image
                                    src={fungi1}
                                    alt="Perfil de Gabriel"
                                    className="img-fluid fungi neomorph-card-image-border foto-perfil-z-index" 
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body" style={{ color: 'var(--text-medium-gray)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <p style={{ marginBottom: '0.75rem' }}>
                                    ¡Hola! Soy Gabriel, un santotomesino apasionado por la tecnología, la música, el arte y el espacio.
                                    Mi herramienta es el código, pero mi impulso es la claridad de avanzar con propósito.
                                </p>
                                <p style={{ marginBottom: '0' }}>
                                    Poseo 3 años de experiencia laboral en el desarrollo de software full-stack.
                                    Actualmente, me dedico a mejorar continuamente mis habilidades, investigando y poniendo a prueba diversas tecnologías de frontend, backend y bases de datos,
                                    Presto atención a las últimas tendencias sólidas del mercado que sirvan para mejorar, mantener, actualizar, proyectos existentes y cumplir con el éxito de los proyectos en los que participo.
                                </p>
                            </div>
                        </div>

                        <div className="card col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-light-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <div className="card-header d-flex justify-content-center bg-transparent border-0 pb-2" style={{ padding: '0.75rem' }}>
                                <Image
                                    src={fungi2}
                                    alt="Imagen de GitHub"
                                    className="img-fluid fungi neomorph-card-image-border"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between text-center" style={{ color: 'var(--text-medium-gray)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <p style={{ marginBottom: '0.75rem' }}>
                                    Explora mi trabajo en GitHub, donde hago público algunos de los código fuente de mis proyectos personales.
                                </p>
                                <a href="https://github.com/fungirak" target="_blank" rel="noopener noreferrer" className="neomorph-link-button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                                    Ver Perfil de Github
                                </a>
                                <p className="mt-3" style={{ marginBottom: '0.75rem' }}>
                                    Si te gusta mi perfil y te interesa contactarme, envíame un mensaje para estar en contacto en mi <br /><br />
                                    <a href="https://ar.linkedin.com/in/gabriel-lazzarini" target="_blank" rel="noopener noreferrer" className="neomorph-link-button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                                        Cuenta de LinkedIn
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'trayectoria': {
            title: 'Trayectoria y Visión',
            content: (
                <div className="d-flex justify-content-center mt-4 p-4" style={{ flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'center', maxWidth: '700px', marginBottom: '1.5rem', color: 'var(--text-medium-gray)' }}>
                        No me defino por un stack, ni por un título. Me defino por las ganas de resolver con las que abordo los problemas.
                        Trabajo en la frontera donde las ideas toman forma y se vuelven funcionales.
                    </p>

                    <div className="row d-flex justify-content-center m-0 w-100">
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Lógico</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                Pienso en sistemas. Cada línea de código responde a un propósito. Me muevo con lógica, diseño con intención y entrego valor. No busco reinventar: busco que lo complejo funcione con simplicidad. Hablo de soluciones que viven, evolucionan y escalan.
                            </p>
                        </div>
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Técnico</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                El desarrollo es estrategia. Sé cuándo optimizar, abstraer y entregar valor. Construir pensando a futuro. Diseñar para escalar, documentar para el equipo lo mínimo necesario, y entregar funcionalidad valiosa que hable por si sola.
                            </p>
                        </div>
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Pragmático</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                No idealizo herramientas; las uso. Mi enfoque es directo: resolver. Cada proyecto es un sistema. Evito complejidad innecesaria. Prefiero soluciones limpias y estables. Entregar a tiempo es parte del producto.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        'experiencia': {
            title: 'Experiencia Laboral',
            content: (
                <div className="w-100 mt-4 p-3">
                    <div className="neomorph-out-element p-3" style={{ marginBottom: '1rem', backgroundColor: 'var(--neomorph-base-dark)' }}>
                        <div className="d-flex align-items-center mb-1">
                            <div className="list-item-neomorph-icon circular-icon-container">
                                <Image
                                    src={logoGobiernoSantaFe}
                                    alt="Logo Gobierno de Santa Fe"
                                    width={96}
                                    height={96}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </div>
                            
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ margin: '0', fontSize: '1.1rem' }}>Software Developer</h4>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>SECRETARÍA DE TECNOLOGÍAS PARA LA GESTIÓN</p>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Ministerio de Gobierno e Innovación Pública</p>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Gobierno de la Provincia de Santa Fe · Jornada completa</p>
                                <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>Desde Marzo de 2022 - Actualidad · 3 años</p>
                            </div>
                        </div>

                        <ul style={{ color: 'var(--text-medium-gray)', listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.8rem', fontSize: '0.9rem' }}>
                            <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>En colaboración con:</p>
                            <br />
                            <li><span className="text-electric-green">✏️ MINISTERIO DE EDUCACIÓN: </span>Desarrollo de Interfaz visual con <span className="text-electric-green">React.js</span> en <span className="text-electric-green"> SISTEMA SIPAU </span> y Backend con <span className="text-electric-green">Spring Boot y Oracle database</span>.</li>
                            <br />
                            <li><span className="text-electric-green">📂 MINISTERIO DE GOBIERNO: </span> Desarrollo Backend Java, <span className="text-electric-green">JWT</span>, Microservicio de patentes con <span className="text-electric-green">Spring Boot y Oracle database</span>.</li>
                            <br />
                            <li><span className="text-electric-green">🍃 MINISTERIO DE MEDIO AMBIENTE: </span> Desarrollo con <span className="text-electric-green">Symfony, PHP, Doctrine y Twig</span>. en <span className="text-electric-green">PUERTOS FISCALIZADORES</span> </li>
                        </ul>
                    </div>
                </div>
            )
        },
        'aptitudes': {
            title: 'Aptitudes Clave',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {['BACKEND', 'FRONTEND', 'React.js', 'MySQL', 'Oracle SQL Developer', 'Hibernate', 'API', 'Java', 'Mapeo objeto-relacional', 'Spring Framework', 'Spring Security', 'PHP', 'Git'].map(skill => (
                            <span key={skill} className="skill-tag" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>{skill}</span>
                        ))}
                    </div>
                </div>
            )
        },
        'educacion': {
            title: 'Educación',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element">
                    <div className="neomorph-out-element neomorph-glow-highlight p-3" style={{ backgroundColor: 'var(--neomorph-base-dark)', marginBottom: '0.8rem' }}>
                        <div className="d-flex align-items-center mb-1">
                            <div className="list-item-neomorph-icon-education" style={{
                                width: '4em',
                                height: '4em',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '1rem',
                                boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                background: 'var(--neomorph-base-dark)'
                            }}>
                                <Image src={utnLogo} alt="Educación UTN" width={64} height={64} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ margin: '0', fontSize: '1rem' }}>UNIVERSIDAD TECNOLÓGICA NACIONAL (UTN FRSF)</h4>
                                <h3 style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Tecnicatura en Tecnologías de la Información</h3>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>(Análisis, Diseño y Desarrollo de Sistemas de Software).</p>
                                <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>2023 - 2025</p>
                                <p style={{ color: 'var(--text-electric-green)', fontWeight: 'bold', fontSize: '0.9rem', margin: '0' }}>EGRESADO</p>
                            </div>
                        </div>
                    </div>

                    <div className="neomorph-out-element p-3" style={{ backgroundColor: 'var(--neomorph-base-dark)', marginTop: '0.8rem' }}>
                        <div className="d-flex align-items-center mb-1">
                            <div className="list-item-neomorph-icon-education" style={{
                                width: '4em',
                                height: '4em',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '1rem',
                                boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                background: 'var(--neomorph-base-dark)'
                            }}>
                                <Image src={unlLogo} alt="Educación UNL" width={64} height={64} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ margin: '0', fontSize: '1rem' }}>Universidad Nacional del Litoral</h4>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Ingeniería en Informática</p>
                                <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>2021 - 2023</p>
                            </div>
                        </div>
                    </div>

                    <div className="neomorph-out-element p-3" style={{ backgroundColor: 'var(--neomorph-base-dark)', marginTop: '0.8rem' }}>
                        <div className="d-flex align-items-center mb-1">
                            <div className="list-item-neomorph-icon-education" style={{
                                width: '4em',
                                height: '4em',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '1rem',
                                boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                background: 'var(--neomorph-base-dark)'
                            }}>
                                <Image src={utnLogo} alt="Educación UTN" width={64} height={64} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ margin: '0', fontSize: '1rem' }}>Universidad Tecnológica Nacional</h4>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Ingeniería en Sistemas de Información</p>
                                <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>2018 - 2020</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'licencias': {
            title: 'Licencias y Certificaciones',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element p-3">
                    <div className="d-flex flex-wrap justify-content-center">
                        <div className="col-12 col-sm-6 col-md-6 d-flex p-2">
                            <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                                style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', marginBottom: '0.8rem', cursor: 'pointer' }}
                                onClick={() => openCertModal(logoYoProgramo.src)}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '10em',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                    background: 'var(--neomorph-base-dark)'
                                }}>
                                    <Image
                                        src={logoYoProgramo}
                                        alt="Certificación Yo Programo - Argentina Programa"
                                        width={200}
                                        height={160}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 className="text-electric-green" style={{ margin: '0', fontSize: '0.95rem' }}>Certificación Yo Programo  Argentina Programa</h4>
                                    <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.85rem' }}>Cámara Argentina del Software</p>
                                    <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.8rem' }}>Expedición: 2022</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 d-flex p-2">
                            <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                                style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', marginBottom: '0.8rem', cursor: 'pointer' }}
                                onClick={() => openCertModal(logoUxUi.src)}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '10em',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                    background: 'var(--neomorph-base-dark)'
                                }}>
                                    <Image
                                        src={logoUxUi}
                                        alt="Certificación en Diseño de Experiencia de Usuario UX-UI"
                                        width={200}
                                        height={160}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 className="text-electric-green" style={{ margin: '0', fontSize: '0.95rem' }}>Diseño de Experiencia de Usuario UX-UI</h4>
                                    <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.85rem' }}>LinkedinLearning</p>
                                    <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.8rem' }}>Expedición: 2021</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 d-flex p-2">
                            <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                                style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', marginBottom: '0.8rem', cursor: 'pointer' }}
                                onClick={() => openCertModal(logoMetodologias.src)}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '10em',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                    background: 'var(--neomorph-base-dark)'
                                }}>
                                    <Image
                                        src={logoMetodologias}
                                        alt="Certificación de Metodologías Ágiles"
                                        width={200}
                                        height={160}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 className="text-electric-green" style={{ margin: '0', fontSize: '0.95rem' }}>Certificación de Metodologías Ágiles</h4>
                                    <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.85rem' }}>LinkedinLearning</p>
                                    <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.8rem' }}>Expedición: 2021</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-6 d-flex p-2">
                            <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                                style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', marginBottom: '0.8rem', cursor: 'pointer' }}
                                onClick={() => openCertModal(logoSeguridad.src)}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '10em',
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                    background: 'var(--neomorph-base-dark)'
                                }}>
                                    <Image
                                        src={logoSeguridad}
                                        alt="Certificación en Seguridad Informática"
                                        width={200}
                                        height={160}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 className="text-electric-green" style={{ margin: '0', fontSize: '0.95rem' }}>Seguridad Informática</h4>
                                    <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.85rem' }}>CISCO</p>
                                    <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.8rem' }}>Expedición: 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'reconocimientos': {
            title: 'Reconocimientos y Premios',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element">
                    <div className="p-3" style={{ backgroundColor: 'var(--neomorph-base-dark)' }}>
                        <div className="d-flex align-items-center mb-1">
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ marginBottom: '0.5rem', margin: '0', fontSize: '1rem' }}>DIPLOMA DE HONOR</h4>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Colegio Profesional de Maestros Mayores de Obras y Técnicos de la Arquitectura, Industria e Ingeniería de Santa Fe · dic. 2017</p>
                                <p style={{ color: 'var(--text-muted-gray)', fontSize: '0.85rem' }}>Mejor promedio informático en el colegio secundario.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'idiomas': {
            title: 'Idiomas',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element">
                    <div className="p-3">
                        <div className="d-flex align-items-center mb-1">
                            <div style={{ flexGrow: 1 }}>
                                <h4 className="text-electric-green" style={{ marginBottom: '0.5rem', margin: '0', fontSize: '1rem' }}>Inglés</h4>
                                <p style={{ color: 'var(--text-medium-gray)', margin: '0', fontSize: '0.9rem' }}>Competencia básica</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'intereses': {
            title: 'Intereses',
            content: (
                <div className="w-100 mt-4 p-3 neomorph-out-element">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {['Educación', 'Política', 'Tecnología', 'Arte y Cultura'].map(interest => (
                            <span key={interest} className="skill-tag" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>{interest}</span>
                        ))}
                    </div>
                </div>
            )
        },
        'acerca-de-mi': {
            title: 'Acerca de Mí',
            content: (
                <div className="d-flex justify-content-center mt-3 p-3" style={{ flexWrap: 'wrap', margin: '0 auto' }}>
                    <div className="row d-flex justify-content-center m-0 w-100">
                        <div className="card col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-light-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <div className="card-header d-flex justify-content-center bg-transparent border-0 pb-2" style={{ padding: '0.75rem' }}>
                                <Image
                                    src={fungi1}
                                    alt="Perfil de Gabriel"
                                    className="img-fluid fungi neomorph-card-image-border foto-perfil-z-index" 
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body" style={{ color: 'var(--text-medium-gray)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <p style={{ marginBottom: '0.75rem' }}>
                                    ¡Hola! Soy Gabriel, un santotomesino apasionado por la tecnología, la música, el arte y el espacio.
                                    Mi herramienta es el código, pero mi impulso es la claridad de avanzar con propósito.
                                </p>
                                <p style={{ marginBottom: '0' }}>
                                    Poseo 3 años de experiencia laboral en el desarrollo de software full-stack.
                                    Actualmente, me dedico a mejorar continuamente mis habilidades, investigando y poniendo a prueba diversas tecnologías de frontend, backend y bases de datos,
                                    Presto atención a las últimas tendencias sólidas del mercado que sirvan para mejorar, mantener, actualizar, proyectos existentes y cumplir con el éxito de los proyectos en los que participo.
                                </p>
                            </div>
                        </div>

                        <div className="card col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-light-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <div className="card-header d-flex justify-content-center bg-transparent border-0 pb-2" style={{ padding: '0.75rem' }}>
                                <Image
                                    src={fungi2}
                                    alt="Imagen de GitHub"
                                    className="img-fluid fungi neomorph-card-image-border"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between text-center" style={{ color: 'var(--text-medium-gray)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <p style={{ marginBottom: '0.75rem' }}>
                                    Explora mi trabajo en GitHub, donde hago público algunos de los código fuente de mis proyectos personales.
                                </p>
                                <a href="https://github.com/fungirak" target="_blank" rel="noopener noreferrer" className="neomorph-link-button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                                    Ver Perfil de Github
                                </a>
                                <p className="mt-3" style={{ marginBottom: '0.75rem' }}>
                                    Si te gusta mi perfil y te interesa contactarme, envíame un mensaje para estar en contacto en mi <br /><br />
                                    <a href="https://ar.linkedin.com/in/gabriel-lazzarini" target="_blank" rel="noopener noreferrer" className="neomorph-link-button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                                        Cuenta de LinkedIn
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        'trayectoria': {
            title: 'Trayectoria y Visión',
            content: (
                <div className="d-flex justify-content-center mt-4 p-4" style={{ flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'center', maxWidth: '700px', marginBottom: '1.5rem', color: 'var(--text-medium-gray)' }}>
                        No me defino por un stack, ni por un título. Me defino por las ganas de resolver con las que abordo los problemas.
                        Trabajo en la frontera donde las ideas toman forma y se vuelven funcionales.
                    </p>

                    <div className="row d-flex justify-content-center m-0 w-100">
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Lógico</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                Pienso en sistemas. Cada línea de código responde a un propósito. Me muevo con lógica, diseño con intención y entrego valor. No busco reinventar: busco que lo complejo funcione con simplicidad. Hablo de soluciones que viven, evolucionan y escalan.
                            </p>
                        </div>
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Técnico</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                El desarrollo es estrategia. Sé cuándo optimizar, abstraer y entregar valor. Construir pensando a futuro. Diseñar para escalar, documentar para el equipo lo mínimo necesario, y entregar funcionalidad valiosa que hable por si sola.
                            </p>
                        </div>
                        <div className="col-md-5 m-2 p-3 rounded neomorph-out-element neomorph-card-hover-in" style={{ color: 'var(--text-medium-gray)', backgroundColor: 'var(--neomorph-base-dark)' }}>
                            <h3 className="fw-bold text-electric-green" style={{ fontSize: '1.1rem' }}>Soy Pragmático</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                No idealizo herramientas; las uso. Mi enfoque es directo: resolver. Cada proyecto es un sistema. Evito complejidad innecesaria. Prefiero soluciones limpias y estables. Entregar a tiempo es parte del producto.
                            </p>
                        </div>
                    </div>

                    <br />

                    <div className="w-100 mt-4 p-3">
                        <h3 className="fw-bold text-electric-green">Más sobre mí y mi visión</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '1rem', color: 'var(--text-medium-gray)', fontSize: '0.9rem', lineHeight: '1.4' }} className="neomorph-out-element p-3">
                                <span className="text-electric-green">• 🎒 Stack y Propósito:</span> Mi kit de herramientas incluye Spring Boot, Java, MySQL, React, Next, Node, JavaScript y Typescript. Actualmente diseño en privado soluciones innovadoras que abordan problemas sociales reales y generen un impacto significativamente positivo al validarse con los beneficiarios últimos que son la piedra angular de mi trabajo. No solo escribo código, construyo puentes hacia un futuro mejor.
                            </li>
                            <br />
                            <li style={{ marginBottom: '1rem', color: 'var(--text-medium-gray)', fontSize: '0.9rem', lineHeight: '1.4' }} className="neomorph-out-element p-3">
                                <span className="text-electric-green">• 🧘🏻 Estrategia y Acción:</span> A mis 26 años, he aprendido que cada desafío es una oportunidad. Mi enfoque es estratégico y mi acción decidida frente a las dificultades ha fortalecido mi autonomía y determinación.
                            </li>
                            <br />
                            <li style={{ marginBottom: '1rem', color: 'var(--text-medium-gray)', fontSize: '0.9rem', lineHeight: '1.4' }} className="neomorph-out-element p-3">
                                <span className="text-electric-green">• 🌟 Liderazgo y Valores:</span> El verdadero liderazgo nace de la necesidad instrínseca que tenemos los emprendedores de resolver un problema en el mundo, del control emocional y de la gestión óptima de recursos, incluyendo mis valores personales.
                            </li>
                            <br />
                            <li style={{ marginBottom: '1rem', color: 'var(--text-medium-gray)', fontSize: '0.9rem', lineHeight: '1.4' }} className="neomorph-out-element p-3">
                                <span className="text-electric-green">• 🔥 Ambición e Innovación:</span> Compromiso inquebrantable con la innovación real. Busco aportar valor al pueblo, impulsando nuevas ideas y soluciones que trasciendan lo convencional y defectuoso.
                            </li>
                            <br />
                            <li style={{ marginBottom: '0.5rem', color: 'var(--text-medium-gray)', fontSize: '0.9rem', lineHeight: '1.4' }} className="neomorph-out-element p-3">
                                <span className="text-electric-green">• 🍀 Proyección e Influencia:</span> Mi plan a futuro es proyectar una influencia creciente y positiva a través de la confianza tecnológica. Aplicada socialmente para resolver problemas reales. Busco inspirar, educar y contribuir a una comunidad que evolucione constantemente y se mantenga fiel al compromiso de que la tecnología está creada para resolver problemas. No para crearlos.
                            </li>
                        </ul>
                    </div>
                </div>
            )
        },
        'skills': {
            title: 'Skills',
            content: (
                <div className="neomorph-out-element p-3" style={{ margin: '0 auto' }}> 
                    <h6 className="text-center fw-light text-electric-green mb-3" style={{fontSize: '0.95rem'}}>Caja de herramientas:</h6>
                    <div className="skills-marquee-container">
                        <div className="skills-marquee-row">
                            {allSkills.map((skill, index) => (
                                <Logoskills key={`s1-${index}`} url={skill.url} logo={skill.logo} nombre={skill.name}/>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        'proyectos': {
            title: 'Proyectos Públicos',
            content: (
                <div className="d-flex flex-row align-items-center gap-3 mt-4" style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <div className="p-2" style={{ width: '340px' }}>
                        <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                            style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', minHeight: '480px' }}>
                            <div style={{
                                width: '100%', height: '12em', overflow: 'hidden', borderRadius: '8px', marginBottom: '0.8rem',
                                boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                background: 'var(--neomorph-base-dark)'
                            }}>
                                <Image src={logoWebsite.src} alt="Fungirak Website" width={200} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h5 className="text-center p-1 rounded-pill fw-normal mb-1 text-electric-green" style={{ backgroundColor: 'var(--neomorph-base-dark)', fontSize: '0.95rem' }}>FUNGIRAK WEBSITE CON NEXT ACTUALIZADO 2025 (This)</h5>
                            <h6 className="text-center fw-normal mb-2 text-medium-gray" style={{ fontSize: '0.8rem' }}>• NEXT.JS & NEOMORPHISM •</h6>
                            <div className="text-center mt-3 d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                                <span className="neomorph-live-button" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Image src={logoFlecha.src} alt="En Vivo" width={16} height={16} style={{ filter: 'brightness(0) invert(0)' }} />
                                    <span className="fw-bold">EN VIVO</span>
                                </span>
                                <a href="https://github.com/fungirak/fungirak.com" target="_blank" rel="noopener noreferrer" className="neomorph-project-button" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                    <Image src={logoGithub} alt="Código" width={16} height={16} />
                                    <span className="fw-bold">CÓDIGO</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="p-2" style={{ width: '340px' }}>
                        <div className="neomorph-out-element p-3 rounded d-flex flex-column align-items-center text-center"
                            style={{ backgroundColor: 'var(--neomorph-base-dark)', width: '100%', minHeight: '480px' }}>
                            <div style={{
                                width: '100%', height: '12em', overflow: 'hidden', borderRadius: '8px', marginBottom: '0.8rem',
                                boxShadow: 'inset 5px 5px 10px var(--neomorph-dark-shadow), inset -5px -5px 10px var(--neomorph-light-shadow)',
                                background: 'var(--neomorph-base-dark)'
                            }}>
                                <Image src={logoSpringJWT} alt="Logo Argentina Programa" width={200} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h5 className="text-center p-1 rounded-pill fw-normal mb-1 text-electric-green" style={{ backgroundColor: 'var(--neomorph-base-dark)', fontSize: '0.95rem' }}>BACKEND JAVA MULTIUSUARIO CON AUTENTICACIÓN Y ROLES</h5>
                            <h6 className="text-center fw-normal mb-2 text-medium-gray" style={{ fontSize: '0.8rem' }}>• JAVA • MySQL</h6>
                            <div className="text-center mt-3 d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                                <a href="https://deploy-next-front-historias.vercel.app/#/login" target="_blank" rel="noopener noreferrer" className="neomorph-project-button" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Image src={logoFlecha.src} alt="Abrir" width={16} height={16} />
                                    <span className="fw-bold">ABRIR</span>
                                </a>
                                <a href="https://github.com/fungirak/backend-historias-java-spring" target="_blank" rel="noopener noreferrer" className="neomorph-project-button" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                    <Image src={logoGithub} alt="Código" width={16} height={16} />
                                    <span className="fw-bold">CÓDIGO</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <>
            {/* --- SECCIÓN 7: POLÍTICA DE PRIVACIDAD (CONTENIDO EN MODAL) --- */}
            <Modal isOpen={policyModalIsOpen} onRequestClose={() => policyModalHandler(false)}
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--neomorph-base-dark)',
                        border: 'none',
                        borderRadius: '15px',
                        width: '90%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '1.5rem',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        boxShadow: '10px 10px 20px var(--neomorph-dark-shadow), -10px -10px 20px var(--neomorph-light-shadow)'
                    },
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1000 }
                }}
            >
                <div className="neomorph-out-element p-4" style={{ backgroundColor: 'var(--neomorph-base-dark)', color: 'var(--text-medium-gray)' }}>
                    <button
                        onClick={() => policyModalHandler(false)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.3rem', color: 'var(--text-light-gray)', cursor: 'pointer' }}
                        className="neomorph-icon-circle-button"
                    >
                        &times;
                    </button>
                    <h4 className="text-center mt-2 fw-normal rounded-pill neomorph-out-element text-electric-green section-title-glow" style={{ padding: '0.5rem 1rem', fontSize: '1.5rem', marginBottom: '1.5rem', maxWidth: '350px', margin: '0.5rem auto 1.5rem auto' }}>POLÍTICA DE PRIVACIDAD</h4>
                    <div className="row mt-2 p-1">
                        <p style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                            <h2 className="text-center text-electric-green section-title-glow" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>POLÍTICA DE PRIVACIDAD DEL SITIO WEB</h2>
                            <h3 className="text-center" style={{ color: 'var(--text-light-gray)', fontSize: '1.1rem' }}>www.fungirak.com</h3>
                            <h4 className="mt-3 text-electric-green fw-bold" style={{ fontSize: '1rem' }}>I. POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS</h4>
                            <p style={{ userSelect: "none", color: 'var(--text-medium-gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>Respetando lo establecido en la legislación vigente, FUNGIRAK WEBSITE (en adelante, también Sitio Web) se compromete a adoptar las medidas técnicas y organizativas necesarias, según el nivel de seguridad adecuado al riesgo de los datos recogidos.

                                <br /><br />Leyes que incorpora esta política de privacidad:
                                Esta política de privacidad está adaptada a la normativa Argentina vigente en materia de protección de datos personales en internet. En concreto, la misma respeta la siguiente:

                                <br /><br />**Ley 25.326**, relativo a la protección de los datos personales.
                                <br /><br />Identidad del responsable del tratamiento de los datos personales
                                <br />Dirección: Santo Tomé, Santa Fe, (Argentina)

                                <br />Email de contacto: <a href="mailto:fungirak@gmail.com" className="text-electric-green">fungirak@gmail.com</a> <br /><br />

                                Registro de Datos de Carácter Personal
                                En cumplimiento de lo establecido en las normativas vigentes, le informamos que los datos personales recabados por FUNGIRAK WEBSITE, mediante los formularios extendidos en sus páginas quedarán incorporados y serán tratados en nuestro fichero con el fin de poder facilitar, agilizar y cumplir los compromisos establecidos entre FUNGIRAK WEBSITE y el Usuario o el mantenimiento de la relación que se establezca en los formularios que este rellene, o para atender una solicitud o consulta del mismo.

                                <br /><br />Principios aplicables al tratamiento de los datos personales
                                El tratamiento de los datos personales del Usuario se someterá a los siguientes principios recogidos en la normativa vigente:

                                <br /><br />**Principio de licitud, lealtad y transparencia:** se requerirá en todo momento el consentimiento del Usuario previa información completamente transparente de los fines para los cuales se recogen los datos personales.
                                <br />**Principio de limitación de la finalidad:** los datos personales serán recogidos con fines determinados, explícitos y legítimos.
                                <br />**Principio de minimización de datos:** los datos personales recogidos serán únicamente los estrictamente necesarios en relación con los fines para los que son tratados.
                                <br />**Principio de exactitud:** los datos personales deben ser exactos y estar siempre actualizados.
                                <br />**Principio de limitación del plazo de conservación:** los datos personales solo serán mantenidos de forma que se permita la identificación del Usuario durante el tiempo necesario para los fines de su tratamiento.
                                <br />**Principio de integridad y confidencialidad:** los datos personales serán tratados de manera que se garantice su seguridad y confidencialidad.
                                <br />**Principio de responsabilidad proactiva:** el Responsable del tratamiento será responsable de asegurar que los principios anteriores se cumplen.
                                <br /><br />Categorías de datos personales
                                Las categorías de datos que se tratan en FUNGIRAK WEBSITE son únicamente datos identificativos.

                                <br /><br />Base legal para el tratamiento de los datos personales:
                                La base legal para el tratamiento de los datos personales es el consentimiento. FUNGIRAK WEBSITE se compromete a recabar el consentimiento expreso y verificable del Usuario para el tratamiento de sus datos personales para uno o varios fines específicos.

                                <br /><br />El Usuario tendrá derecho a retirar su consentimiento en cualquier momento.

                                <br /><br />En las ocasiones en las que el Usuario deba o pueda facilitar sus datos a través de formularios para realizar consultas, solicitar información o por motivos relacionados con el contenido del Sitio Web, se le informará en caso de que la cumplimentación de alguno de ellos sea obligatoria debido a que los mismos sean imprescindibles para el correcto desarrollo de la operación realizada.

                                <br /><br />Fines del tratamiento a que se destinan los datos personales:
                                Los datos personales son recabados y gestionados por FUNGIRAK WEBSITE con la finalidad de poder facilitar, agilizar y cumplir los compromisos establecidos entre el Sitio Web y el Usuario o el mantenimiento de la relación que se establezca en los formularios que este último rellene o para atender una solicitud o consulta.

                                <br /><br />Igualmente, los datos podrán ser utilizados con una finalidad comercial de personalización, operativa y estadística, y actividades propias del objeto social de FUNGIRAK WEBSITE, así como para la extracción, almacenamiento de datos y estudios de marketing para adecuar el Contenido ofertado al Usuario, así como mejorar la calidad, funcionamiento y navegación por el Sitio Web.


                                <br /><br />Períodos de retención de los datos personales:
                                Los datos personales solo serán retenidos durante el tiempo mínimo necesario para los fines de su tratamiento y, en todo caso, únicamente durante el siguiente plazo: **10 años**, o hasta que el Usuario solicite su supresión.

                                <br /><br />Destinatarios de los datos personales:
                                Los datos personales del Usuario no serán compartidos con terceros.

                                <br /><br />Secreto y seguridad de los datos personales:
                                FUNGIRAK WEBSITE se compromete a adoptar las medidas técnicas y organizativas necesarias, según el nivel de seguridad adecuado al riesgo de los datos recogidos, de forma que se garantice la seguridad de los datos de carácter personal y se evite la destrucción, pérdida o alteración accidental o ilícita de datos personales transmitidos, conservados o tratados de otra forma, o la comunicación o acceso no autorizados a dichos datos.

                                <br /><br />El Sitio Web cuenta con un **certificado SSL (Secure Socket Layer)**, que asegura que los datos personales se transmiten de forma segura y confidencial, al ser la transmisión de los datos entre el servidor y el Usuario, y en retroalimentación, totalmente cifrada o encriptada.

                                <br /><br />Sin embargo, debido a que FUNGIRAK WEBSITE no puede garantizar la inexpugnabilidad de internet ni la ausencia total de hackers u otros que accedan de modo fraudulento a los datos personales, el Responsable del tratamiento se compromete a comunicar al Usuario sin dilación indebida cuando ocurra una violación de la seguridad de los datos personales que sea probable que entrañe un alto riesgo para los derechos y libertades de las personas físicas. Se entiende por violación de la seguridad de los datos personales toda violación de la seguridad que ocasione la destrucción, pérdida o alteración accidental o ilícita de datos personales transmitidos, conservados o tratados de otra forma, o la comunicación o acceso no autorizados a dichos datos.
                            </p>

                            <h4 className="mt-3 text-electric-green fw-bold" style={{ fontSize: '1rem' }}>II. ACEPTACIÓN Y CAMBIOS EN ESTA POLÍTICA DE PRIVACIDAD</h4>
                            <p style={{ color: 'var(--text-medium-gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>Es necesario que el Usuario haya leído y esté conforme con las condiciones sobre la protección de datos de carácter personal contenidas en esta Política de Privacidad, así como que acepte el tratamiento de sus datos personales para que el Responsable del tratamiento pueda proceder al mismo en la forma, durante los plazos y para las finalidades indicadas. El uso del Sitio Web implicará la aceptación de la Política de Privacidad del mismo.

                                <br /><br />FUNGIRAK WEBSITE se reserva el derecho a modificar su Política de Privacidad, de acuerdo a su propio criterio, o motivado por un cambio en la normativa vigente. Los cambios o actualizaciones de esta Política de Privacidad no serán notificados de forma explícita al Usuario. Se recomienda al Usuario consultar esta página de forma periódica para estar al tanto de los últimos cambios o actualizaciones.
                            </p>

                            <h6 className="text-center mt-4 text-electric-green" style={{ fontSize: '0.85rem' }}>TODOS LOS DERECHOS RESERVADOS.</h6>
                            <h6 className="text-center text-electric-green" style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} FUNGIRAK.COM</h6>
                        </p>
                    </div>
                </div>
            </Modal>
            {/* --- FIN SECCIÓN 7: POLÍTICA DE PRIVACIDAD (CONTENIDO EN MODAL) --- */}

            {/* --- MODAL PARA SECCIONES --- */}
            <Modal 
                isOpen={sectionModalIsOpen} 
                onRequestClose={closeSectionModal}
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--neomorph-base-dark)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '2rem',
                        maxWidth: '900px',
                        width: 'auto',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        boxShadow: '10px 10px 20px var(--neomorph-dark-shadow), -10px -10px 20px var(--neomorph-light-shadow)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 2000
                    }
                }}
            >
                <button
                    onClick={closeSectionModal}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '2.5rem',
                        color: 'var(--text-light-gray)',
                        cursor: 'pointer',
                        zIndex: 2001
                    }}
                >
                    &times;
                </button>
                
                {currentSection && sectionsContent[currentSection] && (
                    <div style={{ backgroundColor: 'var(--neomorph-base-dark)', color: 'var(--text-medium-gray)', minWidth: '400px' }}>
                        <h2 className="text-center fw-normal text-electric-green section-title-glow mb-4" style={{ fontSize: '1.8rem' }}>
                            {sectionsContent[currentSection].title}
                        </h2>
                        <div className="mt-3">
                            {sectionsContent[currentSection].content}
                        </div>
                    </div>
                )}
            </Modal>
            {/* --- FIN MODAL PARA SECCIONES --- */}

            {/* --- MODAL PARA CERTIFICACIONES (dentro del modal de Trayectoria) --- */}
            <Modal
                isOpen={certModalIsOpen}
                onRequestClose={closeCertModal}
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--neomorph-base-dark)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '1rem',
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '10px 10px 20px var(--neomorph-dark-shadow), -10px -10px 20px var(--neomorph-light-shadow)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 3000
                    }
                }}
            >
                <button
                    onClick={closeCertModal}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '2.5rem',
                        color: 'var(--text-light-gray)',
                        cursor: 'pointer',
                        zIndex: 3001
                    }}
                >
                    &times;
                </button>
                {currentCertImage && (
                    <img
                        src={currentCertImage}
                        alt="Certificado en Modal"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                            borderRadius: '10px'
                        }}
                    />
                )}
            </Modal>
            {/* --- FIN MODAL CERTIFICACIONES --- */}

            {/* --- SECCIÓN 8: FOOTER GLOBAL --- */}

            <footer className="site-footer" style={{ padding: '1.5rem 0' }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div className="row">
                        {/* Columna: Explorar */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Explorar</h5>
                            <ul style={{ paddingLeft: '0' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('acerca-de-mi'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Acerca de Mí</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('trayectoria'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Trayectoria y Visión</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('skills'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Skills</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('proyectos'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Proyectos Públicos</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); policyModalHandler(true); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Política de Privacidad</a></li>
                            </ul>
                        </div>

                        {/* Nueva Columna: Mi Trayectoria (otros links) */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Mi Trayectoria</h5>
                            <ul style={{ paddingLeft: '0' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('experiencia'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Experiencia Laboral</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('aptitudes'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Aptitudes Clave</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('educacion'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Educación</a></li>
                            </ul>
                        </div>

                        {/* Nueva Columna: Certificaciones */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Certificaciones</h5>
                            <ul style={{ paddingLeft: '0' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('licencias'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Licencias</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('reconocimientos'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Reconocimientos</a></li>
                            </ul>
                        </div>

                        {/* Nueva Columna: Perfil */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Perfil</h5>
                            <ul style={{ paddingLeft: '0' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('idiomas'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Idiomas</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('intereses'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Intereses</a></li>
                            </ul>
                        </div>

                        {/* Nueva Columna: Proyectos */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Proyectos</h5>
                            <ul style={{ paddingLeft: '0' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('proyectos'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Portafolio</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); openSectionModal('skills'); }} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Tecnologías</a></li>
                            </ul>
                        </div>

                        {/* Columna de Contacto */}
                        <div className="col-md-2 col-sm-6 footer-col" style={{ marginBottom: '1.5rem' }}>
                            <h5 className="footer-section-title" style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.8rem' }}>Contacto</h5>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email: <a href="mailto:fungirak@gmail.com" className="text-electric-green">fungirak@gmail.com</a></p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>LinkedIn: <a href="https://ar.linkedin.com/in/gabriel-lazzarini" target="_blank" rel="noopener noreferrer" className="text-electric-green">/in/gabriel-lazzarini</a></p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>GitHub: <a href="https://github.com/fungirak" target="_blank" rel="noopener noreferrer" className="text-electric-green">/fungirak</a></p>
                            
                            <div className="d-flex social-icons mt-3" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                                <a href="https://github.com/fungirak" target="_blank" rel="noopener noreferrer" title="GitHub" style={{ marginRight: '0.8rem' }}>
                                    <Image src={logoGithub} alt="GitHub" width={25} height={25} style={{ filter: 'brightness(0) invert(1)' }} />
                                </a>
                                <a href="https://ar.linkedin.com/in/gabriel-lazzarini" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                    <Image src={logoLinkedin} alt="LinkedIn" width={25} height={25} style={{ filter: 'brightness(0) invert(1)' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-12 text-center footer-bottom-text" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>&copy; {new Date().getFullYear()}🍄 Gabriel Lazzarini. Todos los derechos reservados.</p>
                        <p style={{ fontSize: '0.8rem', marginBottom: '0' }}>Diseñado y desarrollado con pasión por FUNGIRAK</p>
                    </div>
                </div>

            </footer>
        </>
    );
};

export default ContactAndPolicies;
