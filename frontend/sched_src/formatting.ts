// Define TypeScript types for better structure

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps_per_set: number | null; // Allow null values
    rest_between_sets: string;
    equipment: string[];
    difficulty: string;
    notes: string;
};

export type WorkoutItem = {
    id: string;
    type: string;
    duration: string;
    exercises: Exercise[];
};

export type Workout = {
    location: string;
    time: string;
    workout_items: WorkoutItem[];
};

export type WorkoutData = {
    plan_id: string;
    day: string;
    workout: Workout;
};

export const formatWorkoutData = (workoutData: WorkoutData) => {
    if (workoutData.workout.location == null) return false;
    return {
        plan_id: workoutData.plan_id,
        day: workoutData.day,
        workout: {
            location: workoutData.workout.location,
            time: workoutData.workout.time,
            workout_items: workoutData.workout.workout_items.map((item) => ({
                id: item.id,
                type: item.type,
                duration: item.duration,
                exercises: item.exercises.map(({
                    id,
                    name,
                    sets,
                    reps_per_set,
                    rest_between_sets,
                    equipment,
                    difficulty,
                    notes,
                }) => ({
                    id,
                    name,
                    sets,
                    reps_per_set, // Maintain null if applicable
                    rest_between_sets,
                    equipment,
                    difficulty,
                    notes,
                })),
            })),
        },
    };
};
