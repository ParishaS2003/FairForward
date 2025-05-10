import React, { useState, useEffect } from 'react';
import { Search, Book, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { jsPDF } from 'jspdf';
import { useToast } from '@/components/ui/use-toast';

// Legal terms data structure
interface LegalTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
  examples?: string[];
  jurisdiction?: string;
}

// Categories for legal terms
const CATEGORIES = [
  'civil-rights',
  'criminal-law',
  'family-law',
  'employment-law',
  'immigration',
  'housing-law',
  'general'
] as const;

// Initial legal terms data
const legalTerms: LegalTerm[] = [
  {
    term: 'Acquittal',
    definition: 'When a judge or jury finds that a person is not guilty of a crime.',
    category: 'criminal-law',
    examples: ['The jury returned a verdict of acquittal after finding insufficient evidence.'],
    jurisdiction: 'Criminal Courts'
  },
  {
    term: 'Adjournment',
    definition: 'Postponing or rescheduling a court case to a future date.',
    category: 'general',
    examples: ['The case was adjourned for two weeks to allow time for additional evidence.'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Affidavit',
    definition: 'A written statement made under oath.',
    category: 'general',
    examples: ['Affidavit of Service', 'Affidavit of Support'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Answer',
    definition: 'A formal written statement by a defendant responding to a civil complaint, setting forth the grounds for defense.',
    category: 'civil-rights',
    examples: ['The defendant filed an answer denying all allegations.'],
    jurisdiction: 'Civil Courts'
  },
  {
    term: 'Appeal',
    definition: 'When someone who loses at least part of a case asks a higher court to review the decision.',
    category: 'general',
    examples: ['Filing an appeal to the Supreme Court', 'Appealing a conviction'],
    relatedTerms: ['Appellant', 'Appellate Court'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Bail',
    definition: 'Money or property given to the court as security to ensure a defendant appears in court when required.',
    category: 'criminal-law',
    examples: ['The judge set bail at $5,000', 'Release on own recognizance'],
    relatedTerms: ['Bond', 'Custody'],
    jurisdiction: 'Criminal Courts'
  },
  {
    term: 'Complaint',
    definition: 'The first document filed with the court by a person starting a civil lawsuit stating what the person believes the defendant did wrong.',
    category: 'civil-rights',
    examples: ['Filing a discrimination complaint', 'Civil rights complaint'],
    jurisdiction: 'Civil Courts'
  },
  {
    term: 'Custody',
    definition: 'The legal right to make decisions about how to care for a child.',
    category: 'family-law',
    examples: ['Joint custody', 'Sole custody', 'Physical custody'],
    relatedTerms: ['Visitation', 'Guardian'],
    jurisdiction: 'Family Court'
  },
  {
    term: 'Default',
    definition: 'When a defendant does not answer a complaint or does not appear in court when they are supposed to.',
    category: 'general',
    examples: ['Default judgment', 'Default in appearance'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Due Process',
    definition: 'The right of all people to receive the guarantees and safeguards of the law.',
    category: 'civil-rights',
    examples: ['Right to a fair trial', 'Notice and opportunity to be heard'],
    relatedTerms: ['Equal Protection', 'Constitutional Rights'],
    jurisdiction: 'Constitutional Law'
  },
  {
    term: 'Eviction',
    definition: 'The legal process of removing a tenant from rental property.',
    category: 'housing-law',
    examples: ['Notice of eviction', 'Eviction proceedings'],
    relatedTerms: ['Lease', 'Tenant Rights'],
    jurisdiction: 'Housing Court'
  },
  {
    term: 'Guardian',
    definition: 'A person appointed by the court to manage the affairs of another person who cannot manage their own affairs.',
    category: 'family-law',
    examples: ['Guardian ad litem', 'Legal guardian'],
    relatedTerms: ['Ward', 'Conservator'],
    jurisdiction: 'Family Court'
  },
  {
    term: 'Hearing',
    definition: 'A proceeding before a judge or court officer where testimony is taken and/or arguments are heard.',
    category: 'general',
    examples: ['Preliminary hearing', 'Motion hearing'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Immigration Hold',
    definition: 'A request by federal immigration authorities to a local jail or law enforcement agency to hold a person.',
    category: 'immigration',
    examples: ['ICE detainer', 'Immigration detention'],
    relatedTerms: ['Deportation', 'Removal Proceedings'],
    jurisdiction: 'Immigration Court'
  },
  {
    term: 'Judgment',
    definition: 'The final decision made by a court in a case.',
    category: 'general',
    examples: ['Default judgment', 'Summary judgment'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Motion',
    definition: 'A formal request that a judge make a decision about something in a case.',
    category: 'general',
    examples: ['Motion to dismiss', 'Motion for summary judgment'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Petition',
    definition: 'A formal written request to a court asking for specific action to be taken.',
    category: 'general',
    examples: ['Petition for custody', 'Petition for name change'],
    jurisdiction: 'All Courts'
  },
  {
    term: 'Plaintiff',
    definition: 'The person who starts a civil case against another person.',
    category: 'civil-rights',
    examples: ['The plaintiff filed a discrimination lawsuit'],
    relatedTerms: ['Defendant', 'Complainant'],
    jurisdiction: 'Civil Courts'
  },
  {
    term: 'Restraining Order',
    definition: 'A court order that tells a person to stop doing something for a certain period of time.',
    category: 'family-law',
    examples: ['Order of protection', 'Temporary restraining order'],
    relatedTerms: ['Protection Order', 'Domestic Violence'],
    jurisdiction: 'Family Court'
  },
  {
    term: 'Subpoena',
    definition: 'A court order requiring a person to appear in court or provide documents.',
    category: 'general',
    examples: ['Witness subpoena', 'Subpoena duces tecum'],
    jurisdiction: 'All Courts'
  }
];

const LegalGlossary = () => {
  const { translate, currentLanguage, formatDate } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [filteredTerms, setFilteredTerms] = useState<LegalTerm[]>(legalTerms);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Generate alphabet array for navigation
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  // Filter terms based on search, category, and letter
  useEffect(() => {
    let filtered = [...legalTerms];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    // Apply letter filter
    if (selectedLetter !== 'all') {
      filtered = filtered.filter(term => term.term.startsWith(selectedLetter));
    }

    setFilteredTerms(filtered);
  }, [searchTerm, selectedCategory, selectedLetter]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: currentLanguage.direction === 'rtl' ? 'p' : 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // Set text direction
      if (currentLanguage.direction === 'rtl') {
        doc.setR2L(true);
      }

      // Add title
      doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(translate('glossary.title'), currentLanguage.direction === 'rtl' ? pageWidth - margin : margin, y);
      y += 10;

      // Add subtitle
      doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(translate('glossary.subtitle'), currentLanguage.direction === 'rtl' ? pageWidth - margin : margin, y);
      y += 20;

      // Helper function to add wrapped text
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, currentLanguage.direction === 'rtl' ? pageWidth - x : x, y);
        return y + (lines.length * 7);
      };

      // Add terms
      doc.setFontSize(12);
      const textWidth = pageWidth - (margin * 2);

      filteredTerms.forEach((term, index) => {
        // Check if we need a new page
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Term
        doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'bold');
        doc.text(term.term, currentLanguage.direction === 'rtl' ? pageWidth - margin : margin, y);
        y += 7;

        // Definition
        doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'normal');
        y = addWrappedText(term.definition, margin, y, textWidth);
        y += 5;

        // Category and Jurisdiction
        doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'italic');
        const categoryText = `${translate(`glossary.categories.${term.category.replace('-', '_')}`)} - ${term.jurisdiction}`;
        doc.text(categoryText, currentLanguage.direction === 'rtl' ? pageWidth - margin : margin, y);
        y += 7;

        // Examples
        if (term.examples && term.examples.length > 0) {
          doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'normal');
          doc.text(`${translate('glossary.examples')}`, currentLanguage.direction === 'rtl' ? pageWidth - margin : margin, y);
          y += 7;
          term.examples.forEach(example => {
            doc.text(`• ${example}`, currentLanguage.direction === 'rtl' ? pageWidth - (margin + 5) : margin + 5, y);
            y += 7;
          });
        }

        // Related Terms
        if (term.relatedTerms && term.relatedTerms.length > 0) {
          y += 3;
          doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'normal');
          const relatedText = `${translate('glossary.pdf.related_terms')}: ${term.relatedTerms.join(', ')}`;
          y = addWrappedText(relatedText, margin, y, textWidth);
        }

        y += 10; // Space between terms
      });

      // Add generation date at the bottom
      doc.setFont(currentLanguage.direction === 'rtl' ? 'Arial' : 'helvetica', 'normal');
      doc.setFontSize(10);
      const dateText = `${translate('glossary.pdf.generated_on')}: ${formatDate(new Date())}`;
      doc.text(
        dateText,
        currentLanguage.direction === 'rtl' ? pageWidth - margin : margin,
        doc.internal.pageSize.getHeight() - 10
      );

      // Save the PDF
      const fileName = `legal-glossary-${currentLanguage.code}-${formatDate(new Date()).replace(/\//g, '-')}.pdf`;
      doc.save(fileName);

      toast({
        title: translate('glossary.pdf.success_title'),
        description: translate('glossary.pdf.success_description'),
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: translate('glossary.pdf.error_title'),
        description: translate('glossary.pdf.error_description'),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="container max-w-6xl py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/30 rounded-lg p-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{translate('glossary.title')}</h1>
          <p className="text-muted-foreground max-w-2xl mb-4">
            {translate('glossary.subtitle')}
          </p>
          <div className="bg-white/50 rounded-lg p-4 mb-4 max-w-2xl">
            <p className="text-sm text-muted-foreground italic">
              "{translate('glossary.mascot.welcome')}"
            </p>
            <p className="text-sm text-sgc-purple mt-2 font-medium">
              {translate('glossary.mascot.tip')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
            >
              <Book className="w-4 h-4" />
              {isGeneratingPDF ? translate('app.loading') : translate('glossary.download_pdf')}
            </Button>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 relative">
            <img 
              src="/mr-hootsworth.png" 
              alt={translate('glossary.mascot.name')} 
              className="w-full h-full object-contain"
            />
            <div className="absolute -top-2 -right-2 bg-white dark:bg-background rounded-full p-2 shadow-md">
              <Book className="w-5 h-5 text-sgc-purple" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-0 right-0 text-center">
            <span className="bg-sgc-purple text-white text-sm px-3 py-1 rounded-full">
              {translate('glossary.mascot.name')}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className={`bg-muted/50 ${currentLanguage.direction === 'rtl' ? 'rtl' : ''}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className={`absolute ${currentLanguage.direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={translate('glossary.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={currentLanguage.direction === 'rtl' ? 'pr-10' : 'pl-10'}
                dir={currentLanguage.direction}
              />
            </div>
            <select
              className={`border rounded-md px-4 py-2 ${currentLanguage.direction === 'rtl' ? 'text-right' : 'text-left'}`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              dir={currentLanguage.direction}
            >
              <option value="all">{translate('glossary.all_categories')}</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {translate(`glossary.categories.${category.replace('-', '_')}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Alphabet Navigation */}
          <div className={`flex flex-wrap gap-1 ${currentLanguage.direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Button
              variant={selectedLetter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLetter('all')}
            >
              {translate('glossary.all_letters')}
            </Button>
            {alphabet.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{translate('glossary.no_results')}</p>
          </div>
        ) : (
          filteredTerms.map((term, index) => (
            <Card key={index} className={`hover:shadow-md transition-shadow ${currentLanguage.direction === 'rtl' ? 'rtl' : ''}`}>
              <CardContent className="p-6">
                <div className={`flex items-start ${currentLanguage.direction === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
                  <div className={currentLanguage.direction === 'rtl' ? 'text-right' : 'text-left'}>
                    <h3 className="text-xl font-semibold mb-2">{term.term}</h3>
                    <p className="text-muted-foreground mb-4">{term.definition}</p>
                    
                    {/* Examples */}
                    {term.examples && term.examples.length > 0 && (
                      <div className="mb-3">
                        <p className="font-medium mb-1">{translate('glossary.examples')}</p>
                        <ul className={`list-disc ${currentLanguage.direction === 'rtl' ? 'mr-5' : 'ml-5'} text-sm text-muted-foreground`}>
                          {term.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Terms */}
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {term.relatedTerms.map((relatedTerm, i) => (
                          <Badge key={i} variant="secondary">
                            {relatedTerm}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Category and Jurisdiction */}
                  <div className={`flex flex-col gap-2 ${currentLanguage.direction === 'rtl' ? 'items-start' : 'items-end'}`}>
                    <Badge>
                      {translate(`glossary.categories.${term.category.replace('-', '_')}`)}
                    </Badge>
                    {term.jurisdiction && (
                      <span className="text-sm text-muted-foreground">
                        {term.jurisdiction}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalGlossary; 