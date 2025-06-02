import fs from "fs";
import { parse } from "csv-parse";
import stripBomStream from "strip-bom-stream";

type ParseCSVResult = {
  uniqueEmails: string[];
  uniqueCohorts: string[];
  emailCohortRelationships: { email: string; cohort: string }[];
};

export const parseCSV = (filePath: string): Promise<ParseCSVResult> => {
  return new Promise((resolve, reject) => {
    const emails: string[] = [];
    const cohorts: string[] = [];
    const emailCohortRelationships: { email: string; cohort: string }[] = [];

    fs.createReadStream(filePath)
      .pipe(stripBomStream())
      .pipe(parse({ columns: true }))
      .on("data", (row) => {
        const email = row.email || row.Email || row["Email Address"];
        const cohort = row.cohort || row.Cohort || row["Batch Name"];

        let pushedEmail;
        let pushedCohort;
        if (email && /\S+@\S+\.\S+/.test(email)) {
          pushedEmail = email.trim().toLowerCase();
        }

        if (cohort && !cohorts.some((c) => c === cohort.trim().toLowerCase())) {
          pushedCohort = cohort.trim().toLowerCase();
        }

        if (pushedEmail && pushedCohort) {
          emails.push(pushedEmail);
          cohorts.push(pushedCohort);
          emailCohortRelationships.push({
            email: pushedEmail,
            cohort: pushedCohort,
          });
        }
      })
      .on("end", () => {
        const uniqueEmails = Array.from(new Set(emails));
        const uniqueCohorts = Array.from(new Set(cohorts));
        const uniqueEmailCohortRelationships = emailCohortRelationships.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) => t.email === item.email && t.cohort === item.cohort,
            ),
        );
        resolve({
          uniqueEmails,
          uniqueCohorts,
          emailCohortRelationships: uniqueEmailCohortRelationships,
        });
      })
      .on("error", (err) => {
        reject(new Error(`CSV parsing failed: ${err.message}`));
      });
  });
};
