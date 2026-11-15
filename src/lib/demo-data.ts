// DEMO DATA — illustrative only, not real customers or transactions.
export type JobStatus = "Completed" | "Printing" | "Queued" | "Pending" | "Failed";
export interface Kiosk {
  id: string; location: string; city: string; online: boolean;
  currentJob: string | null; paper: number; toner: number; lastActive: string;
}
export interface PrintJob {
  id: string; customer: string; phone: string; kiosk: string; document: string;
  pages: number; copies: number; color: "B&W" | "Colour"; size: "A4" | "A3";
  amount: number; status: JobStatus; date: string;
}
export interface Txn {
  id: string; orderId: string; method: "JazzCash" | "Easypaisa" | "Bank card";
  amount: number; status: "Successful" | "Pending" | "Refunded" | "Failed"; date: string;
}

export const demoKiosks: Kiosk[] = [
  { id: "SP-ISB-001", location: "Islamabad University", city: "Islamabad", online: true, currentJob: "SP-10482", paper: 82, toner: 64, lastActive: "Just now" },
  { id: "SP-ISB-002", location: "Islamabad Library", city: "Islamabad", online: true, currentJob: null, paper: 35, toner: 18, lastActive: "2 min ago" },
  { id: "SP-RWP-001", location: "Rawalpindi Campus", city: "Rawalpindi", online: false, currentJob: null, paper: 0, toner: 52, lastActive: "3 hours ago" },
];

const names = ["Ayesha Khan", "Hamza Ali", "Fatima Noor", "Usman Tariq", "Zainab Raza", "Bilal Ahmed", "Hira Siddiqui", "Saad Malik", "Maryam Iqbal", "Ali Hassan", "Sana Javed", "Omar Farooq"];
const docs = ["Thesis_Chapter3.pdf", "Assignment_DSA.pdf", "CNIC_copy.jpg", "Lab_Report.pdf", "Resume_2026.pdf", "Lecture_Notes.pdf", "Admission_Form.png", "Research_Paper.pdf", "Fee_Challan.pdf", "Poster_A3.png"];
const statuses: JobStatus[] = ["Completed", "Completed", "Completed", "Printing", "Queued", "Pending", "Completed", "Failed"];
const methods: Txn["method"][] = ["JazzCash", "Easypaisa", "Bank card"];

export const demoJobs: PrintJob[] = Array.from({ length: 28 }, (_, i) => {
  const pages = ((i * 7) % 24) + 1;
  const copies = (i % 3) + 1;
  const color = i % 4 === 0 ? "Colour" : "B&W";
  const size = i % 9 === 0 ? "A3" : "A4";
  const rate = color === "Colour" ? 30 : 10;
  const d = new Date(2026, 10, 15 - Math.floor(i / 3), 9 + (i % 9), (i * 13) % 60);
  return {
    id: `SP-${10482 - i}`,
    customer: names[i % names.length]!,
    phone: `03${(i % 5) + 0}${(1234567 + i * 7919).toString().slice(0, 8)}`,
    kiosk: demoKiosks[i % 3]!.id,
    document: docs[i % docs.length]!,
    pages, copies, color, size,
    amount: pages * copies * rate * (size === "A3" ? 2 : 1),
    status: i === 0 ? "Printing" : statuses[i % statuses.length]!,
    date: d.toISOString(),
  };
});

export const demoTxns: Txn[] = demoJobs.map((j, i) => ({
  id: `TXN-${(884120 - i * 37).toString()}`,
  orderId: j.id,
  method: methods[i % 3]!,
  amount: j.amount,
  status: j.status === "Failed" ? "Refunded" : j.status === "Pending" ? "Pending" : "Successful",
  date: j.date,
}));

export const dailyJobs = [
  { day: "Nov 9", jobs: 142, revenue: 9820 }, { day: "Nov 10", jobs: 168, revenue: 11240 },
  { day: "Nov 11", jobs: 191, revenue: 13110 }, { day: "Nov 12", jobs: 176, revenue: 12050 },
  { day: "Nov 13", jobs: 214, revenue: 15480 }, { day: "Nov 14", jobs: 98, revenue: 6720 },
  { day: "Nov 15", jobs: 121, revenue: 8340 },
];
export const volumeByLocation = [
  { location: "ISB University", pages: 18420 }, { location: "ISB Library", pages: 9310 }, { location: "RWP Campus", pages: 6140 },
];
export const peakHours = [
  { hour: "8am", jobs: 22 }, { hour: "9am", jobs: 48 }, { hour: "10am", jobs: 71 }, { hour: "11am", jobs: 84 },
  { hour: "12pm", jobs: 63 }, { hour: "1pm", jobs: 39 }, { hour: "2pm", jobs: 58 }, { hour: "3pm", jobs: 66 },
  { hour: "4pm", jobs: 44 }, { hour: "5pm", jobs: 25 },
];
export const popularOptions = [
  { name: "B&W · A4 · Single", value: 58 }, { name: "B&W · A4 · Double", value: 22 },
  { name: "Colour · A4", value: 14 }, { name: "A3 (any)", value: 6 },
];
