export const schemas = {
  services: {
    searchFields: ['title', 'category', 'description'],

    listColumns: [
      { name: 'title', label: 'Service Title' },
      { name: 'category', label: 'Category' },
      { name: 'pricing', label: 'Pricing Budget' }
    ],

    fields: [
      {
        name: 'title',
        label: 'Service Title',
        type: 'text',
        required: true,
        placeholder: 'e.g. Luxury Brand Strategy'
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          'Creative Consulting',
          'Influencer Marketing',
          'Public Speaking',
          'Content Creation'
        ]
      },
      {
        name: 'description',
        label: 'Service Description',
        type: 'textarea',
        required: true
      },
      {
        name: 'benefits',
        label: 'Benefits',
        type: 'tags'
      },
      {
        name: 'pricing',
        label: 'Pricing Range',
        type: 'text',
        required: true
      },
      {
        name: 'cta',
        label: 'CTA Button Text',
        type: 'text',
        defaultValue: 'Book Now'
      }
    ]
  },
  events: {
  searchFields: ['title', 'eventType', 'location'],

  listColumns: [
    { name: 'title', label: 'Event Title' },
    { name: 'eventType', label: 'Event Type' },
    { name: 'eventDate', label: 'Date' },
    { name: 'location', label: 'Location' },
    { name: 'status', label: 'Status' }
  ],

  fields: [
    {
      name: 'title',
      label: 'Event Title',
      type: 'text',
      required: true
    },
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      required: true,
      filterKey: true,
      options: [
        'Event Hosting',
        'Guest Appearance',
        'Corporate Events',
        'Fashion Shows',
        'Product Events',
        'Meetups',
        'Workshops',
        'Conferences'
      ]
    },
    {
      name: 'location',
      label: 'Venue / Location',
      type: 'text'
    },
    {
      name: 'eventDate',
      label: 'Event Date',
      type: 'date'
    },
    {
      name: 'startTime',
      label: 'Start Time',
      type: 'time'
    },
    {
      name: 'endTime',
      label: 'End Time',
      type: 'time'
    },
    {
      name: 'host',
      label: 'Host / Organizer',
      type: 'text'
    },
    {
      name: 'guest',
      label: 'Guest Appearance',
      type: 'text'
    },
    {
      name: 'description',
      label: 'Event Description',
      type: 'textarea'
    },
    {
      name: 'gallery',
      label: 'Gallery Images',
      type: 'tags'
    },
    {
      name: 'videos',
      label: 'Video Links',
      type: 'tags'
    },
    {
      name: 'highlights',
      label: 'Event Highlights',
      type: 'textarea'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        'Upcoming',
        'Ongoing',
        'Completed',
        'Cancelled'
      ]
    }
  ]
},
careers: {
  searchFields: ['title', 'department', 'location', 'description', 'requirements'],
  listColumns: [
    { name: 'title', label: 'Position' },
    { name: 'department', label: 'Department' },
    { name: 'type', label: 'Type' },
    { name: 'location', label: 'Location' }
  ],
  fields: [
    {
      name: 'title',
      label: 'Job Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. Creative Video Producer & Editor'
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      filterKey: true,
      options: ['Production', 'Marketing', 'Creative Consulting', 'Operations', 'Sales']
    },
    {
      name: 'type',
      label: 'Employment Type',
      type: 'select',
      required: true,
      filterKey: true,
      options: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'e.g. Mumbai (Hybrid)'
    },
    {
      name: 'description',
      label: 'Opportunity Description',
      type: 'textarea',
      required: true
    },
    {
      name: 'requirements',
      label: 'Requirements',
      type: 'textarea'
    },
    {
      name: 'benefits',
      label: 'Benefits',
      type: 'textarea'
    },
    {
      name: 'isActive',
      label: 'Active Role?',
      type: 'boolean',
      defaultValue: true
    }
  ]
},
resumes: {
  searchFields: ['candidateName', 'email', 'jobApplied', 'resumeFileName'],
  listColumns: [
    { name: 'candidateName', label: 'Candidate' },
    { name: 'jobApplied', label: 'Applied For' },
    { name: 'experienceYears', label: 'Experience' },
    { name: 'status', label: 'Status' }
  ],
  fields: [
    {
      name: 'candidateName',
      label: 'Candidate Name',
      type: 'text',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'text',
      required: true
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text'
    },
    {
      name: 'jobApplied',
      label: 'Job Applied For',
      type: 'text',
      required: true
    },
    {
      name: 'experienceYears',
      label: 'Years of Experience',
      type: 'text'
    },
    {
      name: 'portfolioLink',
      label: 'Portfolio / LinkedIn Link',
      type: 'text'
    },
    {
      name: 'resumeFileName',
      label: 'Resume File Name',
      type: 'text',
      required: true
    },
    {
      name: 'status',
      label: 'Application Status',
      type: 'select',
      options: ['New', 'Reviewed', 'Rejected']
    },
    {
      name: 'coverLetter',
      label: 'Cover Letter Summary',
      type: 'textarea'
    }
  ]
}
};  