import { contract } from "@kar-le-bhai/api-contract";
import { UserProfile } from "@kar-le-bhai/domain";
import { implement, ORPCError } from "@orpc/server";

const os = implement(contract);

// --- In-Memory Database Scaffold ---
const mockUsers = new Map<string, UserProfile>([
  [
    "user_1",
    {
      id: "user_1",
      phoneNumber: "+15550100",
      displayName: "Amit Kumar",
      timezone: "Asia/kolkata",
      createdAt: new Date().toISOString()
    }
  ],
  [
    "user_2",
    {
      id: "user_2",
      phoneNumber: "+15550200",
      displayName: "Buddy Bob",
      timezone: "America/New_York",
      createdAt: new Date().toISOString()
    }
  ]
])

export const router = os.router({
  system: {
    health: os.system.health.handler(() => ({
      status: "ok",
      service: "kar-le-bhai-api",
    })),
  },
  alarm: {
    create: os.alarm.create.handler(({ input }) => ({
      id: crypto.randomUUID(),
      status: "draft",
      scheduleVersion: 1,
    })),
  },
  user: {
    // 1. Fetch profile details
    getProfile: os.user.getProfile.handler(async ({ input }) => {
      const targetId = input.id ?? "user_1"; // Falls back to current mock user
      const user = mockUsers.get(targetId);

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: `User with ID ${targetId} not found`
        })
      }

      return user;
    }),
    //2. Onboard/Update profile sync
    syncProfile: os.user.syncProfile.handler(async ({ input }) => {
      const userId = "user_1"; // Mocked authenticated user ID
      const existing = mockUsers.get(userId) || {
        id: userId,
        phoneNumber: "+15550100",
        createdAt: new Date().toISOString()
      }

      const updated: UserProfile = {
        ...existing,
        displayName: input.displayName,
        timezone: input.timezone,
        fcmToken: input.fcmToken,
        updatedAt: new Date().toISOString()
      };

      mockUsers.set(userId, updated);
      return updated;
    }),
    // 3. Search buddy by phone number
    search: os.user.search.handler(async ({ input }) => {
      const query = input.phoneNumber.trim();
      const results = Array.from(mockUsers.values())
        .filter((user) => user.phoneNumber.includes(query))
        .map(user => ({
          id: user.id,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl
        }));
      return results;
    })
  }
});
