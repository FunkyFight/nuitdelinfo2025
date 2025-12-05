import MazeGenerator from '~/components/Maze.js';

export default function Join(){
    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
    }}>
        <MazeGenerator gridCols={8} gridRows={8} cellSize={48} redirectUrl='/play' />
        </div>
}
