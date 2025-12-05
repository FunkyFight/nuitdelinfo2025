import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import '../css/maze.css';

interface MazeGeneratorProps {
  gridCols?: number;
  gridRows?: number;
  cellSize?: number;
  wallThickness?: number;
  wallColor?: string;
  pathColor?: string;
  deadEndColor?: string;
  textColor?: string;
  playerColor?: string;
  codeLength?: number;
  redirectUrl?: string;
  onCodeComplete?: (code: string) => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type ArrowMapping = Record<'top' | 'bottom' | 'left' | 'right', Direction>;

const MazeGenerator: React.FC<MazeGeneratorProps> = ({ 
  gridCols = 12,
  gridRows = 12,
  cellSize = 40,
  wallThickness = 3,
  wallColor = '#222', 
  pathColor = '#fff',
  deadEndColor = '#ff3333',
  textColor = '#000',
  playerColor = '#3366ff',
  codeLength = 8,
  redirectUrl = '/play',
  onCodeComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const connectionsRef = useRef<boolean[][][]>([]);
  const deadEndsRef = useRef<[number, number][]>([]);
  const deadEndNumbersRef = useRef<number[]>([]);
  const prevPlayerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [password, setPassword] = useState<string>('');
  
  // État pour le mapping des flèches (position du bouton -> direction réelle)
  const [arrowMapping, setArrowMapping] = useState<ArrowMapping>({
    top: 'up',
    bottom: 'down',
    left: 'left',
    right: 'right'
  });

  // Fonction pour mélanger aléatoirement les flèches
  const shuffleArrows = () => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const shuffled = [...directions].sort(() => Math.random() - 0.5);
    
    setArrowMapping({
      top: shuffled[0],
      bottom: shuffled[1],
      left: shuffled[2],
      right: shuffled[3]
    });
  };

  // Fonction de déplacement réutilisable
  const movePlayer = (direction: Direction, fromVirtualKeyboard: boolean = false) => {
    const connections = connectionsRef.current;
    if (!connections || connections.length === 0) return;

    const { x, y } = playerPos;
    let newX = x;
    let newY = y;

    // Directions : [0]=haut, [1]=droite, [2]=bas, [3]=gauche
    switch (direction) {
      case 'up':
        if (connections[y]?.[x]?.[0]) newY = y - 1;
        break;
      case 'right':
        if (connections[y]?.[x]?.[1]) newX = x + 1;
        break;
      case 'down':
        if (connections[y]?.[x]?.[2]) newY = y + 1;
        break;
      case 'left':
        if (connections[y]?.[x]?.[3]) newX = x - 1;
        break;
    }

    if (newX !== x || newY !== y) {
      setPlayerPos({ x: newX, y: newY });
      
      // Mélanger les flèches si le déplacement vient du clavier virtuel
      if (fromVirtualKeyboard) {
        shuffleArrows();
      }
    }
  };

  // Validation automatique du code
  useEffect(() => {
    if (password.length === codeLength) {
      console.log(`✅ Code complet saisi : ${password}`);
      
      if (onCodeComplete) {
        onCodeComplete(password);
      }
      
      setTimeout(() => {
        router.visit(redirectUrl, {method: 'get', data: { room_id: password }});
      }, 500);
    }
  }, [password, codeLength, redirectUrl, onCodeComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const pathWidth = cellSize - wallThickness;
    const cols = gridCols;
    const rows = gridRows;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    const generateMaze = () => {
      const connections: boolean[][][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => [false, false, false, false])
      );

      let currentRow = 0;
      let setCounter = 1;
      let rowState = new Int32Array(cols);

      for (let i = 0; i < cols; i++) rowState[i] = setCounter++;

      ctx.fillStyle = wallColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pathColor;

      const renderCell = (x: number, y: number, color: string = pathColor) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          x * cellSize + wallThickness / 2,
          y * cellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
      };

      const connectHorizontal = (x: number, y: number) => {
        ctx.fillRect(
          (x * cellSize) + cellSize - wallThickness,
          (y * cellSize) + wallThickness / 2,
          wallThickness * 2,
          pathWidth
        );
        connections[y][x][1] = true;
        connections[y][x + 1][3] = true;
      };

      const connectVertical = (x: number, y: number) => {
        ctx.fillRect(
          (x * cellSize) + wallThickness / 2,
          (y * cellSize) + cellSize - wallThickness,
          pathWidth,
          wallThickness * 2
        );
        connections[y][x][2] = true;
        connections[y + 1][x][0] = true;
      };

      while (currentRow < rows) {
        for (let i = 0; i < cols; i++) renderCell(i, currentRow);

        for (let i = 0; i < cols - 1; i++) {
          const shouldConnect = Math.random() > 0.5 || currentRow === rows - 1;
          
          if (rowState[i] !== rowState[i + 1] && shouldConnect) {
            const oldSet = rowState[i + 1];
            const newSet = rowState[i];
            
            for (let k = 0; k < cols; k++) {
              if (rowState[k] === oldSet) rowState[k] = newSet;
            }
            connectHorizontal(i, currentRow);
          }
        }

        if (currentRow === rows - 1) {
          currentRow++;
          break;
        }

        const nextRowState = new Int32Array(cols);
        const sets: Record<number, number[]> = {};

        for (let i = 0; i < cols; i++) {
          const id = rowState[i];
          if (!sets[id]) sets[id] = [];
          sets[id].push(i);
        }

        Object.keys(sets).forEach((key) => {
          const id = parseInt(key, 10);
          const columns = sets[id];
          columns.sort(() => Math.random() - 0.5);

          let count = 0;
          for (const colIndex of columns) {
            if (count === 0 || Math.random() > 0.5) {
              connectVertical(colIndex, currentRow);
              nextRowState[colIndex] = rowState[colIndex];
              count++;
            }
          }
        });

        for (let i = 0; i < cols; i++) {
          if (nextRowState[i] === 0) nextRowState[i] = setCounter++;
        }

        rowState = nextRowState;
        currentRow++;
      }

      return connections;
    };

    const detectDeadEnds = (connections: boolean[][][]): [number, number][] => {
      const deadEnds: [number, number][] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const openings = connections[y][x].filter(Boolean).length;
          if (openings === 1) {
            deadEnds.push([x, y]);
          }
        }
      }

