export interface WeeklySlot {
    day_of_week: number;  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    start_time: string;   // Format: "HH:MM:SS"
    end_time: string;     // Format: "HH:MM:SS"
}

export interface ScheduleEvent {
    _id: string;
    user_id: string;
    weekly_slots: WeeklySlot[];
    created_at: string; //"2024-01-01T00:00:00",
    updated_at: string; //"2024-01-01T00:00:00"
}