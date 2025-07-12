import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for mock data

const MOCK_API_DELAY = 500; // Simulate network latency

// Mock Skill data with _id matching backend schema
let mockSkills = [
  { _id: 'skill-001', name: 'Web Development', category: 'Tech', level: 'expert' },
  { _id: 'skill-002', name: 'Graphic Design', category: 'Creative', level: 'intermediate' },
  { _id: 'skill-003', name: 'Photography', category: 'Creative', level: 'beginner' },
  { _id: 'skill-004', name: 'Spanish', category: 'Language', level: 'intermediate' },
  { _id: 'skill-005', name: 'Data Analysis', category: 'Tech', level: 'expert' },
  { _id: 'skill-006', name: 'Excel', category: 'Software', level: 'expert' },
  { _id: 'skill-007', name: 'Public Speaking', category: 'Soft Skills', level: 'beginner' },
  { _id: 'skill-008', name: 'Cooking', category: 'Lifestyle', level: 'intermediate' },
  { _id: 'skill-009', name: 'French', category: 'Language', level: 'expert' },
  { _id: 'skill-0010', name: 'Painting', category: 'Creative', level: 'intermediate' },
  { _id: 'skill-0011', name: 'Coding', category: 'Tech', level: 'beginner' },
  { _id: 'skill-0012', name: 'Marketing', category: 'Business', level: 'intermediate' },
];

// Helper to "populate" skill IDs with full skill objects
const populateSkills = (user) => {
  const populatedUser = { ...user };
  if (populatedUser.skillsOffered) {
    populatedUser.skillsOffered = populatedUser.skillsOffered
      .map(skillId => mockSkills.find(s => s._id === skillId))
      .filter(Boolean); // Filter out any undefined if ID not found
  }
  if (populatedUser.skillsWanted) {
    populatedUser.skillsWanted = populatedUser.skillsWanted
      .map(skillId => mockSkills.find(s => s._id === skillId))
      .filter(Boolean); // Filter out any undefined if ID not found
  }
  return populatedUser;
};

// Mock User data with skillsOffered/skillsWanted as skill _id's
let mockUsers = [
  {
    _id: 'user-001', // Corresponds to MongoDB's _id
    username: 'alice_smith',
    email: 'alice@example.com',
    password: 'hashed_password_alice', // For mock login, password is 'hashed_password_alice'
    name: 'Alice Smith',
    location: 'London, UK',
    profilePhotoURL: 'https://placehold.co/100x100/ADD8E6/000000?text=AS',
    isPublic: true,
    availability: ['monday', 'wednesday', 'friday'],
    skillsOffered: ['skill-001', 'skill-002'], // Storing skill _id's
    skillsWanted: ['skill-003', 'skill-004'],    // Storing skill _id's
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-07-10T10:00:00Z').toISOString(),
    role: 'user',
  },
  {
    _id: 'user-002',
    username: 'bob_johnson',
    email: 'bob@example.com',
    password: 'hashed_password_bob', // For mock login, password is 'hashed_password_bob'
    name: 'Bob Johnson',
    location: 'New York, USA',
    profilePhotoURL: 'https://placehold.co/100x100/90EE90/000000?text=BJ',
    isPublic: true,
    availability: ['tuesday', 'thursday', 'saturday'],
    skillsOffered: ['skill-005', 'skill-006'],
    skillsWanted: ['skill-007', 'skill-008'],
    createdAt: new Date('2024-02-20T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-07-11T11:00:00Z').toISOString(),
    role: 'user',
  },
  {
    _id: 'user-003',
    username: 'charlie_brown',
    email: 'charlie@example.com',
    password: 'hashed_password_charlie', // For mock login, password is 'hashed_password_charlie'
    name: 'Charlie Brown',
    location: 'Paris, France',
    profilePhotoURL: 'https://placehold.co/100x100/FFD700/000000?text=CB',
    isPublic: false, // Private user
    availability: ['monday', 'tuesday'],
    skillsOffered: ['skill-009', 'skill-0010'],
    skillsWanted: ['skill-0011', 'skill-0012'],
    createdAt: new Date('2024-03-01T12:00:00Z').toISOString(),
    updatedAt: new Date('2024-07-09T12:00:00Z').toISOString(),
    role: 'user',
  },
];


