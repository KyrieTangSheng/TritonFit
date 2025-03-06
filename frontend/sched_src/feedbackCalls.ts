import { API_BASE_URL } from './config';
import { getAuthToken } from './auth';
import { WorkoutPlan } from  './feedbackEvent';
import { plan_id } from  './planID';

export const feedCalls = {
    async sendFeedback(feedBack: string): Promise<WorkoutPlan> {
        // const token = await getAuthToken();
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlcjMiLCJleHAiOjE3NDEyODMyMjV9.RlajPYl3k7eBl_VyWZeV6G7nxx3Cq9ejMoNGAhGuFbc"
        if (!token) throw new Error('No authentication token');

        console.log("sending feedback...")
        const response = await fetch(`${API_BASE_URL}/workout-plans/${plan_id}/feedback`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({feedback: feedBack })
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Workout plan not found');
            throw new Error('Failed to send feedback');
        }

        const data = await response.json();
        return data.feedback;
    },
}