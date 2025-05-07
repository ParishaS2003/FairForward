interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Resource {
  name: string;
  url: string;
  forms?: string[];
}

interface CanadianResources {
  [key: string]: Resource;
}

const TOPIC_SUGGESTIONS = [
  "Canadian Workplace Rights",
  "Filing a Discrimination Complaint",
  "Equal Pay Rights in Canada",
  "Human Rights Commission Process",
  "Employment Equity in Canada",
  "Immigration and Equality Rights",
  "Provincial vs Federal Rights",
  "Legal Aid Resources"
];

const CANADIAN_RESOURCES: CanadianResources = {
  human_rights: {
    name: "Canadian Human Rights Commission",
    url: "https://www.chrc-ccdp.gc.ca/en",
    forms: ["Individual Complaint Form", "Employment Equity Report"]
  },
  employment: {
    name: "Employment and Social Development Canada",
    url: "https://www.canada.ca/en/employment-social-development.html",
    forms: ["Labour Standards Complaint Form", "Pay Equity Report"]
  },
  legal_aid: {
    name: "Provincial Legal Aid Offices",
    url: "https://www.justice.gc.ca/eng/contact/aid-aide.html",
    forms: ["Legal Aid Application"]
  },
  provincial_resources: {
    name: "Provincial Resources",
    url: "https://www.justice.gc.ca/eng/contact/aid-aide.html",
    forms: ["Provincial Human Rights Forms"]
  }
};

const systemMessage: Message = {
  role: "system",
  content: (
    "You are an expert assistant focused on Canadian rights and resources related to " +
    "gender equality (SDG-5) and reduced inequalities (SDG-10). " +
    "Your expertise includes:\n\n" +
    "1. Canadian Rights and Legislation:\n" +
    "   - Canadian Human Rights Act\n" +
    "   - Employment Equity Act\n" +
    "   - Pay Equity Act\n" +
    "   - Provincial human rights codes\n" +
    "   - Workplace harassment laws\n\n" +
    "2. Filing Complaints and Forms:\n" +
    "   - How to file discrimination complaints\n" +
    "   - Required documentation and evidence\n" +
    "   - Timeline and process expectations\n" +
    "   - Appeals procedures\n" +
    "   - Legal aid options\n\n" +
    "3. Available Resources:\n" +
    "   - Government agencies and contacts\n" +
    "   - Legal aid services\n" +
    "   - Advocacy organizations\n" +
    "   - Support services\n" +
    "   - Provincial vs federal jurisdiction\n\n" +
    "When responding to questions:\n" +
    "1. Provide specific Canadian legal references\n" +
    "2. Include relevant forms and submission processes\n" +
    "3. Link to official government resources\n" +
    "4. Explain step-by-step procedures\n" +
    "5. Maintain context from previous questions\n" +
    "6. Format responses with clear sections\n" +
    "7. Specify provincial vs federal jurisdiction\n" +
    "8. Include contact information for relevant agencies"
  )
};

export class Chatbot {
  private conversationHistory: Message[] = [systemMessage];
  private readonly maxHistory: number = 10;
  private readonly apiKey: string = process.env.OPENROUTER_API_KEY || '';

  private getRelevantResources(topic: string): Partial<CanadianResources> {
    const resources: Partial<CanadianResources> = {};
    if (topic.toLowerCase().includes('discrimination') || topic.toLowerCase().includes('rights')) {
      resources.human_rights = CANADIAN_RESOURCES.human_rights;
    }
    if (topic.toLowerCase().includes('employment') || topic.toLowerCase().includes('workplace')) {
      resources.employment = CANADIAN_RESOURCES.employment;
    }
    if (topic.toLowerCase().includes('legal') || topic.toLowerCase().includes('law')) {
      resources.legal_aid = CANADIAN_RESOURCES.legal_aid;
    }
    return resources;
  }

  private formatResources(resources: Partial<CanadianResources>): string {
    if (Object.keys(resources).length === 0) return '';

    let formatted = '\n\nRelevant Resources:\n';
    for (const [category, info] of Object.entries(resources)) {
      formatted += `\n${info.name}:\n`;
      formatted += `• Website: ${info.url}\n`;
      if (info.forms) {
        formatted += '• Available Forms:\n';
        for (const form of info.forms) {
          formatted += `  - ${form}\n`;
        }
      }
    }
    return formatted;
  }

  private formatResponse(response: string, resources?: Partial<CanadianResources>): string {
    const sections = response.split('\n\n');
    const formattedSections = sections.map(section => {
      if (section.trim().match(/^[0-9]+\./)) {
        const lines = section.split('\n');
        const formattedLines = lines.map(line => {
          if (line.trim().match(/^[-*•]/)) {
            return `• ${line.trim().slice(1).trim()}`;
          }
          return line;
        });
        return formattedLines.join('\n');
      }
      return section.trim();
    });

    let formattedResponse = formattedSections.join('\n\n');
    if (resources) {
      formattedResponse += this.formatResources(resources);
    }
    return formattedResponse;
  }

  private validateResponse(response: string): boolean {
    return response.trim().length > 0 && !response.startsWith('I apologize');
  }

  public async askBot(prompt: string): Promise<string> {
    try {
      this.conversationHistory.push({ role: 'user', content: prompt });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: this.conversationHistory
        })
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      if (!this.validateResponse(botResponse)) {
        throw new Error('Invalid response from API');
      }

      const resources = this.getRelevantResources(prompt);
      const formattedResponse = this.formatResponse(botResponse, resources);

      this.conversationHistory.push({ role: 'assistant', content: formattedResponse });

      if (this.conversationHistory.length > this.maxHistory) {
        this.conversationHistory = [systemMessage, ...this.conversationHistory.slice(-this.maxHistory)];
      }

      return formattedResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  public getTopicSuggestions(): string[] {
    return TOPIC_SUGGESTIONS;
  }
} 