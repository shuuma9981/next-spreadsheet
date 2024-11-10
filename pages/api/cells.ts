import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { CellContent } from "@/types/spreadsheet";

type Data = {
    cells?: Array<Array<CellContent>>;
};

const FILE_PATH = path.join(process.cwd(), "db.json");

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { method } = req;

    switch (method) {
        case "GET":
            // ファイルが存在する場合、データを読み込んで返す
            if (fs.existsSync(FILE_PATH)) {
                const content = fs.readFileSync(FILE_PATH, "utf-8");
                const data = JSON.parse(content);
                res.status(200).json(data);
            } else {
                // ファイルが存在しない場合、空オブジェクトを返す
                res.status(200).json({});
            }
            break;

        case "POST":
            const { cells } = req.body;
            // 受け取ったデータをファイルに保存
            const data = JSON.stringify({ cells });
            fs.writeFileSync(FILE_PATH, data, "utf-8");
            res.status(200).json({});
            break;

        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
