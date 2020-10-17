import React, { useState, useRef, useCallback } from "react";
import produce from "immer";
import { numRows, numColumns } from "../../helpers/rowsAndColumns";
import cellRule from "../../helpers/cellRule";
import createGrid from "../../helpers/createGrid";

import { ButtonPress, Grid } from "./styles";
const Main: React.FC = () => {
  const ArrRows = createGrid({ numRows, numColumns });
  const [handlePlay, setHandlePlay] = useState(false);

  const [gridArea, setGridArea] = useState(() => {
    return ArrRows;
  });

  const playReference = useRef(handlePlay);
  playReference.current = handlePlay;

  const checkHandlePlay = useCallback(() => {
    if (!playReference.current) return;

    setGridArea((grid) => {
      return produce(grid, (newGrid) => {
        for (let indexOne = 0; indexOne < numRows; indexOne++) {
          for (let indexTwo = 0; indexTwo < numColumns; indexTwo++) {
            let cellsAround = 0;
            //Layout bidimensional(Eixo Y e Y)
            cellRule.forEach(([coordinateX, coordinateY]) => {
              const IndexOneX = indexOne + coordinateX;
              const IndexTwoY = indexTwo + coordinateY;

              if (
                IndexOneX >= 0 &&
                IndexOneX < numRows &&
                IndexTwoY >= 0 &&
                IndexTwoY < numColumns
              ) {
                cellsAround += grid[IndexOneX][IndexTwoY];
              }
            });
            /*
             *1.	Qualquer célula viva com menos de dois vizinhos vivos morre de solidão.
             *2.	Qualquer célula viva com mais de três vizinhos vivos morre de superpopulação.
             */
            if (cellsAround < 2 || cellsAround > 3) {
              newGrid[indexOne][indexTwo] = 0;
            } else if (grid[indexOne][indexTwo] === 0 && cellsAround === 3) {
              /*
               *4.	Qualquer célula viva com dois ou três vizinhos vivos continua no mesmo estado para a próxima geração.
               *3.	Qualquer célula morta com exatamente três vizinhos vivos se torna uma célula viva.
               */
              newGrid[indexOne][indexTwo] = 1;
            }
          }
        }
      });
    });

    //Tempo para atualizaçao
    setTimeout(checkHandlePlay, 350);
  }, []);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColumns}, 20px)`,
        }}
      >
        {gridArea.map((numRows, indexOne) =>
          numRows.map((numColumns, indexOneTwo) => (
            <Grid
              key={`${indexOne}-${indexOneTwo}`}
              onClick={() => {
                const newGridImmer = produce(gridArea, (newGrid) => {
                  newGrid[indexOne][indexOneTwo] = gridArea[indexOne][
                    indexOneTwo
                  ]
                    ? 0
                    : 1;
                });
                setGridArea(newGridImmer);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: gridArea[indexOne][indexOneTwo]
                  ? "#063854"
                  : undefined,
                border: "solid 1px gray",
              }}
            />
          ))
        )}
      </div>

      <ButtonPress
        onClick={() => {
          setHandlePlay(!handlePlay);
          if (!handlePlay) {
            playReference.current = true;
            checkHandlePlay();
          }
        }}
      >
        Use
      </ButtonPress>
    </>
  );
};

export default Main;
