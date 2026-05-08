export const DROPDOWN_OPTIONS = {
  formType: [
    'Select One',
    'Recommendation to the Public Service Commission',
    'Request to the Department of the Public Service',
  ],
  orgType: ['Select One', 'Ministry', 'Department'],
  subType: ['Select One', 'Division', 'Unit'],
  grade: ['Select One', ...Array.from({ length: 21 }, (_, i) => String(i + 1))],
  gradeLabel: ['Select Grade', ...Array.from({ length: 21 }, (_, i) => `Grade ${i + 1}`)],
  employmentType: [
    'Select One',
    'Acting Appointment',
    'Temporary Appointment',
    'Confirmation',
    'Promotion',
    'Appointment',
    'Contract',
    'Wages',
    'Transfer',
    'Re-designation',
  ],
  recommendedFor: [
    'Select One',
    'Transfer',
    'Promotion',
    'Confirmation',
    'Appointment',
    'Acting Appointment',
    'Temporary Appointment',
    'Appointment on Contract',
    'Appointment to Redesignated Post',
    'Termination of Temporary Appointment',
    'Termination of Acting Appointment',
    'Revocation of Acting Appointment',
    'Revocation of Temporary Appointment',
  ],
  replacementType: ['Select One', 'Vice', 'In a stream', 'Vacant', 'Replacement for'],
  qualificationType: [
    'Select One',
    'BSc',
    'ASc',
    'Dip',
    'CSEC',
    'CAPE',
    'BBA',
    'MSc',
    'MBA',
    'EMBA',
    'BCom',
    'LLM',
    'PgDip',
    'PgCert',
    'Exec. Ed',
    'Cert.',
  ],
  benchmarkOpener: [
    'It is noted that the officer',
    'It should be noted that the officer',
  ],
  benchmarkVerb: [
    'Select One',
    'possesses the requisite academic certification for',
    'possesses the requisite qualifying years of experience for',
  ],
  benchmarkConnector: [
    'Select One',
    'but lacks the qualifying years of experience at the grade level',
    'as per the Benchmark Qualifications for the Public Service of Saint Lucia which states the following:',
  ],
  performanceRating: ['Select One', 'Exceptional', 'Effective', 'Average', 'Not Applicable'],
  fundingAvailable: ['Select One', 'Yes', 'No'],
  post: ['Select One', 'Permanent Secretary', 'Director', 'Comptroller'],
  candidates: ['1st Candidate', '2nd Candidate', '3rd Candidate'],
  ministryName: [
    'Select One',
    'MINISTRY OF PUBLIC SERVICE, LABOUR AND GENDER AFFAIRS',
    'MINISTRY OF FINANCE',
    'MINISTRY OF HEALTH AND WELLNESS',
    'MINISTRY OF EDUCATION',
    'MINISTRY OF AGRICULTURE',
    'MINISTRY OF INFRASTRUCTURE',
    'MINISTRY OF TOURISM',
    'MINISTRY OF JUSTICE',
    'MINISTRY OF HOME AFFAIRS AND NATIONAL SECURITY',
    'PRIME MINISTER\'S OFFICE',
  ],
  agencyName: [
    'Select One',
    'Department of the Public Service',
    'Department of Finance',
    'Department of Education',
    'Department of Health',
    'Department of Agriculture',
    'Department of Infrastructure',
  ],
};

