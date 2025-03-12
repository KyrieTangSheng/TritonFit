import { API_BASE_URL } from './config';
import { getAuthToken } from './auth';

export const gymPlanApi = {

    async getTodayWorkout() {
        try {
            const token = await getAuthToken();
            if (!token) throw new Error('No authentication token');

            const response = await fetch(`${API_BASE_URL}/workout-plans/today`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response);

            if (!response.ok) throw new Error('Failed to fetch today’s workout');

            return await response.json();
        } catch (error) {
            console.error('Error fetching today’s workout:', error);
            throw error;
        }
    }
};
