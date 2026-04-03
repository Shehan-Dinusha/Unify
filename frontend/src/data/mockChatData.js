export const mockConversations = [
  {
    id: "conv-1",
    name: "Chess Club",
    lastMessage: "Individual this time! Just bring yourself 😄",
    time: "10:35 AM",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Chess%20Club&backgroundColor=2B8CEE&fontColor=ffffff",
    status: "delivered",
    unread: 3,
    isOnline: true,
    role: "Club Admin"
  },
  {
    id: "conv-2",
    name: "Science Society",
    lastMessage: "Please submit the draft by Friday evening...",
    time: "9:20 AM",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Science%20Society&backgroundColor=6A3093&fontColor=ffffff",
    status: "delivered",
    unread: 0,
    isOnline: false,
    role: "Society Admin"
  },
  {
    id: "conv-3",
    name: "Robotic Society",
    lastMessage: "Reminder about today's meeting at 3 PM",
    time: "Yesterday",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Robotic%20Society&backgroundColor=2666F1&fontColor=ffffff",
    status: "seen",
    unread: 0,
    isOnline: true,
    role: "Society Admin"
  },
  {
    id: "conv-4",
    name: "Alex Johnson",
    lastMessage: "Hey, can you help me with the assignment?",
    time: "Mon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "seen",
    unread: 1,
    isOnline: false,
    role: "Student"
  }
];

export const mockMessages = {
  "conv-1": [
    {
      id: "m1",
      sender: "Chess Club",
      text: "Hey Alex! Just checking if you're coming to the tournament today? 🎯",
      time: "10:28 AM",
      date: "Today",
      isMe: false
    },
    {
      id: "m2",
      sender: "Chess Club",
      text: "It starts at 2 PM sharp in the main hall. Don't be late!",
      time: "10:28 AM",
      date: "Today",
      isMe: false
    },
    {
      id: "m3",
      sender: "Me",
      text: "Yes, definitely! Do I need to bring anything?",
      time: "10:31 AM",
      date: "Today",
      isMe: true
    },
    {
      id: "m4",
      sender: "Me",
      text: "Also is it individual or team based this time?",
      time: "10:31 AM",
      date: "Today",
      isMe: true
    },
    {
      id: "m5",
      sender: "Chess Club",
      text: "Individual this time! Just bring yourself 😄",
      time: "10:35 AM",
      date: "Today",
      isMe: false
    },
    {
      id: "m6",
      sender: "Chess Club",
      text: "Oh and we're bringing extra boards so no need to carry yours.",
      time: "10:35 AM",
      date: "Today",
      isMe: false
    }
  ],
  "conv-2": [
    {
      id: "m1",
      sender: "Science Society",
      text: "Hi everyone! Just a reminder about the upcoming project submission.",
      time: "9:15 AM",
      date: "Today",
      isMe: false
    },
    {
      id: "m2",
      sender: "Science Society",
      text: "Please submit the draft by Friday evening so we can review it over the weekend.",
      time: "9:20 AM",
      date: "Today",
      isMe: false
    }
  ],
  "conv-3": [
    {
      id: "m1",
      sender: "Robotic Society",
      text: "Reminder about today's meeting at 3 PM in Lab B.",
      time: "Yesterday",
      date: "Yesterday",
      isMe: false
    }
  ]
};
