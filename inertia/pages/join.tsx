import MazeGenerator from '~/components/Maze.js';

export default function Join(){
    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}>
        <MazeGenerator gridCols={8} gridRows={8} cellSize={48} />
        </div>
}
/*
export function Join_old() {
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
}*/