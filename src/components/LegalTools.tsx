import React, { useState } from 'react';
import { FileText, Eye, Download, Edit, Trash2, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const documentTemplates = [
  { name: 'Power of Attorney', description: 'Authorize someone to act on your behalf.', url: '/templates/power_of_attorney.pdf', type: 'PDF', size: '120 KB' },
  { name: 'Rental Agreement', description: 'Standard rental contract template.', url: '/templates/rental_agreement.pdf', type: 'PDF', size: '98 KB' },
  { name: 'Complaint Letter', description: 'Template for filing a complaint.', url: '/templates/complaint_letter.pdf', type: 'DOCX', size: '45 KB' },
];

const initialCases = [
  { id: 1, title: 'Workplace Harassment', status: 'Open', notes: 'Submitted on 2024-06-01', progress: 33 },
];

const glossary = [
  { term: 'Affidavit', definition: 'A written statement confirmed by oath for use as evidence in court.' },
  { term: 'Plaintiff', definition: 'A person who brings a case against another in a court of law.' },
  { term: 'Defendant', definition: 'An individual, company, or institution sued or accused in a court of law.' },
  { term: 'Jurisdiction', definition: 'The official power to make legal decisions and judgments.' },
  { term: 'Testimony', definition: 'A formal written or spoken statement, especially one given in a court of law.' },
  { term: 'Verdict', definition: 'A decision on a disputed issue in a civil or criminal case.' },
];

const statusColors = {
  Open: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Closed: 'bg-green-100 text-green-800',
};

const statusIcons = {
  Open: <Clock className="inline mr-1 text-yellow-500" size={16} />,
  'In Progress': <BookOpen className="inline mr-1 text-blue-500" size={16} />,
  Closed: <CheckCircle className="inline mr-1 text-green-500" size={16} />,
};

const LegalTools = () => {
  const [tab, setTab] = useState('templates');
  const [cases, setCases] = useState(initialCases);
  const [newCase, setNewCase] = useState({ title: '', status: 'Open', notes: '', progress: 0 });
  const [editCase, setEditCase] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [expandedTerms, setExpandedTerms] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Tab animation
  const tabList = [
    { key: 'templates', label: 'Document Templates', icon: <FileText size={18} /> },
    { key: 'cases', label: 'Case Tracker', icon: <BookOpen size={18} /> },
    { key: 'glossary', label: 'Legal Glossary', icon: <BookOpen size={18} /> },
  ];

  // Case actions
  const handleAddCase = (e) => {
    e.preventDefault();
    if (!newCase.title) return;
    setCases([...cases, { ...newCase, id: Date.now(), progress: newCase.status === 'Closed' ? 100 : newCase.status === 'In Progress' ? 66 : 33 }]);
    setNewCase({ title: '', status: 'Open', notes: '', progress: 0 });
  };
  const handleEditCase = (c) => setEditCase(c);
  const handleUpdateCase = (e) => {
    e.preventDefault();
    setCases(cases.map(c => c.id === editCase.id ? { ...editCase, progress: editCase.status === 'Closed' ? 100 : editCase.status === 'In Progress' ? 66 : 33 } : c));
    setEditCase(null);
  };
  const handleDeleteCase = (id) => {
    setCases(cases.filter(c => c.id !== id));
    setShowDelete(null);
  };

  // Glossary helpers
  const filteredGlossary = glossary.filter(g => g.term.toLowerCase().includes(glossarySearch.toLowerCase()));
  const groupedGlossary = filteredGlossary.reduce((acc, g) => {
    const letter = g.term[0].toUpperCase();
    acc[letter] = acc[letter] || [];
    acc[letter].push(g);
    return acc;
  }, {});
  const highlight = (text, search) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => part.toLowerCase() === search.toLowerCase() ? <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Legal Tools</h1>
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 rounded-full shadow p-1 transition-all">
          {tabList.map(t => (
            <button
              key={t.key}
              className={`flex items-center px-6 py-2 rounded-full transition-all duration-200 font-semibold text-lg ${tab === t.key ? 'bg-sgc-purple text-white shadow' : 'text-sgc-neutral hover:bg-sgc-purple/10'}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              <span className="ml-2">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Document Templates */}
      {tab === 'templates' && (
        <div className="grid md:grid-cols-2 gap-8">
          {documentTemplates.map(doc => (
            <div key={doc.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition-all relative">
              <div className="flex items-center gap-3">
                <FileText className="text-sgc-purple" size={32} />
                <div>
                  <div className="font-bold text-lg">{doc.name}</div>
                  <div className="text-sgc-neutral text-sm">{doc.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.type}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.size}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-1 px-3 py-2 rounded bg-sgc-purple text-white hover:bg-sgc-purple-dark transition" onClick={() => setPreviewDoc(doc)}><Eye size={16} /> Preview</button>
                <a href={doc.url} download className="flex items-center gap-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"><Download size={16} /> Download</a>
              </div>
            </div>
          ))}
          {/* Preview Modal */}
          {previewDoc && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-sgc-purple" onClick={() => setPreviewDoc(null)}><XCircle size={28} /></button>
                <h2 className="font-bold text-xl mb-4">{previewDoc.name}</h2>
                <iframe src={previewDoc.url} title="Preview" className="w-full h-64 border rounded mb-4" />
                <a href={previewDoc.url} download className="bg-sgc-purple text-white px-4 py-2 rounded">Download</a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Case Tracker */}
      {tab === 'cases' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Case Tracker</h2>
          <form onSubmit={editCase ? handleUpdateCase : handleAddCase} className="flex flex-col md:flex-row gap-4 mb-8">
            <input type="text" placeholder="Case Title" value={editCase ? editCase.title : newCase.title} onChange={e => editCase ? setEditCase({ ...editCase, title: e.target.value }) : setNewCase({ ...newCase, title: e.target.value })} className="border p-2 rounded w-full" />
            <select value={editCase ? editCase.status : newCase.status} onChange={e => editCase ? setEditCase({ ...editCase, status: e.target.value }) : setNewCase({ ...newCase, status: e.target.value })} className="border p-2 rounded">
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <input type="text" placeholder="Notes (optional)" value={editCase ? editCase.notes : newCase.notes} onChange={e => editCase ? setEditCase({ ...editCase, notes: e.target.value }) : setNewCase({ ...newCase, notes: e.target.value })} className="border p-2 rounded w-full" />
            <button type="submit" className="bg-sgc-purple text-white px-4 py-2 rounded w-full md:w-auto">{editCase ? 'Update' : 'Add Case'}</button>
            {editCase && <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full md:w-auto" onClick={() => setEditCase(null)}>Cancel</button>}
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sgc-neutral uppercase text-xs">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Progress</th>
                  <th className="py-2 px-3">Notes</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 px-3 font-medium">{c.title}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[c.status]}`}>{statusIcons[c.status]}{c.status}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${c.status === 'Closed' ? 'bg-green-400' : c.status === 'In Progress' ? 'bg-blue-400' : 'bg-yellow-400'}`} style={{ width: `${c.progress || 33}%` }}></div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">{c.notes}</td>
                    <td className="py-2 px-3 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Edit" onClick={() => handleEditCase(c)}><Edit size={18} /></button>
                      <button className="text-red-500 hover:text-red-700" title="Delete" onClick={() => setShowDelete(c.id)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Delete Modal */}
          {showDelete && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-sgc-purple" onClick={() => setShowDelete(null)}><XCircle size={28} /></button>
                <h2 className="font-bold text-xl mb-4">Delete Case?</h2>
                <p className="mb-6">Are you sure you want to delete this case? This action cannot be undone.</p>
                <div className="flex gap-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteCase(showDelete)}>Delete</button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => setShowDelete(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal Glossary */}
      {tab === 'glossary' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Legal Glossary</h2>
          <input type="text" placeholder="Search terms..." value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)} className="border p-2 rounded w-full mb-6" />
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(groupedGlossary).sort().map(letter => (
              <a key={letter} href={`#glossary-${letter}`} className="text-sgc-purple font-bold px-2 py-1 hover:underline rounded cursor-pointer">{letter}</a>
            ))}
          </div>
          <div>
            {Object.keys(groupedGlossary).sort().map(letter => (
              <div key={letter} id={`glossary-${letter}`} className="mb-4">
                <div className="text-lg font-bold text-sgc-purple mb-2">{letter}</div>
                <ul className="space-y-2">
                  {groupedGlossary[letter].map(g => (
                    <li key={g.term} className="p-3 bg-gray-50 rounded shadow flex items-center">
                      <BookOpen className="text-sgc-purple mr-2" size={20} />
                      <div className="flex-1">
                        <button className="flex items-center w-full text-left font-bold text-sgc-neutral-dark" onClick={() => setExpandedTerms(expandedTerms.includes(g.term) ? expandedTerms.filter(t => t !== g.term) : [...expandedTerms, g.term])}>
                          {highlight(g.term, glossarySearch)}
                          {expandedTerms.includes(g.term) ? <ChevronUp className="ml-2" size={18} /> : <ChevronDown className="ml-2" size={18} />}
                        </button>
                        {expandedTerms.includes(g.term) && (
                          <div className="mt-2 text-sgc-neutral text-sm animate-fade-in-up">{highlight(g.definition, glossarySearch)}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <div className="text-sgc-neutral">No terms found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalTools; 