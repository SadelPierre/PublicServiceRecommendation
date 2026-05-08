import { DROPDOWN_OPTIONS } from './FormState.js';

function Select({ id, value, options, onChange, className = '' }) {
  return (
    <select
      id={id}
      className={`form-select ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Input({ id, value, onChange, placeholder = '', className = '', type = 'text' }) {
  return (
    <input
      id={id}
      type={type}
      className={`form-input ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({ id, value, onChange, rows = 3, className = '' }) {
  return (
    <textarea
      id={id}
      className={`form-textarea ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
    />
  );
}

function CheckboxLabel({ checked, onChange, label }) {
  return (
    <label className="checkbox-label">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function SectionHeader({ children, colSpan = 4 }) {
  return (
    <tr>
      <th className="section-header" colSpan={colSpan}>{children}</th>
    </tr>
  );
}

export default function GovernmentForm({ formData, onChange, validationErrors, printRef }) {
  const err = (id) => validationErrors.some(e => e.fieldId === id) ? 'field-error' : '';
  const set = (field) => (val) => onChange(field, val);

  /* ── Employment History helpers ── */
  function addEmpRow() {
    onChange('employmentHistory', [
      ...formData.employmentHistory,
      { id: formData.employmentNextId, type: 'Select One', date: '', post: '', ministry: '' },
    ]);
    onChange('employmentNextId', formData.employmentNextId + 1);
  }
  function removeEmpRow(id) {
    if (formData.employmentHistory.length === 1) return;
    onChange('employmentHistory', formData.employmentHistory.filter(r => r.id !== id));
  }
  function setEmpRow(id, field, val) {
    onChange('employmentHistory', formData.employmentHistory.map(r =>
      r.id === id ? { ...r, [field]: val } : r
    ));
  }

  /* ── Certification helpers ── */
  function addCertRow() {
    onChange('certifications', [
      ...formData.certifications,
      { id: formData.certNextId, type: 'Select One', description: '', institution: '', year: '' },
    ]);
    onChange('certNextId', formData.certNextId + 1);
  }
  function removeCertRow(id) {
    if (formData.certifications.length === 1) return;
    onChange('certifications', formData.certifications.filter(r => r.id !== id));
  }
  function setCertRow(id, field, val) {
    onChange('certifications', formData.certifications.map(r =>
      r.id === id ? { ...r, [field]: val } : r
    ));
  }

  return (
    <div ref={printRef} className="document-wrapper">

      {/* ── HEADER ── */}
      <div className="form-header">
        <img src="/logo.png" alt="Government of Saint Lucia crest" />
        <div className="form-header-text">
          <div className="gov-title">Government of Saint Lucia</div>
          <select
            className="header-select gov-ministry"
            value={formData.ministryName}
            onChange={e => set('ministryName')(e.target.value)}
          >
            {DROPDOWN_OPTIONS.ministryName.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select
            className="header-select gov-dept"
            value={formData.agencyName}
            onChange={e => set('agencyName')(e.target.value)}
          >
            {DROPDOWN_OPTIONS.agencyName.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="form-title-bar">
        <select
          style={{ background: 'transparent', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13pt', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'center', width: '100%', appearance: 'none', WebkitAppearance: 'none' }}
          value={formData.formType}
          onChange={e => set('formType')(e.target.value)}
        >
          {DROPDOWN_OPTIONS.formType.map(o => <option key={o} value={o} style={{ background: '#44546a' }}>{o}</option>)}
        </select>
      </div>

      <table className="form-table">

        {/* ── SECTION: Date & Subject ── */}
        <tbody>
          <tr>
            <td className="label-cell" style={{ width: '25%' }}>Date</td>
            <td colSpan={3}>
              <Input id="date" type="date" value={formData.date} onChange={set('date')} className={err('date')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Subject</td>
            <td colSpan={3}>
              <Input id="subject" value={formData.subject} onChange={set('subject')} className={err('subject')} />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Officer Information ── */}
        <tbody>
          <SectionHeader>Officer Information</SectionHeader>
          <tr>
            <td className="label-cell">Name of Officer</td>
            <td colSpan={3}>
              <Input id="officerName" value={formData.officerName} onChange={set('officerName')} className={err('officerName')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">
              <Select
                value={formData.orgType}
                options={DROPDOWN_OPTIONS.orgType}
                onChange={set('orgType')}
              />
            </td>
            <td>
              <Input value={formData.orgName} onChange={set('orgName')} placeholder="Name…" />
            </td>
            <td className="label-cell">
              <Select
                value={formData.subType}
                options={DROPDOWN_OPTIONS.subType}
                onChange={set('subType')}
              />
            </td>
            <td>
              <Input value={formData.subName} onChange={set('subName')} placeholder="Name…" />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Current Position</td>
            <td>
              <Input id="currentPosition" value={formData.currentPosition} onChange={set('currentPosition')} className={err('currentPosition')} />
            </td>
            <td className="label-cell">Grade</td>
            <td>
              <Select id="grade" value={formData.grade} options={DROPDOWN_OPTIONS.grade} onChange={set('grade')} className={err('grade')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell" colSpan={2}>Pensionable Status</td>
            <td colSpan={2}>
              <div className="checkbox-group">
                <CheckboxLabel checked={formData.pensionable} onChange={set('pensionable')} label="Pensionable" />
                <CheckboxLabel checked={formData.nonPensionable} onChange={set('nonPensionable')} label="Non-Pensionable" />
              </div>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Service Dates ── */}
        <tbody>
          <SectionHeader>Service Dates</SectionHeader>
          <tr>
            <td className="label-cell">Date of Entry to the Service</td>
            <td>
              <Input type="date" value={formData.dateOfEntry} onChange={set('dateOfEntry')} />
            </td>
            <td className="label-cell">Date Appointed to Grade</td>
            <td>
              <Input type="date" value={formData.dateAppointedToGrade} onChange={set('dateAppointedToGrade')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Date Appointed to Present Post</td>
            <td colSpan={3}>
              <Input type="date" value={formData.dateAppointedToPost} onChange={set('dateAppointedToPost')} />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Employment History ── */}
        <tbody>
          <SectionHeader>Employment History</SectionHeader>
          <tr>
            <td colSpan={4} style={{ padding: '6px 8px' }}>
              <table className="dynamic-table">
                <thead>
                  <tr>
                    <th style={{ width: '26%' }}>Type of Appointment</th>
                    <th style={{ width: '18%' }}>Date of Appointment</th>
                    <th style={{ width: '28%' }}>Post</th>
                    <th style={{ width: '24%' }}>Ministry / Department</th>
                    <th style={{ width: '4%' }} className="no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.employmentHistory.map(row => (
                    <tr key={row.id}>
                      <td>
                        <Select value={row.type} options={DROPDOWN_OPTIONS.employmentType} onChange={v => setEmpRow(row.id, 'type', v)} />
                      </td>
                      <td>
                        <Input type="date" value={row.date} onChange={v => setEmpRow(row.id, 'date', v)} />
                      </td>
                      <td>
                        <Input value={row.post} onChange={v => setEmpRow(row.id, 'post', v)} />
                      </td>
                      <td>
                        <Input value={row.ministry} onChange={v => setEmpRow(row.id, 'ministry', v)} />
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button className="btn-row remove" onClick={() => removeEmpRow(row.id)} title="Remove row">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dynamic-table-actions">
                <button className="btn-row" onClick={addEmpRow}>+ Add Row</button>
              </div>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Recommended For ── */}
        <tbody>
          <SectionHeader>Recommendation</SectionHeader>
          <tr>
            <td className="label-cell">Recommended For</td>
            <td colSpan={3}>
              <Select
                id="recommendedFor"
                value={formData.recommendedFor}
                options={DROPDOWN_OPTIONS.recommendedFor}
                onChange={set('recommendedFor')}
                className={err('recommendedFor')}
              />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Recommended Position ── */}
        <tbody>
          <SectionHeader>Recommended Position</SectionHeader>
          <tr>
            <td className="label-cell">Position</td>
            <td>
              <Input value={formData.recPosition} onChange={set('recPosition')} />
            </td>
            <td className="label-cell">Grade</td>
            <td>
              <Select value={formData.recGrade} options={DROPDOWN_OPTIONS.grade} onChange={set('recGrade')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell" colSpan={2}>Pensionable Status</td>
            <td colSpan={2}>
              <div className="checkbox-group">
                <CheckboxLabel checked={formData.recPensionable} onChange={set('recPensionable')} label="Pensionable" />
                <CheckboxLabel checked={formData.recNonPensionable} onChange={set('recNonPensionable')} label="Non-Pensionable" />
              </div>
            </td>
          </tr>
          <tr>
            <td className="label-cell">Department</td>
            <td>
              <Input value={formData.recDepartment} onChange={set('recDepartment')} placeholder="Department name…" />
            </td>
            <td className="label-cell">Unit</td>
            <td>
              <Input value={formData.recUnit} onChange={set('recUnit')} placeholder="Unit name…" />
            </td>
          </tr>
          <tr>
            <td className="label-cell">
              <Select value={formData.replacementType} options={DROPDOWN_OPTIONS.replacementType} onChange={set('replacementType')} />
            </td>
            <td>
              <Input value={formData.replacementText} onChange={set('replacementText')} placeholder="Name / details…" />
            </td>
            <td className="label-cell">With Effect From / To</td>
            <td>
              <Input value={formData.effectFrom} onChange={set('effectFrom')} placeholder="e.g. 01/01/2025 – 31/12/2025" />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Certification ── */}
        <tbody>
          <SectionHeader>Certification</SectionHeader>
          <tr>
            <td colSpan={4} style={{ padding: '6px 8px' }}>
              <table className="dynamic-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>Type of Qualifications</th>
                    <th style={{ width: '34%' }}>Description</th>
                    <th style={{ width: '30%' }}>Institution</th>
                    <th style={{ width: '12%' }}>Year</th>
                    <th style={{ width: '4%' }} className="no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.certifications.map(row => (
                    <tr key={row.id}>
                      <td>
                        <Select value={row.type} options={DROPDOWN_OPTIONS.qualificationType} onChange={v => setCertRow(row.id, 'type', v)} />
                      </td>
                      <td>
                        <Input value={row.description} onChange={v => setCertRow(row.id, 'description', v)} />
                      </td>
                      <td>
                        <Input value={row.institution} onChange={v => setCertRow(row.id, 'institution', v)} />
                      </td>
                      <td>
                        <Input value={row.year} onChange={v => setCertRow(row.id, 'year', v)} placeholder="e.g. 2020" />
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button className="btn-row remove" onClick={() => removeCertRow(row.id)} title="Remove row">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dynamic-table-actions">
                <button className="btn-row" onClick={addCertRow}>+ Add Row</button>
              </div>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Job Experience & Training ── */}
        <tbody>
          <SectionHeader>Experience &amp; Training</SectionHeader>
          <tr>
            <td className="label-cell-top">Job Relevant Experience</td>
            <td colSpan={3}>
              <Textarea value={formData.jobRelevantExperience} onChange={set('jobRelevantExperience')} rows={3} />
            </td>
          </tr>
          <tr>
            <td className="label-cell-top">Training</td>
            <td colSpan={3}>
              <Textarea value={formData.training} onChange={set('training')} rows={3} />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Benchmark Qualifications ── */}
        <tbody>
          <SectionHeader>Benchmark Qualifications</SectionHeader>
          <tr>
            <td colSpan={4} style={{ padding: '8px' }}>
              <div className="sentence-builder">
                <Select
                  value={formData.benchmarkOpener}
                  options={DROPDOWN_OPTIONS.benchmarkOpener}
                  onChange={set('benchmarkOpener')}
                />
                <Select
                  value={formData.benchmarkVerb}
                  options={DROPDOWN_OPTIONS.benchmarkVerb}
                  onChange={set('benchmarkVerb')}
                />
                <Select
                  value={formData.benchmarkGrade1}
                  options={DROPDOWN_OPTIONS.gradeLabel}
                  onChange={set('benchmarkGrade1')}
                />
                <Select
                  value={formData.benchmarkConnector}
                  options={DROPDOWN_OPTIONS.benchmarkConnector}
                  onChange={set('benchmarkConnector')}
                />
                <Select
                  value={formData.benchmarkGrade2}
                  options={DROPDOWN_OPTIONS.gradeLabel}
                  onChange={set('benchmarkGrade2')}
                />
              </div>
              <div style={{ marginTop: '6px' }}>
                <Textarea
                  value={formData.benchmarkText}
                  onChange={set('benchmarkText')}
                  rows={4}
                />
              </div>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Justification ── */}
        <tbody>
          <SectionHeader>Justification</SectionHeader>
          <tr>
            <td colSpan={4} style={{ padding: '8px' }}>
              <Textarea value={formData.justification} onChange={set('justification')} rows={10} />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Performance Assessment ── */}
        <tbody>
          <SectionHeader>Performance Assessment</SectionHeader>
          <tr>
            <td className="label-cell">Performance Assessment Period</td>
            <td>
              <Input value={formData.performancePeriod} onChange={set('performancePeriod')} placeholder="e.g. Jan 2024 – Dec 2024" />
            </td>
            <td className="label-cell">Performance Assessment Rating</td>
            <td>
              <Select value={formData.performanceRating} options={DROPDOWN_OPTIONS.performanceRating} onChange={set('performanceRating')} />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Position Funded / Funding Available ── */}
        <tbody>
          <SectionHeader>Position Funded / Funding Available</SectionHeader>
          <tr>
            <td colSpan={4} style={{ padding: '6px 8px' }}>
              <span>Funding is available in the Estimates of Revenue and Expenditure&nbsp;</span>
              <Select
                value={formData.fundingInEstimates}
                options={DROPDOWN_OPTIONS.fundingAvailable}
                onChange={set('fundingInEstimates')}
              />
              <span>&nbsp;, under the&nbsp;</span>
              <Input
                value={formData.fundingUnder}
                onChange={set('fundingUnder')}
                placeholder="Programme / Sub-programme"
                style={{ display: 'inline-block', width: 'auto', minWidth: '220px', borderBottom: '1px solid #888' }}
              />
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Signature ── */}
        <tbody>
          <SectionHeader>Submitted By</SectionHeader>
          <tr>
            <td className="label-cell">Name of Head of Department</td>
            <td>
              <Input value={formData.headOfDepartment} onChange={set('headOfDepartment')} />
            </td>
            <td className="label-cell">Post</td>
            <td>
              <Select value={formData.post} options={DROPDOWN_OPTIONS.post} onChange={set('post')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Initials of Author</td>
            <td>
              <Input value={formData.initialsOfAuthor} onChange={set('initialsOfAuthor')} />
            </td>
            <td className="label-cell">Attachment</td>
            <td>
              <Input value={formData.attachment} onChange={set('attachment')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Signature</td>
            <td colSpan={3} style={{ height: '48px', verticalAlign: 'bottom', paddingBottom: '4px' }}>
              <span className="sig-line" style={{ width: '280px' }}>&nbsp;</span>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Official Use – DPS ── */}
        <tbody>
          <tr>
            <th className="official-use-header" colSpan={4}>
              Official Use — Department of the Public Service
            </th>
          </tr>
          <tr>
            <td className="label-cell">1st Candidate</td>
            <td>
              <Input value={formData.dpsCandidate1Name} onChange={set('dpsCandidate1Name')} placeholder="Name" />
            </td>
            <td className="label-cell">Rank</td>
            <td>
              <Select value={formData.dpsCandidate1Rank} options={DROPDOWN_OPTIONS.candidates} onChange={set('dpsCandidate1Rank')} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">2nd Candidate Rank</td>
            <td>
              <Select value={formData.dpsCandidate2Rank} options={DROPDOWN_OPTIONS.candidates} onChange={set('dpsCandidate2Rank')} />
            </td>
            <td className="label-cell">Comments</td>
            <td>
              <Input value={formData.dpsCandidate2Comments} onChange={set('dpsCandidate2Comments')} />
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="checkbox-group" style={{ padding: '4px 0' }}>
                <CheckboxLabel checked={formData.dpsReviewed} onChange={set('dpsReviewed')} label="Reviewed" />
                <CheckboxLabel checked={formData.dpsApproved} onChange={set('dpsApproved')} label="Approved" />
                <CheckboxLabel checked={formData.dpsMeetsBenchmark} onChange={set('dpsMeetsBenchmark')} label="Meets Benchmark" />
              </div>
            </td>
          </tr>
        </tbody>

        {/* ── SECTION: Official Use – PSC ── */}
        <tbody>
          <tr>
            <th className="official-use-header" colSpan={4}>
              Official Use — Public Service Commission
            </th>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="checkbox-group" style={{ padding: '4px 0' }}>
                <CheckboxLabel checked={formData.pscApproved} onChange={set('pscApproved')} label="Approved" />
                <CheckboxLabel checked={formData.pscNotApproved} onChange={set('pscNotApproved')} label="Not Approved" />
              </div>
            </td>
          </tr>
          <tr>
            <td className="label-cell-top">Comments</td>
            <td colSpan={3}>
              <Textarea value={formData.pscComments} onChange={set('pscComments')} rows={3} />
            </td>
          </tr>
          <tr>
            <td className="label-cell">Date</td>
            <td>
              <Input type="date" value={formData.pscDate} onChange={set('pscDate')} />
            </td>
            <td className="label-cell">Signature</td>
            <td style={{ height: '40px', verticalAlign: 'bottom', paddingBottom: '4px' }}>
              <span className="sig-line" style={{ width: '200px' }}>&nbsp;</span>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  );
}
