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

export const mockFullDocument = {
    id: 1,
    name: "Annual Budget Proposal.pdf",
    size: "2.4 MB",
    date: "Uploaded Today",
    type: "pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Example S3-like URL
};

export const mockBatchRepDocuments = [
    {
        id: 1,
        name: "Batch_rep.pdf",
        type: "pdf",
        size: "3.2 MB",
        date: "Uploaded Today",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
        id: 2,
        name: "Batch_rep.csv",
        type: "csv",
        size: "12 KB",
        date: "Uploaded Today",
        url: "" // No preview for CSV
    }
];

export const mockReports = [
  {
    id: 'R-4085',
    type: 'Hate Speech',
    typeColor: 'text-state-error',
    reportedUser: { name: 'John Doe', handle: '@john_doe_99', avatar: 'JD' },
    date: 'Oct 23, 2025',
    status: 'Dismissed',
    priority: 'High',
    submittedAgo: '2 hours ago',
    reportedContent: {
      id: 'post_99210',
      author: 'John Doe',
      handle: '@johndoe',
      date: 'Oct 24, 2023 at 4:20 PM',
      text: "I really hate how this product works it's absolute garbage and everyone involved should be ashamed. You guys are incompetent and I hope this whole company burns down. @jane_doe you are especially useless.",
      hasImage: true,
      imageLabel: 'Sensitive Content',
    },
    offender: {
      name: 'John Doe',
      handle: '@johndoe',
      id: '8839201',
      avatar: null,
      accountAge: '2 Years',
      lastActive: '10 mins ago',
      emailStatus: 'Verified',
      region: 'United States',
    },
    violationHistory: [
      { type: 'Hate Speech', date: 'Oct 10, 2023', status: 'Warning Sent', statusColor: 'bg-state-warning/20 text-state-warning' },
      { type: 'Spam', date: 'Sep 05, 2023', status: 'Dismissed', statusColor: 'bg-white/10 text-text-secondary' },
      { type: 'Inappropriate', date: 'Aug 21, 2023', status: 'Warning Sent', statusColor: 'bg-state-warning/20 text-state-warning' },
    ],
    reportedBy: {
      name: 'Sarah Smith',
      handle: '@concerned_citizen',
      badge: 'Trusted',
      reputation: 'High',
      source: 'Mobile App',
      note: '"This user keeps tagging me in aggressive posts. Please make it stop."',
    },
    reportCount: 8,
    stats: { likes: 12, comments: 4 },
    activityLog: [
      { time: '2 hours ago', title: 'New Report Created', description: 'Report #8291 created by @concerned_citizen' },
      { time: 'Just now', title: 'Admin viewing report', description: 'You opened this report.' },
    ],
  },
  {
    id: 'R-4088',
    type: 'Nudity',
    typeColor: 'text-primary-accent',
    reportedUser: { name: 'Mike Ross', handle: '@mike_ross', avatar: 'MR' },
    date: 'Oct 23, 2025',
    status: 'Resolved',
    priority: 'High',
    submittedAgo: '5 hours ago',
    reportedContent: {
      id: 'post_88341',
      author: 'Mike Ross',
      handle: '@mike_ross',
      date: 'Oct 23, 2025 at 2:15 PM',
      text: 'Check out this amazing photo shoot from last weekend. Really pushed some creative boundaries this time around.',
      hasImage: true,
      imageLabel: 'Sensitive Content',
    },
    offender: {
      name: 'Mike Ross',
      handle: '@mike_ross',
      id: '7729102',
      avatar: null,
      accountAge: '1 Year',
      lastActive: '3 hours ago',
      emailStatus: 'Verified',
      region: 'United Kingdom',
    },
    violationHistory: [
      { type: 'Nudity', date: 'Sep 15, 2025', status: 'Warning Sent', statusColor: 'bg-state-warning/20 text-state-warning' },
    ],
    reportedBy: {
      name: 'Alex Turner',
      handle: '@alex_t',
      badge: 'Member',
      reputation: 'Medium',
      source: 'Web Browser',
      note: '"This content is inappropriate for the university platform."',
    },
    reportCount: 3,
    stats: { likes: 45, comments: 12 },
    activityLog: [
      { time: '5 hours ago', title: 'New Report Created', description: 'Report created by @alex_t' },
      { time: '2 hours ago', title: 'Report Resolved', description: 'Content was removed by admin.' },
    ],
  },
  {
    id: 'R-4091',
    type: 'Spam',
    typeColor: 'text-state-warning',
    reportedUser: { name: 'Sarah Bot', handle: '@sarah_bot', avatar: 'SB' },
    date: 'Oct 24, 2025',
    status: 'In Review',
    priority: 'Medium',
    submittedAgo: '1 day ago',
    reportedContent: {
      id: 'post_91001',
      author: 'Sarah Bot',
      handle: '@sarah_bot',
      date: 'Oct 24, 2025 at 9:00 AM',
      text: 'BUY NOW! Amazing deals on electronics!! Visit our website for 90% off!! Limited time only!!! Click here >>> www.totallynotascam.com',
      hasImage: false,
      imageLabel: '',
    },
    offender: {
      name: 'Sarah Bot',
      handle: '@sarah_bot',
      id: '5519403',
      avatar: null,
      accountAge: '2 Weeks',
      lastActive: '1 day ago',
      emailStatus: 'Unverified',
      region: 'Unknown',
    },
    violationHistory: [
      { type: 'Spam', date: 'Oct 20, 2025', status: 'Warning Sent', statusColor: 'bg-state-warning/20 text-state-warning' },
      { type: 'Spam', date: 'Oct 18, 2025', status: 'Warning Sent', statusColor: 'bg-state-warning/20 text-state-warning' },
    ],
    reportedBy: {
      name: 'David Kim',
      handle: '@david_k',
      badge: 'Trusted',
      reputation: 'High',
      source: 'Mobile App',
      note: '"Obvious spam account posting advertisement links."',
    },
    reportCount: 15,
    stats: { likes: 0, comments: 1 },
    activityLog: [
      { time: '1 day ago', title: 'New Report Created', description: 'Report created by @david_k' },
      { time: '12 hours ago', title: 'Admin assigned', description: 'Report assigned for review.' },
    ],
  },
  {
    id: 'R-4092',
    type: 'Harassment',
    typeColor: 'text-state-error',
    reportedUser: { name: 'Alex Doe', handle: '@alex_doe', avatar: 'AD' },
    date: 'Oct 24, 2025',
    status: 'Pending',
    priority: 'High',
    submittedAgo: '30 minutes ago',
    reportedContent: {
      id: 'post_92010',
      author: 'Alex Doe',
      handle: '@alex_doe',
      date: 'Oct 24, 2025 at 11:30 AM',
      text: "Level up your coding sessions with the official Hackathon 2024 hoodie. Featuring a premium heavyweight cotton blend, embroidered society logo on the chest, and a custom \"bg-black\" code print on the back. It's breathable, durable, and debugging-ready.",
      hasImage: true,
      imageLabel: 'Product Image',
    },
    offender: {
      name: 'Alex Doe',
      handle: '@alex_doe',
      id: '9912045',
      avatar: null,
      accountAge: '6 Months',
      lastActive: '20 mins ago',
      emailStatus: 'Verified',
      region: 'Sri Lanka',
    },
    violationHistory: [],
    reportedBy: {
      name: 'Kasuni Perera',
      handle: '@kasuni_p',
      badge: 'Member',
      reputation: 'Medium',
      source: 'Mobile App',
      note: '"This user has been sending me unwanted messages repeatedly."',
    },
    reportCount: 2,
    stats: { likes: 142, comments: 45 },
    activityLog: [
      { time: '30 minutes ago', title: 'New Report Created', description: 'Report created by @kasuni_p' },
    ],
  },
];

