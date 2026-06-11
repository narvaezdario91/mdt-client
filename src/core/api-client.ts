import axios from 'axios';
import { Payload } from '../models/payload.schema';

export class ApiClient {
  constructor(private baseUrl: string = 'http://localhost:8000') {}

  public async executeFeature(payload: Payload): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/execute`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 'Unknown Status';
        const data = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`API Error [${status}]: ${data}`);
      }
      throw error;
    }
  }
}
