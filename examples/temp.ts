import ClickUp from "../src/core/ClickUp";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";

dotenv.config();

interface Tasks {
  id: string;
  custom_id: string;
  name: string;
  status: string;
  status_color: string;
  date_created: string;
  date_updated: string;
  date_closed: null | string;
  date_done: null | string;
  archived: boolean;
  creator: string;
  creator_email: string;
  assignees: string[];
  watchers: string[];
  tags: string[];
  priority: string | null;
  due_date: null | string;
  start_date: null;
  time_estimate: null;
  list_name: string;
  project_name: string;
  folder_name: string;
  url: string;
  is_completed: boolean;
  locations: string[];
  custom_fields: CustomField[];
  description: string;
}

interface CustomField {
  id: string;
  name: string;
  value: string[] | string;
}

const apiKey = process.env.CLICKUP_API_KEY as string;

const sentJobs = [
  [
    "4423437",
    "4233945",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4424472",
    "4234323",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421880",
    "4233969",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831913",
    "4234147",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5862662",
    "4234223",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831836",
    "4234135",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5862618",
    "4234217",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831930",
    "4235032",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "6039727",
    "4234980",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421868",
    "4233941",
    "REDESIGN SENT",
    "BEATRIZ LEAL",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421861",
    "4234215",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421871",
    "4233943",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421860",
    "4234321",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831889",
    "4234149",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421859",
    "4234171",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421884",
    "4234429",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421877",
    "4252512",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421870",
    "4233947",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421876",
    "4234982",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831939",
    "4235089",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421867",
    "4234069",
    "REDESIGN SENT",
    "BEATRIZ LEAL",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421673",
    "4234173",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831793",
    "4234133",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421866",
    "4233953",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421881",
    "4234137",
    "REDESIGN SENT",
    "BEATRIZ LEAL",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831982",
    "4235091",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5862630",
    "4234221",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421862",
    "4233933",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5831934",
    "4235030",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4421872",
    "4234047",
    "REDESIGN SENT",
    "BEATRIZ LEAL",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5715752",
    "4233719",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5715756",
    "4233589",
    "REDESIGN SENT",
    "Anais Del Valle Archila Gonzalez",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4420330",
    "4233601",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "5715762",
    "4233725",
    "REDESIGN SENT",
    "Nathaly",
    "ACTIVE",
    "JEFF ETHIER",
    "QC",
  ],
  [
    "4483276",
    "2991947",
    "SENT",
    "Joaquin Garcia",
    "ACTIVE",
    "JEFF ETHIER",
    "PACKAGE PREP",
  ],
  [
    "4483275",
    "2991937",
    "SENT",
    "Joaquin Garcia",
    "ACTIVE",
    "JEFF ETHIER",
    "PACKAGE PREP",
  ],
  [
    "4483230",
    "2976960",
    "SENT",
    "Sergio Flores Escalona",
    "ACTIVE",
    "JEFF ETHIER",
    "COAX",
  ],
  [
    "4483232",
    "2975862",
    "SENT",
    "Andres Rodriguez",
    "ACTIVE",
    "JEFF ETHIER",
    "COAX",
  ],
  [
    "4483257",
    "2975841",
    "SENT",
    "Sergio Flores Escalona",
    "ACTIVE",
    "JEFF ETHIER",
    "COAX",
  ],
  [
    "4483231",
    "2975850",
    "SENT",
    "Andres Rodriguez",
    "ACTIVE",
    "JEFF ETHIER",
    "COAX",
  ],
];

const clickUp = new ClickUp(apiKey);

async function execute() {
  const raw = readFileSync(
    "C:\\Users\\93jad\\OneDrive\\Documents\\apps\\clickUp-classes\\examples\\filteredTasks.json",
    "utf-8"
  );
  const tasks: Tasks[] = JSON.parse(raw);

  const filteredTasks = tasks.filter(
    (t) =>
      t.custom_fields.find((cf) => cf.name === "PROJECT TYPE")?.value ===
      "REDESIGN"
  );

  console.log(filteredTasks.length);

  filteredTasks.forEach((t) => {
    console.log(
      t.name,
      t.custom_fields.find((cf) => cf.name === "PROJECT TYPE")?.value,
      t.custom_fields.find((cf) => cf.name === "REDESIGN BILLING STATUS")?.value
    );
  });
}

execute();
