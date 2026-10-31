export type FieldType =
  | "text"
  | "date"
  | "tel"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "url";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  section: string;
  options?: string[];
  required?: boolean;
  wide?: boolean;
  placeholder?: string;
  hint?: string;
  uppercase?: boolean;
}

const YES_NO = ["Yes", "No"];
const STATUS = ["Pending", "Submitted", "Verified", "Not Applicable"];

export const SECTIONS = [
  "Personal",
  "Employment",
  "Provident Fund",
  "ESI",
] as const;

export const FIELDS: Field[] = [
  // ── Personal ────────────────────────────────────────────────
  { key: "employeeId", label: "Employee ID", type: "text", section: "Personal", required: true },
  { key: "fullName", label: "Employee Full Name", type: "text", section: "Personal", required: true },
  { key: "dob", label: "Date of Birth", type: "date", section: "Personal" },
  { key: "gender", label: "Gender", type: "select", section: "Personal", options: ["Male", "Female", "Other"] },
  { key: "maritalStatus", label: "Marital Status", type: "select", section: "Personal", options: ["Single", "Married", "Divorced", "Widowed"] },
  { key: "fatherSpouseName", label: "Father / Spouse Name", type: "text", section: "Personal" },
  { key: "mobile", label: "Personal Mobile", type: "tel", section: "Personal", placeholder: "10-digit number" },
  { key: "email", label: "Personal Email", type: "email", section: "Personal" },
  { key: "presentAddress", label: "Present Address", type: "textarea", section: "Personal", wide: true },
  { key: "permanentAddress", label: "Permanent Address", type: "textarea", section: "Personal", wide: true },
  { key: "emergencyName", label: "Emergency Contact Name", type: "text", section: "Personal" },
  { key: "emergencyRelationship", label: "Emergency Contact Relationship", type: "text", section: "Personal" },
  { key: "emergencyMobile", label: "Emergency Contact Mobile", type: "tel", section: "Personal", placeholder: "10-digit number" },
  { key: "pan", label: "PAN (optional / restricted)", type: "text", section: "Personal", uppercase: true, placeholder: "ABCDE1234F" },
  { key: "aadhaarStatus", label: "Aadhaar Verification Status", type: "select", section: "Personal", options: ["Pending", "Verified", "Not Verified"], hint: "Do not enter the full number" },
  { key: "docLink", label: "Photo / Document Folder Link", type: "url", section: "Personal", placeholder: "https://" },
  { key: "hrRemarks", label: "HR Remarks", type: "textarea", section: "Personal", wide: true },

  // ── Employment ──────────────────────────────────────────────
  { key: "doj", label: "Date of Joining", type: "date", section: "Employment" },
  { key: "department", label: "Department", type: "text", section: "Employment" },
  { key: "designation", label: "Designation", type: "text", section: "Employment" },
  { key: "employmentStatus", label: "Employment Status", type: "select", section: "Employment", options: ["Active", "Resigned", "Terminated", "Retired", "Absconded"] },
  { key: "doe", label: "Date of Exit", type: "date", section: "Employment" },
  { key: "exitReason", label: "Reason for Exit", type: "text", section: "Employment" },

  // ── Provident Fund ──────────────────────────────────────────
  { key: "uan", label: "UAN", type: "text", section: "Provident Fund" },
  { key: "pfMemberId", label: "PF Member ID", type: "text", section: "Provident Fund" },
  { key: "pfJoinDate", label: "Date of PF Joining", type: "date", section: "Provident Fund" },
  { key: "prevUanPf", label: "Previous UAN / PF Member ID", type: "text", section: "Provident Fund" },
  { key: "basicDa", label: "Basic + DA (₹)", type: "number", section: "Provident Fund" },
  { key: "pfWages", label: "PF Wages (₹)", type: "number", section: "Provident Fund" },
  { key: "pfNominationStatus", label: "PF Nomination Status", type: "select", section: "Provident Fund", options: STATUS },
  { key: "epfoNominationDate", label: "EPFO e-Nomination Submitted Date", type: "date", section: "Provident Fund" },
  { key: "pfKycStatus", label: "PF KYC Status", type: "select", section: "Provident Fund", options: STATUS },

  // ── ESI ─────────────────────────────────────────────────────
  { key: "employeeNameRef", label: "Employee Name (reference)", type: "text", section: "ESI", hint: "Defaults to the full name" },
  { key: "esiApplicable", label: "ESI Applicable?", type: "select", section: "ESI", options: YES_NO },
  { key: "esiNumber", label: "ESI Insurance Number", type: "text", section: "ESI" },
  { key: "esiJoinDate", label: "Date of ESI Joining", type: "date", section: "ESI" },
  { key: "prevEsiNumber", label: "Previous ESI Number", type: "text", section: "ESI" },
  { key: "ipDispensary", label: "IP Dispensary / Branch Office", type: "text", section: "ESI" },
  { key: "familyUpdated", label: "Family Particulars Updated?", type: "select", section: "ESI", options: YES_NO },
  { key: "esiFamilyVerifiedDate", label: "ESI Family Details Verified Date", type: "date", section: "ESI" },
  { key: "nomineeStatus", label: "Nominee / Benefit Details Status", type: "select", section: "ESI", options: STATUS },
  { key: "lastVerifiedDate", label: "Last Verified Date", type: "date", section: "ESI" },
  { key: "remarks", label: "Remarks", type: "textarea", section: "ESI", wide: true },
];

export type EmployeeData = Record<string, string>;

export interface Employee extends EmployeeData {
  _id: string;
  _createdAt: string;
}

export const emptyData = (): EmployeeData =>
  Object.fromEntries(FIELDS.map((f) => [f.key, ""]));
