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

const mockPosts = [
  {
    id: 1,
    author: "Jane D.",
    authorInitial: "JD",
    time: "5h ago",
    title: "Millenium",
    description:
      "Perfect for grad students. Quiet, private entrance, kitchenette included.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    likes: 124,
    comments: 10,
    isPromoted: false,
  },
  {
    id: 2,
    author: "Robotics Club",
    authorInitial: "RC",
    time: "2h ago",
    title: "Hackathon 2026 Registration Open!",
    description:
      "Teams of 4. Prizes worth Rs.50000. Don't miss this opportunity to build something amazing!",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    likes: 340,
    comments: 28,
    isPromoted: true,
  },
];

export default mockPosts;

