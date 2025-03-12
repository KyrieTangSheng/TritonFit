import { API_BASE_URL } from './config';
import { getAuthToken } from './auth';
import { WorkoutDetails, Workout, WorkoutItem, Exercise } from './workoutplanEvent';
// import { PLAN_ID } from './config'; // need to get from Ruolan
// import { GET_RESPONSE } from './config'; // need to get from Ruolan

export const workoutPlanCalls = {
    // Update today's workout
    async updateWorkoutToday(workout: Workout, plan_id: string, day: string): Promise<WorkoutDetails> {
        const token = await getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/workout-plans/${plan_id}/days/${day}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workout_items: workout.workout_items,
                location: workout.location,
                time: workout.time,
            }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Authentication required');
            else if (response.status === 404) throw new Error('Workout not found');
            else if (response.status === 422) throw new Error('Invalid workout data');
            throw new Error('Failed to update workout');
        }

        const updatedWorkoutData = await response.json();
        return updatedWorkoutData;  // Transform this if necessary
    },
};