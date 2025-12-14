
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; 


import Portada from './Portada'; 
import ContactAndPolicies from './sections/ContactAndPolicies'; 


const posicionar = (y) => {
    window.scroll({ top: y, behavior: 'smooth' });
};

export default function App() {
  
    const [policyModalIsOpen, setPolicyModalIsOpen] = useState(false);

   
    const policyModalHandler = (isOpen) => {
        setPolicyModalIsOpen(isOpen);
    };

    
    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    return (
        <div id="main-app-container">
          
            <Portada />

            {/* Solo Footer con modales y políticas */}
            <ContactAndPolicies 
                posicionar={posicionar} 
                policyModalIsOpen={policyModalIsOpen} 
                policyModalHandler={policyModalHandler} 
            />
           
        </div>
    );
}