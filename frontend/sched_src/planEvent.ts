import { gymPlanApi } from './getPlanCalls';
import { formatWorkoutData } from "./formatting";

export const gymPlanService = {
    // async generateWorkoutPlan() {
    //     const planId = await gymPlanApi.createWorkoutPlan();
    //     return planId;
    // },

    async fetchTodayWorkoutPlan() {
        const workoutData = await gymPlanApi.getTodayWorkout();
        console.log(workoutData);
        return formatWorkoutData(workoutData);
    },
};


// export const gymPlanService = {
//     // async generateWorkoutPlan() {
//     //     const planId = await gymPlanApi.createWorkoutPlan();
//     //     return planId;
//     // },

//     fetchTodayWorkoutPlan() {
//         const workoutData = {
//             "plan_id": "7f2a0131-f5cd-40a1-b237-1c6a172baf68",
//             "day": "Wednesday",
//             "workout": {
//                 "workout_items": [
//                     {
//                         "id": "2b5e818c-8307-4704-8e7d-dcfae9aa6c7b",
//                         "type": "cardio",
//                         "duration": "60 min",
//                         "exercises": [
//                             {
//                                 "id": "ee1f9f99-af3f-41a0-8e65-085bcba95e74",
//                                 "name": "Running intervals",
//                                 "sets": 5,
//                                 "reps_per_set": 1,
//                                 "rest_between_sets": "60 sec",
//                                 "equipment": [
//                                     "none"
//                                 ],
//                                 "difficulty": "advanced",
//                                 "notes": "400m sprint followed by 2 min rest"
//                             },
//                             {
//                                 "id": "ee",
//                                 "name": "Boxing",
//                                 "sets": 3,
//                                 "reps_per_set": 50,
//                                 "rest_between_sets": "1 min",
//                                 "equipment": [
//                                     "boxer"
//                                 ],
//                                 "difficulty": "advanced",
//                                 "notes": "400m sprint followed by 2 min rest"
//                             },{
//                                 "id": "ee0-8e65-085bcba95e74",
//                                 "name": "Running intervals",
//                                 "sets": 5,
//                                 "reps_per_set": 1,
//                                 "rest_between_sets": "60 sec",
//                                 "equipment": [
//                                     "none"
//                                 ],
//                                 "difficulty": "advanced",
//                                 "notes": "400m sprint followed by 2 min rest"
//                             },
//                         ]
//                     }
//                 ],
//                 "location": "Park",
//                 "time": "7:00-8:00AM"
//             }
//         };
//         return formatWorkoutData(workoutData);
//     },
// };