import fs from "fs";
import { parse } from "csv-parse";

export const parseCSV = (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const emails: string[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on("data", (row) => {
        const email = row.email || row.Email || row["Email Address"];
        if (email && /\S+@\S+\.\S+/.test(email)) {
          emails.push(email.trim().toLowerCase());
        }
      })
      .on("end", () => {
        fs.unlink(filePath, () => {});
        const uniqueEmails = Array.from(new Set(emails));
        resolve(uniqueEmails);
      })
      .on("error", (err) => {
        reject(new Error(`CSV parsing failed: ${err.message}`));
      });
  });
};
