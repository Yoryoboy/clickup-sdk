import { AxiosInstance } from "axios";
import { CustomField, SetCustomFieldValueParams } from "../types/index";

/**
 * Manages operations related to ClickUp Custom Fields
 */
class CustomFieldManager {
  client: AxiosInstance;
  /**
   * Creates a new CustomFieldManager instance
   * @param {AxiosInstance} client - Axios client instance configured for ClickUp API
   */
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Get all custom fields for a specific list
   * @param {string} list_id - The ID of the list to get custom fields from
   * @returns {Promise<Array<CustomField>>} - Array of custom field objects
   * @throws {Error} If list_id is missing
   */
  async getListCustomFields(list_id: string): Promise<Array<CustomField>> {
    if (!list_id) throw new Error("Missing list_id");

    const url = `/list/${list_id}/field`;
    const res = await this.client.get(url);

    return res.data.fields || [];
  }

  /**
   * Set a custom field value for a specific task
   * @param {SetCustomFieldValueParams} params - Parameters for setting the custom field value
   * @param {string} params.task_id - The ID of the task to update
   * @param {string} params.field_id - The universal unique identifier (UUID) of the custom field
   * @param {string} params.value - The value to set for the custom field
   * @returns {Promise<Record<string, unknown>>} - The API response
   * @throws {Error} If task_id or field_id is missing
   */
  async setCustomFieldValue(
    params: SetCustomFieldValueParams
  ): Promise<Record<string, unknown>> {
    const { task_id, field_id, value } = params;

    if (!task_id) throw new Error("Missing task_id");
    if (!field_id) throw new Error("Missing field_id");

    const url = `/task/${task_id}/field/${field_id}`;

    const res = await this.client.post(url, { value });

    return res.data;
  }
}

export default CustomFieldManager;
