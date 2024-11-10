import { useState, useEffect } from "react";
import Cell from "./Cell";
import { CellContent } from "@/types/spreadsheet";

export default function Spreadsheet() {
    const [cellContents, setCellContents] = useState<Array<Array<CellContent>>>([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);

    const handleCellChange = (i: number, j: number, updated: CellContent) => {
        const updatedCellContents = cellContents.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                rowIndex === i && colIndex === j ? updated : cell
            )
        );
        setCellContents(updatedCellContents);
    };

    // ローカルストレージやサーバーサイドへのデータ保存用関数
    const persist = () => {
        fetch("/api/cells", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cells: cellContents }),
        });
    };

    // ページロード時にデータをサーバーから取得してステートにセット
    useEffect(() => {
        fetch("/api/cells")
            .then((res) => res.json())
            .then((data) => {
                if (data.cells) {
                    setCellContents(data.cells);
                }
            });
    }, []);

    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        {cellContents[0].map((_, i) => (
                            <th key={i}>{String.fromCharCode(65 + i)}</th>
                        ))}
                    </tr>
                    {cellContents.map((row, i) => (
                        <tr key={i}>
                            <th>{i + 1}</th>
                            {row.map((cell, j) => (
                                <Cell
                                    key={`${i}-${j}`}
                                    content={cell}
                                    onChange={(updated) => handleCellChange(i, j, updated)}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => setCellContents([...cellContents, Array(cellContents[0].length).fill(0)])}
            >
                + row
            </button>
            <button
                onClick={() => setCellContents(cellContents.slice(0, -1))}
            >
                - row
            </button>
            <br />
            <button
                onClick={() => setCellContents(cellContents.map(row => [...row, 0]))}
            >
                + column
            </button>
            <button
                onClick={() => setCellContents(cellContents.map(row => row.slice(0, -1)))}
            >
                - column
            </button>
            <br />
            <button onClick={persist}>Save</button>
        </>
    );
}
