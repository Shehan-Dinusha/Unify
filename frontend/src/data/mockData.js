export const mockRequests = [
  {
    id: 1,
    name: "Robotics Club",
    type: "Club",
    time: "2 hrs ago",
    avatar: "https://placehold.co/48x48",
    file: "budget_proposal_final.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    status: "pending"
  },
  {
    id: 2,
    name: "John Doe",
    type: "Batch Rep",
    time: "5 hrs ago",
    avatar: "https://placehold.co/48x48",
    file: "event_details_v2.docx",
    fileSize: "450 KB",
    fileType: "doc",
    status: "pending"
  },
  {
    id: 3,
    name: "Debate Society",
    type: "Club",
    time: "1 day ago",
    avatar: "https://placehold.co/48x48",
    file: "speaker_profile_pic.jpg",
    fileSize: "1.2 MB",
    fileType: "image",
    status: "pending"
  },
  {
    id: 4,
    name: "Photography Club",
    type: "Club",
    time: "2 days ago",
    avatar: "https://placehold.co/48x48",
    file: "gallery_showcase.pdf",
    fileSize: "5.6 MB",
    fileType: "pdf",
    status: "pending"
  },
  {
    id: 5,
    name: "Jane Smith",
    type: "Batch Rep",
    time: "3 days ago",
    avatar: "https://placehold.co/48x48",
    file: "semester_plan.docx",
    fileSize: "800 KB",
    fileType: "doc",
    status: "pending"
  }
];

export const mockVerified = [
  {
    id: 101,
    name: "Robotics Club",
    type: "Club",
    verifiedDate: "Sep 12, 2023",
    avatar: "https://placehold.co/56x56",
    email: "robotics@unify.com"
  },
  {
    id: 102,
    name: "ABC Perera",
    type: "Batch Rep",
    verifiedDate: "Sep 12, 2023",
    avatar: "https://placehold.co/56x56",
    degree: "Bsc.(Hons) IT",
    batch: "Batch '23",
    email: "abc.perera@unify.com"
  },
  {
    id: 103,
    name: "Music Club",
    type: "Club",
    verifiedDate: "Aug 20, 2023",
    avatar: "https://placehold.co/56x56",
    email: "music@unify.com"
  },
  {
    id: 104,
    name: "Sarah Jones",
    type: "Batch Rep",
    verifiedDate: "Oct 05, 2023",
    avatar: "https://placehold.co/56x56",
    degree: "Bsc.(Hons) SE",
    batch: "Batch '24",
    email: "sarah.j@unify.com"
  },
  {
    id: 105,
    name: "IEEE Student Branch",
    type: "Club",
    verifiedDate: "Jan 15, 2023",
    avatar: "https://placehold.co/56x56",
    email: "ieee@unify.com"
  },
];

export const mockBoostPackages = [
  {
    id: 'pkg-001',
    name: 'Starter',
    price: 1000,
    duration: '24 Hours',
    durationValue: 24,
    durationUnit: 'Hours',
    badge: 'No Badge',
    description: 'Perfect for quick announcements or flash sales.',
    features: ['Standard Visibility', 'Basic Analytics', 'Feed Placement'],
    status: 'live',
  },
  {
    id: 'pkg-002',
    name: 'Growth',
    price: 2000,
    duration: '24 Hours',
    durationValue: 24,
    durationUnit: 'Hours',
    badge: 'Most Popular',
    description: 'Best balance of reach and duration for weekly promos.',
    features: ['2x Audience Reach', 'Top of Category', 'Detailed Analytics', 'Priority Support'],
    status: 'live',
  },
  {
    id: 'pkg-003',
    name: 'Dominate',
    price: 4000,
    duration: '7 Days',
    durationValue: 7,
    durationUnit: 'Days',
    badge: 'Premium',
    description: 'Maximize brand with a full week campaign.',
    features: ['Max Reach Potential', 'Top of Feed Placement', 'Highlighted Gold Border', 'CRM Integration'],
    status: 'live',
  },
];

export const mockBoostLogs = [
  {
    id: 'log-001',
    type: 'package_updated',
    title: "Benefits updated for 'Growth' tier",
    description: "'Detailed Analytics' included in feature set",
    time: 'Yesterday, 4:12 PM',
  },
  {
    id: 'log-002',
    type: 'package_updated',
    title: "Price adjustment: 'Dominate' package",
    description: 'Updated from LKR 20,000 to LKR 22,500',
    time: '2 hours ago',
  },
];