      return deadEnds;
    };

    const numberDeadEnds = (deadEnds: [number, number][]) => {
      const filteredDeadEnds = deadEnds.filter(([x, y]) => !(x === 0 && y === 0));
      
      const shuffled = [...filteredDeadEnds].sort(() => Math.random() - 0.5);
      const numbersToAssign = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const selected = shuffled.slice(0, 11);

      selected.forEach(([x, y], index) => {
        ctx.fillStyle = deadEndColor;
        ctx.fillRect(
          x * cellSize + wallThickness / 2,
          y * cellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );

        const number = numbersToAssign[index];
        ctx.fillStyle = textColor;
        ctx.font = `bold ${cellSize * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          number.toString(),
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      });

      deadEndsRef.current = selected;
      deadEndNumbersRef.current = numbersToAssign;
    };

    const tryGenerate = () => {
      const connections = generateMaze();
      const deadEnds = detectDeadEnds(connections);

      const filteredDeadEnds = deadEnds.filter(([x, y]) => !(x === 0 && y === 0));
      
      console.log(`Culs-de-sac trouvés : ${deadEnds.length} (${filteredDeadEnds.length} utilisables)`);

      if (filteredDeadEnds.length >= 11) {
        connectionsRef.current = connections;
        numberDeadEnds(deadEnds);
        
        setPlayerPos({ x: 0, y: 0 });
        prevPlayerPosRef.current = { x: 0, y: 0 };
        setPassword('');
        
        console.log('✓ Labyrinthe valide généré !');
      } else {
        console.log('⚠ Pas assez de culs-de-sac utilisables, régénération...');
        setTimeout(tryGenerate, 50);
      }
    };

    tryGenerate();

  }, [gridCols, gridRows, cellSize, wallThickness, wallColor, pathColor, deadEndColor, textColor]);

  useEffect(() => {
    const deadEndIndex = deadEndsRef.current.findIndex(
      ([x, y]) => x === playerPos.x && y === playerPos.y
    );

    if (deadEndIndex !== -1) {
      const number = deadEndNumbersRef.current[deadEndIndex];
      
      if (number === -1) {
        setPassword(prev => prev.slice(0, -1));
      } else {
        setPassword(prev => prev.length < codeLength ? prev + number.toString() : prev);
      }
    }
  }, [playerPos, codeLength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const pathWidth = cellSize - wallThickness;

    const redrawCell = (x: number, y: number) => {
      const deadEndIndex = deadEndsRef.current.findIndex(([dx, dy]) => dx === x && dy === y);
      
      if (deadEndIndex !== -1) {
        const numbersToAssign = deadEndNumbersRef.current;
        
        ctx.fillStyle = deadEndColor;
        ctx.fillRect(
          x * cellSize + wallThickness / 2,
          y * cellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
        
        ctx.fillStyle = textColor;
        ctx.font = `bold ${cellSize * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          numbersToAssign[deadEndIndex].toString(),
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      } else {
        ctx.fillStyle = pathColor;
        ctx.fillRect(
          x * cellSize + wallThickness / 2,
          y * cellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
      }
    };

    const prevPos = prevPlayerPosRef.current;
    redrawCell(prevPos.x, prevPos.y);

    ctx.fillStyle = playerColor;
    const playerSize = pathWidth * 0.8;
    const offset = (cellSize - playerSize) / 2;
    
    ctx.fillRect(
      playerPos.x * cellSize + offset,
      playerPos.y * cellSize + offset,
      playerSize,
      playerSize
    );

    prevPlayerPosRef.current = { x: playerPos.x, y: playerPos.y };

  }, [playerPos, cellSize, wallThickness, pathColor, deadEndColor, textColor, playerColor]);


  const remainingDigits = codeLength - password.length;

  // Mapping des directions vers les symboles de flèches
  const arrowSymbols: Record<Direction, string> = {
    up: '⬆️',
    down: '⬇️',
    left: '⬅️',
    right: '➡️'
  };

  return (
    <div className="maze-wrapper">
      {/* Main content: Canvas + Controls */}
      <div className="maze-content">
        {/* Canvas */}
        <canvas 
          ref={canvasRef} 
          className="maze-canvas"
          tabIndex={0}
        />

        {/* Code display (left on desktop, top on mobile) */}
        <div className="maze-code-section">
          <div className={`maze-code-display ${password.length === codeLength ? 'complete' : ''}`}>
            Code : {password || '________'.slice(0, codeLength).split('').join(' ')}
          </div>
          <div className="maze-code-hint">
            {remainingDigits > 0 
              ? `${remainingDigits} chiffre${remainingDigits > 1 ? 's' : ''} restant${remainingDigits > 1 ? 's' : ''} • -1 = suppression`
              : '✓ Code complet ! Redirection...'}
          </div>
        </div>

        {/* Arrow controls (right on desktop, bottom on mobile) */}
        <div className="maze-controls">
          <div className="maze-instructions">
            Utilisez les boutons ci-dessous pour vous déplacer dans le labyrinthe.
          </div>
          <div className="maze-button-grid">
            {/* Row 1: Top arrow */}
            <div />
            <button
              className="maze-arrow-button"
              onClick={() => movePlayer(arrowMapping.top, true)}
              title="Haut"
            >
              {arrowSymbols[arrowMapping.top]}
            </button>
            <div />

            {/* Row 2: Left and Right */}
            <button
              className="maze-arrow-button"
              onClick={() => movePlayer(arrowMapping.left, true)}
              title="Gauche"
            >
              {arrowSymbols[arrowMapping.left]}
            </button>
            <div />
            <button
              className="maze-arrow-button"
              onClick={() => movePlayer(arrowMapping.right, true)}
              title="Droite"
            >
              {arrowSymbols[arrowMapping.right]}
            </button>

            {/* Row 3: Bottom arrow */}
            <div />
            <button
              className="maze-arrow-button"
              onClick={() => movePlayer(arrowMapping.bottom, true)}
              title="Bas"
            >
              {arrowSymbols[arrowMapping.bottom]}
            </button>
            <div />
          </div>
        </div>
      </div>
      <button style={{
          borderWidth: 2,
          borderRadius: "25px",
          margin: "5px",
          padding: "10px 25px",
          width: "100%",
          maxWidth: "350px",
        }}
        onClick={() => {
          let room_id: string | null = ""

          do{
            room_id = window.prompt("Entrez l'ID de la salle :")
          }while(!(new RegExp(String.raw`^\d{${codeLength}}$`, "g")).test(room_id || '') && room_id !== null)

          if(room_id) router.visit(redirectUrl, {method: 'get', data: { room_id: room_id }})
        }}
        >Je ne veux plus souffrir</button>
    </div>
  );
};

export default MazeGenerator;
