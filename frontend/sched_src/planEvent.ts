import { gymPlanApi } from './getPlanCalls';
import { formatWorkoutData } from "./formatting";

export const gymPlanService = {
    async fetchTodayWorkoutPlan() {
        const workoutData = await gymPlanApi.getTodayWorkout();
        return formatWorkoutData(workoutData);
    },
};