export const INITIAL_STATE = {
  // Header
  ministryName: 'MINISTRY OF PUBLIC SERVICE, LABOUR AND GENDER AFFAIRS',
  agencyName: 'Department of the Public Service',
  formType: 'Request to the Department of the Public Service',

  // Date & Subject
  date: new Date().toISOString().split('T')[0],
  subject: '',

  // Officer Info
  officerName: '',
  orgType: 'Select One',
  orgName: '',
  subType: 'Select One',
  subName: '',
  currentPosition: '',
  grade: 'Select One',
  pensionable: false,
  nonPensionable: false,

  // Service Dates
  dateOfEntry: '',
  dateAppointedToGrade: '',
  dateAppointedToPost: '',

  // Employment History
  employmentHistory: [{ id: 1, type: 'Select One', date: '', post: '', ministry: '' }],
  employmentNextId: 2,

  // Recommended For
  recommendedFor: 'Select One',

  // Recommended Position
  recPosition: '',
  recGrade: 'Select One',
  recPensionable: false,
  recNonPensionable: false,
  recOrgType: 'Select One',
  recDepartment: '',
  recSubType: 'Select One',
  recUnit: '',
  replacementType: 'Select One',
  replacementText: '',
  effectFrom: '',
  effectTo: '',

  // Certification
  certifications: [{ id: 1, type: 'Select One', description: '', institution: '', year: '' }],
  certNextId: 2,

  // Experience & Training
  jobRelevantExperience: '',
  training: '',

  // Benchmark Qualifications
  benchmarkOpener: 'It should be noted that the officer',
  benchmarkVerb: 'Select One',
  benchmarkGrade1: 'Select Grade',
  benchmarkConnector: 'Select One',
  benchmarkGrade2: 'Select Grade',
  benchmarkText: '',

  // Justification
  justification: '',

  // Performance Assessment
  performancePeriod: '',
  performanceRating: 'Select One',

  // Funding
  fundingInEstimates: 'Select One',
  fundingUnder: '',

  // Signature
  headOfDepartment: '',
  post: 'Select One',
  initialsOfAuthor: '',
  attachment: '',

  // Official Use – DPS
  dpsCandidate1Name: '',
  dpsCandidate1Rank: '1st Candidate',
  dpsCandidate2Rank: '2nd Candidate',
  dpsCandidate2Comments: '',
  dpsReviewed: false,
  dpsApproved: false,
  dpsMeetsBenchmark: false,

  // Official Use – PSC
  pscApproved: false,
  pscNotApproved: false,
  pscComments: '',
  pscDate: '',
  pscSignature: '',
};

export function validateForm(state) {
  const errors = [];
  const required = [
    { fieldId: 'officerName', label: 'Name of Officer' },
    { fieldId: 'date', label: 'Date' },
    { fieldId: 'subject', label: 'Subject' },
    { fieldId: 'currentPosition', label: 'Current Position' },
    { fieldId: 'grade', label: 'Grade' },
    { fieldId: 'recommendedFor', label: 'Recommended For' },
  ];
  for (const { fieldId, label } of required) {
    const val = state[fieldId];
    if (!val || val === 'Select One' || val === 'Select Grade') {
      errors.push({ fieldId, label });
    }
  }
  return errors;
}

export function mapPdfTextToState(textItems) {
  const text = textItems.join('\n');
  const state = { ...INITIAL_STATE };

  function extractAfter(label) {
    const re = new RegExp(label + '[:\\s]+([^\\n]+)', 'i');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  }

  state.officerName = extractAfter('Name of Officer') || state.officerName;
  state.subject = extractAfter('Subject') || state.subject;
  state.currentPosition = extractAfter('Current Position') || state.currentPosition;
  state.dateOfEntry = extractAfter('Date of Entry to the Service') || state.dateOfEntry;
  state.dateAppointedToGrade = extractAfter('Date Appointed to Grade') || state.dateAppointedToGrade;
  state.dateAppointedToPost = extractAfter('Date Appointed to Present Post') || state.dateAppointedToPost;
  state.recPosition = extractAfter('Position') || state.recPosition;
  state.performancePeriod = extractAfter('Performance Assessment Period') || state.performancePeriod;
  state.headOfDepartment = extractAfter('Permanent Secretary|Director|Comptroller') || state.headOfDepartment;
  state.jobRelevantExperience = extractAfter('Job Relevant Experience') || state.jobRelevantExperience;
  state.training = extractAfter('Training') || state.training;
  state.fundingUnder = extractAfter('under the') || state.fundingUnder;
  state.attachment = extractAfter('Attachment') || state.attachment;

  return state;
}