const mockPosts = [
  {
    id: 1,
    author: "Millenium Hotel",
    authorInitial: "MH",
    time: "5h ago",
    title: "Millenium",
    location: "0.2 km from Central Library",
    description:
      "Perfect for grad students. Quiet, private entrance, kitchenette included.",
    image:
      "/img_post1.jpg",
    likes: 124,
    comments: 10,
    isPromoted: true,
  },
  {
    id: 2,
    author: "Robotics Club",
    authorInitial: "RC",
    time: "2h ago",
    title: "Hackathon 2026 Registration Open!",
    location: "Main Auditorium",
    description:
      "Teams of 4. Prizes worth Rs.50000. Don't miss this opportunity to build something amazing!",
    image:
      "img_post2.jpg",
    likes: 340,
    comments: 28,
    isPromoted: false,
  },
  {
    id: 3,
    author: "Music Society",
    authorInitial: "MS",
    time: "3h ago",
    title: "Open mic Night",
    location: "Student Center Atrium",
    description:
      "Free entry for all students. Snacks provided. It's going to be a night filled with amazing performances from our talented students.",
    image:
      "img_post3.jpg",
    likes: 150,
    comments: 18,
    isPromoted: true,
  },
  {
    id: 4,
    author: "IEEE",
    authorInitial: "I",
    time: "4h ago",
    title: "Career Fair Prep Workshop",
    location: "Lecture Hall B",
    description:
      "This introductory lecture will explore the foundations of computer science, including problem-solving techniques, programming basics, and real-world applications. Hosted by Prof. Alan Turing, this session is perfect for students considering a major in CS or anyone interested in understanding the technology shaping our world.",
    image:
      "img_post4.jpg",
    likes: 150,
    comments: 18,
    isPromoted: false,
  },
  {
    id: 5,
    author: "Drama Society",
    authorInitial: "DS",
    time: "7h ago",
    title: "Movie Screening: Intersteller",
    location: "Main Auditorium",
    description:
      "Experience the visually stunning and thought-provoking journey through space as a team of explorers travel beyond our galaxy to save humanity. Bring your friends, relax in the auditorium, and enjoy complimentary popcorn. A short discussion will follow the screening for those who want to dive deeper into the film’s themes and science. 25th of March 5.00pm to 8.00pm",
    image:
      "img_post5.jpg",
    likes: 150,
    comments: 18,
    isPromoted: false,
  },
  {
    id: 6,
    author: "Robotic Club",
    authorInitial: "RC",
    time: "7h ago",
    title: "Hackathon 2026 Hoodie",
    location: "",
    description:
      "High quality cotton blend with embroidered logo. Pre-order now to guarantee your size. Price is Rs: 2500.00",
    image:
      "img_post6.jpg",
    likes: 150,
    comments: 18,
    isPromoted: false,
  },
  {
    id: 7,
    author: "Robotic Club",
    authorInitial: "RC",
    time: "7h ago",
    title: "Calculus Early Transcendentals",
    location: "",
    description:
      "High quality pages with beautifully embossed cover. Pre-order now to reserve your copy and dive into the code. Price is Rs: 1050.00",
    image:
      "img_post7.jpg",
    likes: 150,
    comments: 18,
    isPromoted: false,
  },

];

