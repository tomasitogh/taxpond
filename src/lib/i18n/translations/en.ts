const en = {
  nav: {
    products: 'Products',
    company: 'Company',
    productsList: {
      taxProcessor: 'Tax reports processor',
      taxValidator: 'Tax IDs validator',
      aiConciliation: 'AI Conciliation',
      smartAudits: 'Smart Audits',
      taxCalendar: 'Tax Calendar',
    },
    badges: {
      tryFree: 'Try for free!',
      aiPowered: 'AI Powered',
      dontMiss: "Don't miss more revenue!",
      notAvailable: 'Not available',
    },
  },
  home: {
    badge: 'Now available in 12 countries',
    hero: {
      title: 'Stay compliant.',
      subtitle: 'Your data is yours.',
      description:
        'DuckDB runs on the client side — your side. Upload your financial data, get instant tax reports, and stay compliant without the complexity. Built for businesses that move fast.',
    },
    features: {
      label: 'Features',
      title: 'Everything you need to stay compliant',
      description:
        'From automated categorization to real-time reporting, Taxpond handles the heavy lifting so you can focus on growing your business.',
      items: [
        {
          title: 'Smart Upload',
          desc: 'Drag and drop CSV or Excel files. Our parser handles any format automatically.',
        },
        {
          title: 'Tax Calendar',
          desc: 'Track your tax obligations as they evolve throughout the fiscal year.',
        },
        {
          title: 'Multi-country Support',
          desc: 'Tax regulations across many countries, always up to date with the latest changes.',
        },
        {
          title: 'Tax IDs Validator',
          desc: 'Check format and validate business tax identifiers like VAT, GST, and CUIT numbers.',
        },
      ],
    },
    cta: {
      title: 'Ready to simplify your taxes?',
      description: 'Your data is yours, stay compliant with Taxpond. No credit card required.',
      button: 'Start for free',
    },
  },
  company: {
    label: 'About us',
    title: 'We believe tax reporting should be effortless.',
    story:
      "Taxpond was founded in 2026 by an engineer who had the chance to work alongside accountants. He saw that his fellow professionals were tired of struggling with outdated tax tools. He set out to build something different: a platform that combines deep regulatory knowledge with modern software design. The biggest problem he identified was that if a company wanted to use a service that shared business data, they had to navigate countless regulations and audits before they could even use those tools. With Taxpond, that's different.",
    mission: {
      title: 'Our Mission',
      description:
        'We exist to remove the friction from tax compliance. Every business, regardless of size or geography, deserves access to accurate, real-time tax insights. We build tools that turn complex regulations into clear, actionable data.',
    },
    values: {
      title: 'Our Values',
      items: [
        {
          title: 'Accuracy above all',
          desc: 'Tax data is unforgiving. We invest heavily in validation, testing, and edge-case handling to ensure every number is correct.',
        },
        {
          title: 'Radical transparency',
          desc: 'We show our work. Every calculation, every source, every audit trail is visible to our users. No black boxes. Building in public.',
        },
        {
          title: 'Builder mindset',
          desc: 'We ship fast, iterate often, and listen to our users. The best product wins, not the best pitch deck.',
        },
      ],
    },
    team: {
      title: 'The Team',
      description:
        'We are a remote-first team of 1 person in Buenos Aires. Our backgrounds span Big Four accounting firms and e-commerce developments.',
      members: [{ name: 'Tomás González Humphreys', role: 'CEO & Founder' }],
    },
    contact: {
      title: 'Get in touch',
      description: 'Have a question, partnership inquiry, or just want to say hello? Reach us at',
    },
  },
  taxProcessor: {
    product: 'Product',
    title: 'Tax Reports Processor',
    description:
      'Upload your financial data and instantly generate compliant tax reports. Supports CSV files — more formats coming soon.',
    howItWorks: 'How it works',
    threeSteps: 'Three steps to your tax report',
    steps: {
      upload: 'Upload',
      uploadFile: 'Upload file',
      dragDrop: 'Drag & drop or click',
      step1: 'Step 1 — Upload',
      configure: 'Configure',
      step2: 'Step 2 — Configure',
      visualize: 'Visualize',
      step3: 'Step 3 — Visualize',
      configHelp: 'Group by Category (String) and sum the total Amount (Number)',
    },
    recentReports: {
      title: 'Recent reports',
      description: 'Your latest generated tax reports',
      status: 'Completed',
    },
    supportedFormats: {
      title: 'Supported formats',
      description: 'We accept the most common financial data formats',
      comingSoon: '* Coming soon...',
    },
    tryNow: {
      title: 'Try now,',
      free: 'free',
      description: "Upload any data, see how it works. You'll like it.",
      button: 'Try now!',
      aboutUs: 'About us',
    },
    tryPage: {
      title: 'Start uploading your report.',
      subtitle: 'Remember, this data IS NOT being shared with anyone, this runs in your computer.',
      loadingEngine: 'Loading engine…',
      readingFile: 'Reading file…',
      onlyCsv: 'Only CSV files are supported for now.',
      fileTooLarge: 'File is too large. Maximum size is {size} MB.',
      failedLoad: 'Failed to load file',
      applyQuery: 'Apply query',
      exportCsv: 'Export CSV',
      rowsLoaded: 'rows loaded',
      columnTypes: {
        string: 'String',
        date: 'Date',
        number: 'Number',
      },
      filterBy: 'Filter by',
      all: 'All',
      groupBy: 'Group by',
      noRows: 'No rows match the current query.',
      rows: 'Rows',
      rowsCount: '{count} rows',
      showingRows: 'Showing {from}-{to} of {total} rows',
      pageOf: 'Page {page} of {pageCount}',
    },
  },
  taxIdValidator: {
    product: 'Product',
    title: 'Tax ID Validator',
    description:
      'Validate individual tax IDs or upload a CSV file for bulk validation. Supports CUIT (Argentina) and RUT (Chile).',
    loading: 'Loading validator...',
    label: 'Country / Tax ID Type',
    tabs: {
      single: 'Validate Code',
      file: 'Validate File',
    },
    single: {
      enter: 'Enter {label}',
      valid: 'Valid check digit',
      invalid: 'Invalid check digit',
      example: 'Example:',
    },
    file: {
      uploadFile: 'Upload file',
      chooseFile: 'Choose CSV file',
      rows: 'rows',
      selectColumn: 'Select column with {label}',
      chooseColumn: 'Choose a column...',
      validating: 'Validating...',
      validateBtn: 'Validate {label}',
      failedLoad: 'Failed to load file',
      validationFailed: 'Validation failed',
    },
    results: {
      totalRows: 'Total rows',
      valid: 'Valid',
      invalid: 'Invalid',
      errors: 'Errors ({count})',
      all: 'All ({count})',
      exportCsv: 'Export CSV',
      status: 'Status',
      showingRows: 'Showing 100 of {count} rows',
    },
  },
}

export default en
