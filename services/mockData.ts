// Mock data for It's Me app

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
  about: string;
  online: boolean;
  lastSeen: string;
  verified: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  timestamp: number;
  type: 'text' | 'voice' | 'image' | 'video';
  read: boolean;
  delivered: boolean;
  encrypted: boolean;
}

export interface Chat {
  id: string;
  contact: User;
  lastMessage: string;
  lastTime: string;
  unread: number;
  pinned: boolean;
  muted: boolean;
  messages: Message[];
}

export interface Story {
  id: string;
  user: User;
  viewed: boolean;
  stories: StoryItem[];
}

export interface StoryItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  time: string;
  duration: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: number;
  isJoined: boolean;
  isAdmin: boolean;
  category: string;
  lastActivity: string;
  requestPending?: boolean;
}

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Dr M Irfan Qadir',
  phone: '+92 300 0000000',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  status: '🌟 It\'s Me — The Original',
  about: 'Founder & Owner of It\'s Me Platform',
  online: true,
  lastSeen: 'Online',
  verified: true,
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ahmed Raza',
    phone: '+92 301 1234567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: '🌙 Alhamdulillah',
    about: 'Available',
    online: true,
    lastSeen: 'Online',
    verified: false,
  },
  {
    id: 'u2',
    name: 'Fatima Khan',
    phone: '+92 302 7654321',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    status: '✨ Bismillah',
    about: 'Busy',
    online: false,
    lastSeen: '2 hours ago',
    verified: false,
  },
  {
    id: 'u3',
    name: 'Ali Hassan',
    phone: '+92 303 9876543',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: '💚 MashaAllah',
    about: 'At the mosque',
    online: true,
    lastSeen: 'Online',
    verified: false,
  },
  {
    id: 'u4',
    name: 'Sara Malik',
    phone: '+92 304 1122334',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: '🤲 SubhanAllah',
    about: 'Available',
    online: false,
    lastSeen: '30 min ago',
    verified: false,
  },
  {
    id: 'u5',
    name: 'Bilal Ahmad',
    phone: '+92 305 9988776',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    status: '📖 Learning',
    about: 'Do not disturb',
    online: true,
    lastSeen: 'Online',
    verified: false,
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    contact: MOCK_USERS[0],
    lastMessage: 'Assalam o Alaikum! How are you brother?',
    lastTime: '10:45 AM',
    unread: 3,
    pinned: true,
    muted: false,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Assalam o Alaikum!', time: '10:40 AM', timestamp: Date.now() - 300000, type: 'text', read: true, delivered: true, encrypted: true },
      { id: 'm2', senderId: 'me', text: 'Walaikum Assalam! Alhamdulillah, all well.', time: '10:42 AM', timestamp: Date.now() - 180000, type: 'text', read: true, delivered: true, encrypted: true },
      { id: 'm3', senderId: 'u1', text: 'Assalam o Alaikum! How are you brother?', time: '10:45 AM', timestamp: Date.now() - 60000, type: 'text', read: false, delivered: true, encrypted: true },
    ],
  },
  {
    id: 'c2',
    contact: MOCK_USERS[1],
    lastMessage: '🎤 Voice message',
    lastTime: '9:30 AM',
    unread: 0,
    pinned: false,
    muted: false,
    messages: [
      { id: 'm4', senderId: 'u2', text: 'Assalam!', time: '9:25 AM', timestamp: Date.now() - 3600000, type: 'text', read: true, delivered: true, encrypted: true },
      { id: 'm5', senderId: 'u2', text: '🎤 Voice message', time: '9:30 AM', timestamp: Date.now() - 3300000, type: 'voice', read: true, delivered: true, encrypted: true },
    ],
  },
  {
    id: 'c3',
    contact: MOCK_USERS[2],
    lastMessage: 'MashaAllah, great news!',
    lastTime: 'Yesterday',
    unread: 1,
    pinned: false,
    muted: false,
    messages: [
      { id: 'm6', senderId: 'u3', text: 'MashaAllah, great news!', time: '8:00 PM', timestamp: Date.now() - 86400000, type: 'text', read: false, delivered: true, encrypted: true },
    ],
  },
  {
    id: 'c4',
    contact: MOCK_USERS[3],
    lastMessage: 'JazakAllah Khair 🤲',
    lastTime: 'Yesterday',
    unread: 0,
    pinned: false,
    muted: true,
    messages: [
      { id: 'm7', senderId: 'me', text: 'Please check the document.', time: '5:00 PM', timestamp: Date.now() - 90000000, type: 'text', read: true, delivered: true, encrypted: true },
      { id: 'm8', senderId: 'u4', text: 'JazakAllah Khair 🤲', time: '6:00 PM', timestamp: Date.now() - 86400000, type: 'text', read: true, delivered: true, encrypted: true },
    ],
  },
  {
    id: 'c5',
    contact: MOCK_USERS[4],
    lastMessage: 'See you at Juma prayer InshAllah',
    lastTime: 'Mon',
    unread: 0,
    pinned: false,
    muted: false,
    messages: [
      { id: 'm9', senderId: 'u5', text: 'See you at Juma prayer InshAllah', time: '11:00 AM', timestamp: Date.now() - 172800000, type: 'text', read: true, delivered: true, encrypted: true },
    ],
  },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    user: MOCK_USERS[0],
    viewed: false,
    stories: [
      { id: 'si1', type: 'text', content: 'Alhamdulillah for everything! 🌟', time: '2h ago', duration: 5 },
    ],
  },
  {
    id: 's2',
    user: MOCK_USERS[1],
    viewed: false,
    stories: [
      { id: 'si2', type: 'image', content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop', time: '4h ago', duration: 5 },
    ],
  },
  {
    id: 's3',
    user: MOCK_USERS[2],
    viewed: true,
    stories: [
      { id: 'si3', type: 'text', content: 'JazakAllah Khair to everyone! 🤲', time: '6h ago', duration: 5 },
    ],
  },
  {
    id: 's4',
    user: MOCK_USERS[4],
    viewed: true,
    stories: [
      { id: 'si4', type: 'image', content: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop', time: '10h ago', duration: 5 },
    ],
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'com1',
    name: 'Islamic Knowledge Hub',
    description: 'Daily Hadith, Quran verses, and Islamic reminders',
    avatar: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=150&h=150&fit=crop',
    members: 15420,
    isJoined: true,
    isAdmin: false,
    category: 'Islamic',
    lastActivity: '5 min ago',
  },
  {
    id: 'com2',
    name: "It's Me Official",
    description: 'Official community for It\'s Me platform updates',
    avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop',
    members: 89543,
    isJoined: true,
    isAdmin: true,
    category: 'Official',
    lastActivity: '1h ago',
  },
  {
    id: 'com3',
    name: 'Pakistan Tech Community',
    description: 'Technology discussions, programming help & innovation',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop',
    members: 34200,
    isJoined: false,
    isAdmin: false,
    category: 'Technology',
    lastActivity: '2h ago',
  },
  {
    id: 'com4',
    name: 'Medical Professionals PK',
    description: 'For doctors, nurses and healthcare professionals',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    members: 8900,
    isJoined: false,
    isAdmin: false,
    category: 'Healthcare',
    lastActivity: '3h ago',
    requestPending: true,
  },
  {
    id: 'com5',
    name: 'Urdu Literature Circle',
    description: 'شاعری، ادب اور اردو زبان کا فروغ',
    avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop',
    members: 12300,
    isJoined: true,
    isAdmin: false,
    category: 'Literature',
    lastActivity: '30 min ago',
  },
];

export const WEATHER_DATA = {
  city: 'Lahore, Pakistan',
  temp: 34,
  condition: 'Partly Cloudy',
  humidity: 62,
  wind: 14,
  forecast: [
    { day: 'Tue', high: 34, low: 26, icon: 'partly-sunny' },
    { day: 'Wed', high: 36, low: 27, icon: 'sunny' },
    { day: 'Thu', high: 33, low: 25, icon: 'cloudy' },
    { day: 'Fri', high: 31, low: 24, icon: 'rainy' },
    { day: 'Sat', high: 35, low: 26, icon: 'sunny' },
  ],
};