let mockSwapRequests = [
  {
    swapId: 'swap-001',
    fromUserId: 'user-001', // Alice
    toUserId: 'user-002',    // Bob
    offeredSkill: 'Web Development', // In a real backend, these would likely be skill _id's
    requestedSkill: 'Data Analysis', // In a real backend, these would likely be skill _id's
    status: 'pending',
    createdAt: new Date('2024-07-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-07-01T09:00:00Z').toISOString(),
  },
  {
    swapId: 'swap-002',
    fromUserId: 'user-002', // Bob
    toUserId: 'user-001',    // Alice
    offeredSkill: 'Excel',
    requestedSkill: 'Graphic Design',
    status: 'accepted',
    createdAt: new Date('2024-06-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-06-21T10:00:00Z').toISOString(),
  },
  {
    swapId: 'swap-003',
    fromUserId: 'user-001', // Alice
    toUserId: 'user-003',    // Charlie (private)
    offeredSkill: 'Graphic Design',
    requestedSkill: 'Painting',
    status: 'pending',
    createdAt: new Date('2024-07-10T14:00:00Z').toISOString(),
    updatedAt: new Date('2024-07-10T14:00:00Z').toISOString(),
  },
];

let mockNotifications = [
  {
    notificationId: 'notif-001',
    userId: 'user-001',
    type: 'SwapRequestAccepted',
    message: 'Your swap request for Web Development has been accepted by Bob Johnson.',
    isRead: false,
    createdAt: new Date('2024-07-02T09:30:00Z').toISOString(),
    relatedEntityId: 'swap-002',
  },
  {
    notificationId: 'notif-002',
    userId: 'user-002',
    type: 'NewSwapRequest',
    message: 'Alice Smith sent you a new swap request for Data Analysis.',
    isRead: false,
    createdAt: new Date('2024-07-01T09:05:00Z').toISOString(),
    relatedEntityId: 'swap-001',
  },
];

