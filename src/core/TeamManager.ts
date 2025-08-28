import { AxiosInstance } from "axios";
import { Teams } from "../types/index";

/**
 * Manages operations related to ClickUp Teams (workspaces)
 * Docs: https://clickup.com/api/clickupreference/operation/GetAuthorizedTeams/
 */
class TeamManager {
  client: AxiosInstance;

  /**
   * Creates a new TeamManager instance
   * @param {AxiosInstance} client - Axios client configured with baseURL and auth
   */
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Get all teams (workspaces) the token has access to.
   * Uses GET /team and returns the raw typed response.
   *
   * - No parameters required by the API.
   * - Handles network and Axios errors with descriptive messages.
   * - Keeps the response shape intact to avoid extra processing.
   */
  async getTeams(): Promise<Teams> {
    try {
      const res = await this.client.get("/team");

      // Basic shape guard to handle unexpected API responses gracefully
      if (!res?.data || !Array.isArray(res.data.teams)) {
        throw new Error("Unexpected response format when fetching teams");
      }

      return res.data as Teams;
    } catch (err: any) {
      // Normalize Axios/network errors for consumers of the SDK
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.err || err?.response?.data?.message;
      const message = apiMessage || err?.message || "Unknown error";

      // Provide context while preserving original error for debugging
      const wrapped = new Error(
        `Failed to fetch teams: ${message}${status ? ` (HTTP ${status})` : ""}`
      );
      (wrapped as any).cause = err;
      throw wrapped;
    }
  }
}

export default TeamManager;
