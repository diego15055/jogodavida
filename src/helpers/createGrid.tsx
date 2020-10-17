interface GridProps {
  numRows: number;
  numColumns: number;
}

function crateGrid({ numRows, numColumns }: GridProps) {
  const ArrRows = [];

  for (let i = 0; i < numRows; i++) {
    ArrRows.push(Array.from(Array(numColumns), () => 0));
  }
  return ArrRows;
}

export default crateGrid;
