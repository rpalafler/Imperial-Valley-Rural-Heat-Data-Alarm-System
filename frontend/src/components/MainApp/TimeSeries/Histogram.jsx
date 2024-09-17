import React, {useState, useEffect} from "react";
import Plot from "react-plotly.js";
import "./Modal.css";
import June_Data from './june_rh2m.json';

const rh2m_values = June_Data.map(item=>item.rh2m);
export default function Histogram(){
    const [modal, setModal] = useState(false);

    const toggleModal = () =>{
        setModal(!modal);
    };

    if(modal){
        document.body.classList.add('active-modal')
    }else{
        document.body.classList.remove('active-modal')
    }

    return(
        <>
        <button onClick ={toggleModal} className="btn-modal">
            Histogram
        </button>

        {modal && (
            <div className="modal">
                <div onClick = {toggleModal} className ="overlay">/</div>
                <div className = "modal-content">
                <Plot
                     data = {[
                        {
                        type: 'histogram',
                        x: rh2m_values,
                        },
                    ]}
                     layout = {{
                        title: 'Histogram of Temperature Values',
                        xaxis: {title: 'Temperature'},
                        yaxis: {title: 'Frequency'},
                    }}
                />
                   
                    
                    <button className="close-modal" onClick={toggleModal}>
                        Close
                    </button>
                </div>
            </div>
        )}
        </>
    );  
};

