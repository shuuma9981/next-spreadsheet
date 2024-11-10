import { useState, useEffect, KeyboardEvent } from "react";
import { CellContent } from "@/types/spreadsheet";

interface Props {
    content: CellContent;
    onChange: (updated: CellContent) => void;
}

export default function Cell({ content: initialContent, onChange }: Props) {
    const [editing, setEditing] = useState<boolean>(false);
    const [content, setContent] = useState<CellContent>(initialContent);

    // 計算式を評価する関数
    const evaluateFormula = (exp: string) => {
        const sanitized = exp.slice(1).replace(/[^\d+\-*/%]/g, '');
        return eval(sanitized);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setEditing(false);
            onChange(content);
        } else if (event.key === "Escape") {
            setEditing(false);
            setContent(initialContent);
        }
    };

    // `initialContent` が更新された場合に `content` をリセット
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    return (
        <td onClick={() => setEditing(true)}>
            {editing ? (
                <input
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={onKeyDown}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            ) : content.toString().startsWith("=") ? (
                evaluateFormula(content.toString())
            ) : (
                content
            )}
        </td>
    );
}