export const mockApi = {
  // --- Auth ---
  login: async (username, password) => { // Changed email to username
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.username === username && u.password === 'hashed_password_' + username.split('_')[0]);
        if (user) {
          resolve({ success: true, user: populateSkills(user) }); // Populate skills on login
        } else {
          reject({ success: false, message: 'Invalid credentials' });
        }
      }, MOCK_API_DELAY);
    });
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some(u => u.username === userData.username)) { // Check username uniqueness
          return reject({ success: false, message: 'Username already taken' });
        }
        if (mockUsers.some(u => u.email === userData.email)) { // Check email uniqueness
          return reject({ success: false, message: 'Email already registered' });
        }

        // Convert skill names to IDs for storage
        const skillsOfferedIds = (userData.skillsOffered || []).map(name => mockSkills.find(s => s.name === name)?._id).filter(Boolean);
        const skillsWantedIds = (userData.skillsWanted || []).map(name => mockSkills.find(s => s.name === name)?._id).filter(Boolean);

        const newUser = {
          _id: uuidv4(), // Corresponds to MongoDB's _id
          username: userData.username,
          email: userData.email,
          password: 'hashed_password_' + userData.username.split('_')[0], // Mock hashing
          name: userData.name,
          location: userData.location || '',
          profilePhotoURL: userData.profilePhotoURL || `https://placehold.co/100x100/ADD8E6/000000?text=${userData.name.charAt(0)}`,
          isPublic: true, // Default to public
          availability: userData.availability || [],
          skillsOffered: skillsOfferedIds, // Store IDs
          skillsWanted: skillsWantedIds,    // Store IDs
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'user',
        };
        mockUsers.push(newUser);
        resolve({ success: true, user: populateSkills(newUser) }); // Populate skills on registration
      }, MOCK_API_DELAY);
    });
  },

  // --- User ---
  getUser: async (userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockUsers.find(u => u._id === userId); // Use _id
        resolve(user ? populateSkills(user) : null); // Populate skills
      }, MOCK_API_DELAY);
    });
  },

  updateUser: async (userId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(u => u._id === userId); // Use _id
        if (userIndex > -1) {
          // Convert skill names back to IDs for storage
          if (updates.skillsOffered) {
            updates.skillsOffered = updates.skillsOffered.map(name => mockSkills.find(s => s.name === name)?._id).filter(Boolean);
          }
          if (updates.skillsWanted) {
            updates.skillsWanted = updates.skillsWanted.map(name => mockSkills.find(s => s.name === name)?._id).filter(Boolean);
          }

          mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          resolve({ success: true, user: populateSkills(mockUsers[userIndex]) }); // Populate skills on update
        } else {
          reject({ success: false, message: 'User not found' });
        }
      }, MOCK_API_DELAY);
    });
  },

  getUsers: async (filters = {}) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let filteredUsers = mockUsers.filter(u => u.isPublic); // Only show public users by default

        if (filters.skill) {
          const lowerCaseSkill = filters.skill.toLowerCase();
          filteredUsers = filteredUsers.filter(u =>
            // Check if any offered/wanted skill's name matches the filter
            u.skillsOffered.some(skillId => mockSkills.find(s => s._id === skillId)?.name.toLowerCase().includes(lowerCaseSkill)) ||
            u.skillsWanted.some(skillId => mockSkills.find(s => s._id === skillId)?.name.toLowerCase().includes(lowerCaseSkill))
          );
        }
        if (filters.availability && filters.availability.length > 0) {
          filteredUsers = filteredUsers.filter(u =>
            filters.availability.every(day => u.availability.includes(day))
          );
        }
        if (filters.location) {
          filteredUsers = filteredUsers.filter(u =>
            u.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        resolve(filteredUsers.map(u => populateSkills(u))); // Populate skills for all returned users
      }, MOCK_API_DELAY);
    });
  },

  // --- Skill (for autocomplete, etc.) ---
  getSkills: async (query = '') => {
    return new Promise(resolve => {
      setTimeout(() => {
        const lowerCaseQuery = query.toLowerCase();
        const filteredSkills = mockSkills.filter(s =>
          s.name.toLowerCase().includes(lowerCaseQuery)
        );
        resolve(filteredSkills); // Return full skill objects
      }, MOCK_API_DELAY);
    });
  },

  // --- Swap Requests ---
  createSwapRequest: async (requestData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // NOTE: In a real backend, you would likely store skill _id's here
        // For mock, we continue to store skill names as the frontend currently sends them.
        const newRequest = {
          swapId: uuidv4(),
          fromUserId: requestData.fromUserId,
          toUserId: requestData.toUserId,
          offeredSkill: requestData.offeredSkill, // This is a skill name from frontend
          requestedSkill: requestData.requestedSkill, // This is a skill name from frontend
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockSwapRequests.push(newRequest);

        // Simulate notification for the recipient
        const toUser = mockUsers.find(u => u._id === newRequest.toUserId); // Use _id
        if (toUser) {
          mockNotifications.push({
            notificationId: uuidv4(),
            userId: toUser._id, // Use _id
            type: 'NewSwapRequest',
            message: `${mockUsers.find(u => u._id === newRequest.fromUserId)?.name} sent you a new swap request for ${newRequest.requestedSkill}.`,
            isRead: false,
            createdAt: new Date().toISOString(),
            relatedEntityId: newRequest.swapId,
          });
        }

        resolve({ success: true, swapRequest: newRequest });
      }, MOCK_API_DELAY);
    });
  },

  getSwapRequests: async (userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const userRequests = mockSwapRequests.filter(
          req => req.fromUserId === userId || req.toUserId === userId
        ).map(req => {
          // Enrich with user names for display
          const fromUser = mockUsers.find(u => u._id === req.fromUserId); // Use _id
          const toUser = mockUsers.find(u => u._id === req.toUserId);      // Use _id
          return {
            ...req,
            fromUserName: fromUser ? fromUser.name : 'Unknown User',
            toUserName: toUser ? toUser.name : 'Unknown User',
          };
        });
        resolve(userRequests);
      }, MOCK_API_DELAY);
    });
  },

  updateSwapRequestStatus: async (swapId, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const reqIndex = mockSwapRequests.findIndex(req => req.swapId === swapId);
        if (reqIndex > -1) {
          mockSwapRequests[reqIndex].status = status;
          mockSwapRequests[reqIndex].updatedAt = new Date().toISOString();

          // Simulate notification for the other party
          const updatedReq = mockSwapRequests[reqIndex];
          const recipientId = updatedReq.status === 'accepted' ? updatedReq.fromUserId : updatedReq.toUserId; // Simplified logic
          const senderName = mockUsers.find(u => u._id === (updatedReq.status === 'accepted' ? updatedReq.toUserId : updatedReq.fromUserId))?.name; // Use _id

          mockNotifications.push({
            notificationId: uuidv4(),
            userId: recipientId,
            type: `SwapRequest${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your swap request for ${updatedReq.offeredSkill} has been ${status} by ${senderName}.`,
            isRead: false,
            createdAt: new Date().toISOString(),
            relatedEntityId: updatedReq.swapId,
          });

          resolve({ success: true, swapRequest: mockSwapRequests[reqIndex] });
        } else {
          reject({ success: false, message: 'Swap request not found' });
        }
      }, MOCK_API_DELAY);
    });
  },

  deleteSwapRequest: async (swapId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = mockSwapRequests.length;
        mockSwapRequests = mockSwapRequests.filter(req => req.swapId !== swapId);
        if (mockSwapRequests.length < initialLength) {
          resolve({ success: true, message: 'Swap request deleted' });
        } else {
          reject({ success: false, message: 'Swap request not found' });
        }
      }, MOCK_API_DELAY);
    });
  },

  // --- Feedback ---
  submitFeedback: async (feedbackData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newFeedback = {
          feedbackId: uuidv4(),
          ...feedbackData,
          createdAt: new Date().toISOString(),
        };
        // In a real app, you'd store this in a feedback collection
        console.log('Feedback submitted:', newFeedback);
        resolve({ success: true, feedback: newFeedback });
      }, MOCK_API_DELAY);
    });
  },

  getFeedbackForUser: async (userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Mocking feedback - in a real app, you'd query the Feedback collection
        const feedback = [
          { feedbackId: 'f1', swapId: 's1', fromUserId: 'user-002', toUserId: userId, rating: 5, comment: 'Excellent swap!', createdAt: new Date().toISOString() },
          { feedbackId: 'f2', swapId: 's2', fromUserId: 'user-001', toUserId: userId, rating: 4, comment: 'Very helpful.', createdAt: new Date().toISOString() },
        ].filter(f => f.toUserId === userId || f.fromUserId === userId); // Show feedback given and received
        resolve(feedback);
      }, MOCK_API_DELAY);
    });
  },

  // --- Notifications ---
  getNotifications: async (userId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const userNotifications = mockNotifications.filter(n => n.userId === userId);
        resolve(userNotifications);
      }, MOCK_API_DELAY);
    });
  },

  markNotificationAsRead: async (notificationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notifIndex = mockNotifications.findIndex(n => n.notificationId === notificationId);
        if (notifIndex > -1) {
          mockNotifications[notifIndex].isRead = true;
          resolve({ success: true });
        } else {
          reject({ success: false, message: 'Notification not found' });
        }
      }, MOCK_API_DELAY);
    });
  },
};