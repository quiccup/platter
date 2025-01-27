import { dbAdapter } from "@/lib/data/databaseAdapter";

interface UpsertUserParams {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private db = dbAdapter; // Use the exported instance

  /**
   * Upserts a user into the database.
   * @param {UpsertUserParams} user - The user details.
   * @param {userToken} user - The user token.
   * @returns {Promise<{ error: Error | null }>} - Result of the operation.
   */
  async upsertUser(user: UpsertUserParams, userToken: string): Promise<{ error: Error | null }> {
    const { clerkId, email, firstName, lastName, createdAt, updatedAt } = user;

    return this.db.upsert(
      "users",
      {
        clerk_id: clerkId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        created_at: createdAt,
        updated_at: updatedAt,
      },
      ["clerk_id"],
      userToken
    );
  }
}

export const userService: UserService = new UserService();
