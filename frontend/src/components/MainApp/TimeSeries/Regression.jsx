import React, {useState, useEffect} from "react";
import Plot from "react-plotly.js";
import "./Modal.css";
import June_Data from './june_rh2m.json';


const rh2m_values = June_Data.map(item=>item.rh2m);
const days_elapsed = Array.from({length: rh2m_values.length}, (_, i) => i+1);


const mean_days = days_elapsed.reduce((sum, val)=> sum + val, 0)/days_elapsed.length;
const mean_rh2m = rh2m_values.reduce((sum, val)=> sum + val, 0)/rh2m_values.length;

export default function Regression(){
    const [modal, setModal] = useState(false);

    const toggleModal = () =>{
        setModal(!modal);
    };

    if(modal){
        document.body.classList.add('active-modal')
    }else{
        document.body.classList.remove('active-modal')
    }
    
    const [regressionLine, setRegressionLine] = useState([]);
    const [regressionParams, setRegressionParams] = useState({b0: 0, b1: 0});
    const [inputDays, setInputDays] = useState("");
    const [predictedTemp, setPredictedTemp] = useState(null);

    const data = [{
        x:days_elapsed,
        y: rh2m_values,
        mode:"markers",
        type: "scatter",
        name: "Temperatures",
        marker: {color: "blue"}
    }, {
        x: days_elapsed,
        y: regressionLine,
        mode: "lines",
        type: "scatter",
        name: "Regression Line",
        line: {color: "red"}
    }];

    const layout = {

        xaxis: {
            autorange: true,
        },
        yaxis: {
            autorange: true,
        },
    }

    useEffect(()=> {
        if(inputDays ===""){
            setPredictedTemp(null);
        } else if (parseFloat(inputDays)>= 0){
            const temp = regressionParams.b0 + regressionParams.b1 * parseFloat(inputDays);
            setPredictedTemp(temp <=100? temp.toFixed(2): 100);
        }
    }, [inputDays, regressionParams]);

    useEffect(()=>{
        trainModel();
    }, []);


    const trainModel = () => {
        const numerator = days_elapsed.reduce((sum, day, i)=> sum+(day-mean_days) * (rh2m_values[i]-mean_rh2m),0);
        const denominator = days_elapsed.reduce((sum, day) => sum + Math.pow(day-mean_days,2),0);
        const b1 = numerator/denominator;
        const b0 = mean_rh2m - b1*mean_days;

        const regressionYs = days_elapsed.map(x=> b0 + b1* x);
        setRegressionLine(regressionYs);
        setRegressionParams({b0,b1});

        
    }


    
    return(
        <>
        <button onClick ={toggleModal} className="btn-modal">
            Regression
        </button>

        {modal && (
            <div className="modal">
                <div onClick = {toggleModal} className ="overlay">/</div>
                <div className = "modal-content">
                <Plot
                style = {{width: "100%", height: 500}}
                 data = {data}
                layout = {layout}
                />
                    
                    <button className="close-modal" onClick={toggleModal}>
                        Close
                    </button>
                </div>
            </div>
        )}
        </>
    );  
}

