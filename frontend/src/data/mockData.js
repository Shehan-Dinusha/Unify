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
  },
  {
    id: 2,
    type: "found",
    title: "MacBook Charger",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/found_post_img1.jpg",
  },
  {
    id: 3,
    type: "lost",
    title: "Door Keys (Room 201)",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/lost_post_img2.jpg",
  },
  {
    id: 4,
    type: "found",
    title: "iPhone 13 Pro",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/lost_post_img3.jpg",
  },
  {
    id: 5,
    type: "lost",
    title: "Note Book",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/found_post_img2.jpg",
  },
  {
    id: 6,
    type: "found",
    title: "Hydroflask Blue",
    location: "Science Hall, Room 304",
    time: "2 days ago",
    image: "/lost_post_img1.jpg",
  },
];
