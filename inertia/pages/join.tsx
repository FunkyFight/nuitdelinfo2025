import { useEffect } from 'react';
import {Cell, Wall, draw} from '../js/kahoot.js';

export default function Join() {
    useEffect(() => {
        draw();
    }, []);
    
    return <>
        <div id="input_container" style = {{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <input type="text" id="codeInput" placeholder="Enter room code" style ={{
            borderWidth: 2,
            borderRadius: "25px",
            margin: "5px",
        }}/>
        </div>
        <div id="maze" style = {{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <canvas id="c1" style={{
            backgroundColor: "lightgrey",
        }}></canvas>
        </div>
        <p>here2</p>
    </>
}