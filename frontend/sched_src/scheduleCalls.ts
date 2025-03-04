import { API_BASE_URL } from './config';
import { getAuthToken } from './auth';
import { WeeklySlot, ScheduleEvent } from  './schedEvent';

export const schedCalls = {
    async getSchedule(): Promise<ScheduleEvent> {
        try {
            // const token = await getAuthToken();
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlcjMiLCJleHAiOjE3NDEwNDkzMzJ9.NrWGmw26fgb3Il_onvWfmpiQ90uGz4IAd58ggy0YyhE"

            if (!token) throw new Error('No authentication token');

            const response = await fetch(`${API_BASE_URL}/users/schedule`, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const scheduleData = await response.json();

            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication required');
                else if (response.status === 404) throw new Error('User not found');
                throw new Error(`Failed to fetch schedule: ${response.status} ${scheduleData}`);
            }
        
            // Transform the direct API response to match frontend model
            const scheduleEvent: ScheduleEvent = {
                _id: scheduleData._id,
                user_id: scheduleData.user_id,
                weekly_slots: scheduleData.weekly_slots,
                created_at: scheduleData.created_at,
                updated_at: scheduleData.updated_at
            };
            
            return scheduleEvent;

        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching user schedule: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    },

    async updateSchedule(weeklySlots: WeeklySlot[]): Promise<ScheduleEvent> {
        // const token = await getAuthToken();
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlcjMiLCJleHAiOjE3NDEwNDkzMzJ9.NrWGmw26fgb3Il_onvWfmpiQ90uGz4IAd58ggy0YyhE"
        if (!token) throw new Error('No authentication token');
        console.log(weeklySlots)

        const response = await fetch(`${API_BASE_URL}/users/schedule`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({weekly_slots: weeklySlots })
        });


        if (!response.ok) {
            if (     response.status === 401) throw new Error('Authentication required');
            else if (response.status === 404) throw new Error('User not found');
            else if (response.status === 422) throw new Error('Invalid schedule data');
            throw new Error('Failed to update schedule');
        }

        const data = await response.json();
        return data.weekly_slots;
    },
}
