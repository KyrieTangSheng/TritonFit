import { API_BASE_URL } from './config';
import { getAuthToken } from './auth';
import { WeeklySlot, ScheduleEvent } from  './schedEvent';

export const schedCalls = {
    async getSchedule(): Promise<ScheduleEvent> {
        try {
            const token = await getAuthToken();
            if (!token) throw new Error('No authentication token');

            // console.log("Calling API...");
            const response = await fetch(`${API_BASE_URL}/users/schedule`, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const responseText = await response.text();

            if (!response.ok) {
                if (response.status === 401) throw new Error('Authentication required');
                else if (response.status === 404) throw new Error('User not found');
                throw new Error(`Failed to fetch schedule: ${response.status} ${responseText}`);
            }

            const data = responseText ? JSON.parse(responseText) : {};

            const emptySchedule: ScheduleEvent = {
                _id: "new-id",  // Replace 
                user_id: "user-id",  // Replace
                weekly_slots: [{ day_of_week: NaN, start_time: "", end_time: "" }],  // Empty weekly slots
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (data.events?.[0] == undefined) {
                return emptySchedule
            }

            return data.events?.[0]; // Return the first event or empty schedule if empty
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching user schedule: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    },

    async updateSchedule(weeklySlots: WeeklySlot[]): Promise<ScheduleEvent> {
        const token = await getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/users/schedule`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
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
        return data.event;
    },
}