export default mockPosts;

export const mockLostAndFoundItems = [
  {
    id: 1,
    type: "lost",
    title: "Hydroflask Blue 32oz",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/lost_post_img1.jpg",
    postId: "#UNFY-4201",
    date: "Mar 10, 2026",
    timeOfDay: "11:45 AM",
    description:
      "Lost a blue Hydroflask 32oz water bottle with a few stickers on it (a mountain sticker and a smiley face). It was last seen on the desk in Room 304 during the afternoon lecture. The bottle has a small dent on the bottom.",
    postedBy: {
      name: "Alex Johnson",
      department: "CSE 24",
      avatar: "https://placehold.co/40x40",
    },
  },
  {
    id: 2,
    type: "found",
    title: "MacBook Charger",
    location: "Library, 2nd Floor",
    time: "2 days ago",
    image: "/found_post_img1.jpg",
    postId: "#UNFY-4202",
    date: "Mar 10, 2026",
    timeOfDay: "3:15 PM",
    description:
      "Found a white MacBook charger (67W USB-C) plugged in at one of the study desks on the 2nd floor of the library. It was left behind after the afternoon study session. The cable appears to be in good condition with no visible damage.",
    postedBy: {
      name: "Sarah Williams",
      department: "IT 23",
      avatar: "https://placehold.co/40x40",
    },
  },
  {
    id: 3,
    type: "lost",
    title: "Door Keys (Room 201)",
    location: "Cafeteria, Main Building",
    time: "2 days ago",
    image: "/lost_post_img2.jpg",
    postId: "#UNFY-4203",
    date: "Mar 09, 2026",
    timeOfDay: "1:00 PM",
    description:
      "Lost a set of door keys for Room 201 in the hostel block. The keychain has a small red lanyard attached. Last seen around the cafeteria area during lunch break. There are two keys — one silver and one brass colored.",
    postedBy: {
      name: "David Perera",
      department: "SE 24",
      avatar: "https://placehold.co/40x40",
    },
  },
  {
    id: 4,
    type: "found",
    title: "iPhone 13 Pro",
    location: "Student Center, 2nd Floor (Near Quiet Study Area)",
    time: "2 days ago",
    image: "/lost_post_img3.jpg",
    postId: "#UNFY-8291",
    date: "Oct 24, 2023",
    timeOfDay: "2:30 PM",
    description:
      "Found a black iPhone 13 Pro with a clear magsafe case sitting on one of the couches in the quiet study area. It has a cracked screen protector on the top right corner. The lock screen has a picture of a golden retriever.",
    postedBy: {
      name: "Alex Johnson",
      department: "CSE 24",
      avatar: "https://placehold.co/40x40",
    },
  },
  {
    id: 5,
    type: "lost",
    title: "Note Book",
    location: "Lecture Hall A, Seat 14",
    time: "2 days ago",
    image: "/found_post_img2.jpg",
    postId: "#UNFY-4205",
    date: "Mar 11, 2026",
    timeOfDay: "9:30 AM",
    description:
      "Lost a spiral-bound notebook with a navy blue cover. It contains handwritten notes for Software Engineering and Database Systems modules. My name is written on the inside cover. Last seen after the morning lecture in Lecture Hall A.",
    postedBy: {
      name: "Nimasha Fernando",
      department: "IT 25",
      avatar: "https://placehold.co/40x40",
    },
  },
  {
    id: 6,
    type: "found",
    title: "Hydroflask Blue",
    location: "Gym, Near Entrance",
    time: "2 days ago",
    image: "/lost_post_img1.jpg",
    postId: "#UNFY-4206",
    date: "Mar 11, 2026",
    timeOfDay: "5:00 PM",
    description:
      "Found a blue Hydroflask water bottle near the entrance of the university gym. It was left on the bench next to the shoe rack. No stickers or identifying marks on it. Appears to be a 24oz size.",
    postedBy: {
      name: "Kevin Rathnayake",
      department: "CSE 23",
      avatar: "https://placehold.co/40x40",
    },
  },
];
