// Dummy data for Bridge chat app

export const currentUser = {
  id: "me",
  name: "Muntasir Tonoy",
  username: "@tonoy_b",
  avatar:
    "https://i.ibb.co.com/kss7vSR8/486576202-1787487388480587-6687481655588993159-n.jpg",
  initials: "MT",
  email: "tonoy@hotmail",
  location: "Dhaka, Bangladesh",
  bio: "Full-stack developer and MERN stack enthusiast. Building things that matter.",
  joinedDate: "August 2023",
  isOnline: true,
};

export const contacts = [
  {
    id: "c1",
    name: "Elena Rostova",
    username: "@elena.rostova",
    email: "elena@ethereal.ui",
    location: "Moscow, Russia",
    avatar:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena&backgroundColor=b6e3f4",
    isOnline: true,
    about:
      "Passionate about creating intuitive user experiences. Currently exploring the intersection of motion design and accessibility.",
    sharedMedia: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=100&h=100&fit=crop",
    ],
    extraMedia: 8,
  },
  {
    id: "c2",
    name: "Marcus Hale",
    username: "@marcus.hale",
    email: "marcus@ethereal.ui",
    location: "San Francisco, CA",
    avatar:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus&backgroundColor=c0aede",
    isOnline: false,
    about:
      "Crafting calm interfaces. Currently obsessing over typography and negative space.",
    sharedMedia: [
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
    ],
    extraMedia: 12,
  },
  {
    id: "c3",
    name: "Alex Chen",
    username: "@alexchen.dev",
    email: "alex@codebridge.io",
    location: "Singapore",
    avatar:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=AlexChen&backgroundColor=d1d4f9",
    isOnline: true,
    about:
      "Building bridges between design and code. React enthusiast and coffee addict.",
    sharedMedia: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop",
    ],
    extraMedia: 5,
  },
  {
    id: "c4",
    name: "Sarah Jenkins",
    username: "@sarahjenkins",
    email: "sarah@productco.io",
    location: "London, UK",
    avatar:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah&backgroundColor=ffd5dc",
    isOnline: true,
    about:
      "Turning user pain into product gain. Obsessed with roadmaps and sticky notes.",
    sharedMedia: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=100&h=100&fit=crop",
    ],
    extraMedia: 3,
  },
  {
    id: "c5",
    name: "David Kim",
    username: "@davidkim.io",
    email: "david@techstack.dev",
    location: "Seoul, South Korea",
    initials: "DK",
    isOnline: false,
    about:
      "APIs and microservices are my art form. Currently diving deep into Rust and distributed systems.",
    sharedMedia: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
    ],
    extraMedia: 2,
  },
  {
    id: "c6",
    name: "Chloe Smith",
    username: "@chloe.smith",
    email: "chloe@brandlab.co",
    location: "New York, NY",
    initials: "CS",
    isOnline: false,
    about: "Words that work. Crafting brand voices that resonate and convert.",
    sharedMedia: [],
    extraMedia: 0,
  },
];

export const conversations = {
  c1: {
    contactId: "c1",
    messages: [
      {
        id: "m1",
        senderId: "c1",
        text: "Hey! Have you had a chance to review the new onboarding flow I sent over?",
        time: "10:15 AM",
        date: "Today",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Yes! Just finished going through it. The micro-animations on the step transitions are 🔥",
        time: "10:18 AM",
        date: "Today",
      },
      {
        id: "m3",
        senderId: "c1",
        text: "Thank you! I spent way too long tweaking the easing curves on those. Worth it though.",
        time: "10:20 AM",
        date: "Today",
      },
      {
        id: "m4",
        senderId: "me",
        text: "Definitely. Can we schedule a quick sync this afternoon to go over the feedback from the stakeholders?",
        time: "10:22 AM",
        date: "Today",
      },
      {
        id: "m5",
        senderId: "c1",
        text: "Absolutely! How does 3 PM work for you?",
        time: "10:24 AM",
        date: "Today",
      },
      {
        id: "m6",
        senderId: "me",
        text: "Perfect. I'll send a calendar invite.",
        time: "10:25 AM",
        date: "Today",
      },
    ],
    isTyping: false,
  },
  c2: {
    contactId: "c2",
    messages: [
      {
        id: "m1",
        senderId: "c2",
        text: "The new mockups look incredible. I really love the atmospheric depth we're getting with those tonal shifts.",
        time: "10:42 AM",
        date: "Today",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Thanks! I think ditching the hard borders really opened up the space. The 'Ghost Border' trick is working well for accessibility too.",
        time: "10:43 AM",
        date: "Today",
      },
      {
        id: "m3",
        senderId: "c2",
        text: "Agreed. Have you had a chance to look at the animation curves for the sidebar transitions?",
        time: "10:45 AM",
        date: "Today",
      },
      {
        id: "m4",
        senderId: "c2",
        text: "We might need to slow them down just a touch to match the 'calm' vibe.",
        time: "10:45 AM",
        date: "Today",
      },
    ],
    isTyping: true,
  },
  c3: {
    contactId: "c3",
    messages: [
      {
        id: "m1",
        senderId: "me",
        text: "Hey Alex, the PR is ready for review when you get a chance.",
        time: "9:00 AM",
        date: "Today",
      },
      {
        id: "m2",
        senderId: "c3",
        text: "On it! Give me 20 minutes.",
        time: "9:05 AM",
        date: "Today",
      },
      {
        id: "m3",
        senderId: "c3",
        text: "Left a few comments — mostly nits. LGTM overall 🚀",
        time: "9:32 AM",
        date: "Today",
      },
    ],
    isTyping: false,
  },
  c4: {
    contactId: "c4",
    messages: [
      {
        id: "m1",
        senderId: "c4",
        text: "Sprint planning is tomorrow at 10 AM. Can you prepare the velocity chart?",
        time: "Yesterday",
        date: "Yesterday",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Sure, I'll have it ready by EOD today.",
        time: "Yesterday",
        date: "Yesterday",
      },
    ],
    isTyping: false,
  },
  c5: {
    contactId: "c5",
    messages: [
      {
        id: "m1",
        senderId: "c5",
        text: "The new Redis cache layer cut our API latency by 60%. Crazy results.",
        time: "Mon",
        date: "Monday",
      },
      {
        id: "m2",
        senderId: "me",
        text: "That's insane! Great work David.",
        time: "Mon",
        date: "Monday",
      },
    ],
    isTyping: false,
  },
  c6: {
    contactId: "c6",
    messages: [
      {
        id: "m1",
        senderId: "c6",
        text: "I've been working on the new brand guidelines. Want to take a look?",
        time: "Sun",
        date: "Sunday",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Would love to! Send it over.",
        time: "Sun",
        date: "Sunday",
      },
    ],
    isTyping: false,
  },
};

export function getLastMessage(contactId) {
  const conv = conversations[contactId];
  if (!conv || conv.messages.length === 0)
    return { text: "No messages yet", time: "" };
  const last = conv.messages[conv.messages.length - 1];
  return { text: last.text, time: last.time };
}
