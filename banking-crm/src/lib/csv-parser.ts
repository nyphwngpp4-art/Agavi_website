// Column name mapping for common export formats (RelPro, LinkedIn, etc.)
const COLUMN_MAPPINGS: Record<string, string> = {
  // Company name
  'company name': 'companyName',
  'company': 'companyName',
  'organization': 'companyName',
  'organization name': 'companyName',
  'business name': 'companyName',
  'name': 'companyName',

  // Revenue
  'annual revenue': 'revenue',
  'revenue': 'revenue',
  'annual sales': 'revenue',
  'sales volume': 'revenue',

  // Location
  'city': 'city',
  'state': 'state',
  'hq city': 'city',
  'hq state': 'state',
  'headquarters city': 'city',
  'headquarters state': 'state',
  'address': 'hqAddress',
  'hq address': 'hqAddress',
  'street': 'hqAddress',

  // Industry
  'industry': 'industry',
  'sector': 'sector',
  'sic description': 'industry',
  'naics description': 'industry',

  // Website
  'website': 'website',
  'web': 'website',
  'url': 'website',
  'company url': 'website',

  // LinkedIn
  'linkedin': 'linkedinUrl',
  'linkedin url': 'linkedinUrl',
  'company linkedin': 'linkedinUrl',

  // Ownership
  'ownership': 'ownershipType',
  'ownership type': 'ownershipType',
  'type': 'ownershipType',

  // CEO
  'ceo': 'ceoName',
  'ceo name': 'ceoName',
  'chief executive officer': 'ceoName',

  // CFO
  'cfo': 'cfoName',
  'cfo name': 'cfoName',
  'chief financial officer': 'cfoName',

  // Owner
  'owner': 'ownerName',
  'owner name': 'ownerName',
  'principal': 'ownerName',

  // Contact info (generic)
  'email': 'cfoEmail',
  'phone': 'cfoPhone',
  'phone number': 'cfoPhone',

  // Banking
  'current bank': 'currentBank',
  'primary bank': 'currentBank',
  'bank': 'currentBank',
}

export function autoMapColumns(csvHeaders: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}

  for (const header of csvHeaders) {
    const normalized = header.toLowerCase().trim()
    if (COLUMN_MAPPINGS[normalized]) {
      mapping[header] = COLUMN_MAPPINGS[normalized]
    }
  }

  return mapping
}

export const PROSPECT_FIELDS = [
  { value: '', label: 'Skip' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'hqAddress', label: 'HQ Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'industry', label: 'Industry' },
  { value: 'sector', label: 'Sector' },
  { value: 'website', label: 'Website' },
  { value: 'linkedinUrl', label: 'Company LinkedIn' },
  { value: 'ownershipType', label: 'Ownership Type' },
  { value: 'ownerName', label: 'Owner Name' },
  { value: 'ownerEmail', label: 'Owner Email' },
  { value: 'ownerPhone', label: 'Owner Phone' },
  { value: 'ceoName', label: 'CEO Name' },
  { value: 'ceoEmail', label: 'CEO Email' },
  { value: 'ceoPhone', label: 'CEO Phone' },
  { value: 'cfoName', label: 'CFO Name' },
  { value: 'cfoEmail', label: 'CFO Email' },
  { value: 'cfoPhone', label: 'CFO Phone' },
  { value: 'controllerName', label: 'Controller Name' },
  { value: 'controllerEmail', label: 'Controller Email' },
  { value: 'controllerPhone', label: 'Controller Phone' },
  { value: 'currentBank', label: 'Current Bank' },
  { value: 'loanEstimate', label: 'Loan Estimate' },
  { value: 'treasuryServices', label: 'Treasury Services' },
  { value: 'notes', label: 'Notes' },
]
