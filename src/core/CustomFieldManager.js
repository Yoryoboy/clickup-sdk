/**
 * Manages operations related to ClickUp Custom Fields
 */
class CustomFieldManager {
  /**
   * Creates a new CustomFieldManager instance
   * @param {Object} client - Axios client instance configured for ClickUp API
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get all custom fields for a specific list
   * @param {string} list_id - The ID of the list to get custom fields from
   * @returns {Promise<Array>} - Array of custom field objects
   * @throws {Error} If list_id is missing
   */
  async getListCustomFields(list_id) {
    if (!list_id) throw new Error("Missing list_id");

    const url = `/list/${list_id}/field`;
    const res = await this.client.get(url);

    return res.data.fields || [];
  }
}

export default CustomFieldManager;
