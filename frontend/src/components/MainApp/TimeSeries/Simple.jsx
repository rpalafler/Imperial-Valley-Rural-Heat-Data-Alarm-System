import React, {useState} from "react";
import "./Modal.css";
import * as ss from 'simple-statistics';
import June_Data from './june_rh2m.json';

export default function Simple(){
    const [modal, setModal] = useState(false);

    const toggleModal = () =>{
        setModal(!modal);
    };

    if(modal){
        document.body.classList.add('active-modal')
    }else{
        document.body.classList.remove('active-modal')
    }
    
    const rh2m_values = June_Data.map(item=>item.rh2m);
    
    const sigFig = (num)=>num.toFixed(2);
    return(
        <>
        <button onClick ={toggleModal} className="btn-modal">
            Simple Stats
        </button>

        {modal && (
            <div className="modal">
                <div onClick = {toggleModal} className ="overlay">/</div>
                <div className = "modal-content">
                   
                    <h2>Statistics Summary</h2>
                    <p><span className="label">Min:</span> {sigFig(ss.min(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">25%:</span> {sigFig(ss.quantile(rh2m_values, 0.25))}</p>
                    <hr/>
                    <p><span className="label">50%:</span> {sigFig(ss.quantile(rh2m_values, 0.5))}</p>
                    <hr/>
                    <p><span className="label">Mean:</span> {sigFig(ss.mean(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">75%:</span> {sigFig(ss.quantile(rh2m_values, 0.75))}</p>
                    <hr/>
                    <p><span className="label">Max:</span> {sigFig(ss.max(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">Standard Deviation:</span> {sigFig(ss.standardDeviation(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">Variance:</span> {sigFig(ss.variance(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">Skewness:</span>{sigFig(ss.sampleSkewness(rh2m_values))}</p>
                    <hr/>
                    <p><span className="label">Kurtosis:</span>{sigFig(ss.sampleKurtosis(rh2m_values))}</p>
                    
                    <button className="close-modal" onClick={toggleModal}>
                        Close
                    </button>
                </div>
            </div>
        )}
        </>
    );  
}

