import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

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
  redirectUrl = '/success',
  onCodeComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const connectionsRef = useRef<boolean[][][]>([]);
  const deadEndsRef = useRef<[number, number][]>([]);
  const deadEndNumbersRef = useRef<number[]>([]);
  const prevPlayerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [password, setPassword] = useState<string>('');
  const [actualCellSize, setActualCellSize] = useState<number>(cellSize);
  
  const [arrowMapping, setArrowMapping] = useState<ArrowMapping>({
    top: 'up',
    bottom: 'down',
    left: 'left',
    right: 'right'
  });

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

  const movePlayer = (direction: Direction, fromVirtualKeyboard: boolean = false) => {
    const connections = connectionsRef.current;
    if (!connections || connections.length === 0) return;

    const { x, y } = playerPos;
    let newX = x;
    let newY = y;

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
      
      if (fromVirtualKeyboard) {
        shuffleArrows();
      }
    }
  };

  useEffect(() => {
    if (password.length === codeLength) {
      console.log(`✅ Code complet saisi : ${password}`);
      
      if (onCodeComplete) {
        onCodeComplete(password);
      }
      
      setTimeout(() => {
        router.visit(redirectUrl, {method: 'get', data: { code: password }});
      }, 500);
    }
  }, [password, codeLength, redirectUrl, onCodeComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // --- CALCUL DE LA TAILLE ADAPTATIVE ---
    // Réserver de l'espace pour les contrôles (environ 400px pour info + clavier)
    const reservedHeight = 400;
    const reservedWidth = 40; // Marges horizontales
    
    const availableWidth = window.innerWidth - reservedWidth;
    const availableHeight = window.innerHeight - reservedHeight;
    
    // Calculer la taille de cellule qui permet de faire tenir la grille
    const maxCellWidth = Math.floor(availableWidth / gridCols);
    const maxCellHeight = Math.floor(availableHeight / gridRows);
    
    // Prendre la plus petite des deux pour garder des cellules carrées
    const adaptiveCellSize = Math.min(maxCellWidth, maxCellHeight, cellSize);
    
    setActualCellSize(adaptiveCellSize);
    
    const pathWidth = adaptiveCellSize - wallThickness;
    const cols = gridCols;
    const rows = gridRows;

    canvas.width = cols * adaptiveCellSize;
    canvas.height = rows * adaptiveCellSize;

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
          x * adaptiveCellSize + wallThickness / 2,
          y * adaptiveCellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
      };

      const connectHorizontal = (x: number, y: number) => {
        ctx.fillRect(
          (x * adaptiveCellSize) + adaptiveCellSize - wallThickness,
          (y * adaptiveCellSize) + wallThickness / 2,
          wallThickness * 2,
          pathWidth
        );
        connections[y][x][1] = true;
        connections[y][x + 1][3] = true;
      };

      const connectVertical = (x: number, y: number) => {
        ctx.fillRect(
          (x * adaptiveCellSize) + wallThickness / 2,
          (y * adaptiveCellSize) + adaptiveCellSize - wallThickness,
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
          x * adaptiveCellSize + wallThickness / 2,
          y * adaptiveCellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );

        const number = numbersToAssign[index];
        ctx.fillStyle = textColor;
        ctx.font = `bold ${adaptiveCellSize * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          number.toString(),
          x * adaptiveCellSize + adaptiveCellSize / 2,
          y * adaptiveCellSize + adaptiveCellSize / 2
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

    const pathWidth = actualCellSize - wallThickness;

    const redrawCell = (x: number, y: number) => {
      const deadEndIndex = deadEndsRef.current.findIndex(([dx, dy]) => dx === x && dy === y);
      
      if (deadEndIndex !== -1) {
        const numbersToAssign = deadEndNumbersRef.current;
        
        ctx.fillStyle = deadEndColor;
        ctx.fillRect(
          x * actualCellSize + wallThickness / 2,
          y * actualCellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
        
        ctx.fillStyle = textColor;
        ctx.font = `bold ${actualCellSize * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          numbersToAssign[deadEndIndex].toString(),
          x * actualCellSize + actualCellSize / 2,
          y * actualCellSize + actualCellSize / 2
        );
      } else {
        ctx.fillStyle = pathColor;
        ctx.fillRect(
          x * actualCellSize + wallThickness / 2,
          y * actualCellSize + wallThickness / 2,
          pathWidth,
          pathWidth
        );
      }
    };

    const prevPos = prevPlayerPosRef.current;
    redrawCell(prevPos.x, prevPos.y);

    ctx.fillStyle = playerColor;
    const playerSize = pathWidth * 0.8;
    const offset = (actualCellSize - playerSize) / 2;
    
    ctx.fillRect(
      playerPos.x * actualCellSize + offset,
      playerPos.y * actualCellSize + offset,
      playerSize,
      playerSize
    );

    prevPlayerPosRef.current = { x: playerPos.x, y: playerPos.y };

  }, [playerPos, actualCellSize, wallThickness, pathColor, deadEndColor, textColor, playerColor]);

  const remainingDigits = codeLength - password.length;

  const arrowSymbols: Record<Direction, string> = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
  };

  const buttonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    fontSize: '24px',
    border: '2px solid #3366ff',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#3366ff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    transition: 'all 0.1s ease',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#3366ff',
    color: '#fff',
    transform: 'scale(0.95)',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '20px',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        }} 
        tabIndex={0}
      />
      
      {/* Informations du code */}
      <div style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', width: '100%' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: password.length === codeLength ? '#00cc00' : '#333',
          fontFamily: 'monospace',
          letterSpacing: '4px'
        }}>
          Code : {password || '________'.slice(0, codeLength).split('').join(' ')}
        </div>
        <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
          {remainingDigits > 0 
            ? `${remainingDigits} chiffre${remainingDigits > 1 ? 's' : ''} restant${remainingDigits > 1 ? 's' : ''} • -1 = suppression`
            : '✓ Code complet ! Redirection...'}
        </div>
      </div>

      {/* Clavier virtuel avec flèches dynamiques */}
      <div style={{ color: '#666', marginBottom: '8px', marginTop: '16px', textAlign: 'center' }}>
        Utilisez les boutons ci-dessous pour vous déplacer dans le labyrinthe.
      </div>
      <div style={{ 
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 60px)',
        gridTemplateRows: 'repeat(3, 60px)',
        gap: '10px'
      }}>
        <div />
        <button
          style={buttonStyle}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!;
            e.currentTarget.style.color = buttonHoverStyle.color!;
            e.currentTarget.style.transform = buttonHoverStyle.transform!;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => movePlayer(arrowMapping.top, true)}
        >
          {arrowSymbols[arrowMapping.top]}
        </button>
        <div />

        <button
          style={buttonStyle}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!;
            e.currentTarget.style.color = buttonHoverStyle.color!;
            e.currentTarget.style.transform = buttonHoverStyle.transform!;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => movePlayer(arrowMapping.left, true)}
        >
          {arrowSymbols[arrowMapping.left]}
        </button>
        <div />
        <button
          style={buttonStyle}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!;
            e.currentTarget.style.color = buttonHoverStyle.color!;
            e.currentTarget.style.transform = buttonHoverStyle.transform!;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => movePlayer(arrowMapping.right, true)}
        >
          {arrowSymbols[arrowMapping.right]}
        </button>

        <div />
        <button
          style={buttonStyle}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!;
            e.currentTarget.style.color = buttonHoverStyle.color!;
            e.currentTarget.style.transform = buttonHoverStyle.transform!;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
            e.currentTarget.style.color = buttonStyle.color!;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={() => movePlayer(arrowMapping.bottom, true)}
        >
          {arrowSymbols[arrowMapping.bottom]}
        </button>
        <div />
      </div>
    </div>
  );
};

export default MazeGenerator;
