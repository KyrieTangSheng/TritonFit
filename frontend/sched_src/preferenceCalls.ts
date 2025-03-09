// import { getAuthToken } from './auth'; // Token management
// import { API_BASE_URL } from './config';

// // Type definition for user preferences
// export interface PreferenceSetting
// {
//     dob: string,
//     gender: string,
//     fitness_level: number,
//     height: number,
//     weight: number,
//     workout_location: string,
//     workout_categories: string[],
//     workout_types: string[],
//   }

// export const getPreferences = async (): Promise<PreferenceSetting> => {
//   try {
//     const token = await getAuthToken();
//     if (!token) throw new Error('No authentication token');

//     const response = await fetch(`${API_BASE_URL}/users/profile`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     const preferenceData = await response.json();
//     if (!response.ok) {
//       if (response.status === 401) throw new Error('Authentication required');
//       throw new Error(`Failed to fetch schedule: ${response.status} ${preferenceData}`);
      
//     }
//     const preference: PreferenceSetting = {
//       dob: preferenceData.dob,
//       gender: preferenceData.gender,
//       fitness_level: preferenceData.fitness_level,
//       height: preferenceData.height,
//       weight: preferenceData.weight,
//       workout_location: preferenceData.workout_location,
//       workout_categories: preferenceData.workout_categories,
//       workout_types: preferenceData.workout_types
//     };
    
//     return preference;
    
//     } catch (error) {
//     console.error('Error fetching preferences:', error);
//     throw error;
//   }
// };

// export const updatePreferences = async (preferences: PreferenceSetting): Promise<void> => {
//   try {
//     const token = await getAuthToken();
//     if (!token) throw new Error('No authentication token');

//     const response = await fetch(`${API_BASE_URL}/users/profile`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(preferences),
//     });

//     if (!response.ok) {
//       if (response.status === 401) throw new Error('Authentication required');
//       else if (response.status === 422) throw new Error('Invalid schedule data');
//       const errorData = await response.json();
//       throw new Error(`Failed to update preferences: ${errorData.message || errorData}`);
//     }
//   } catch (error) {
//     console.error('Error updating preferences:', error);
//     throw error;
//   }
// };







import { getAuthToken } from './auth'; // Token management
import { API_BASE_URL } from './config';

// Type definition for user preferences
export interface PreferenceSetting
{
    dob: string,
    gender: string,
    fitness_level: number,
    height: number,
    weight: number,
    workout_location: string,
    workout_categories: string[],
    workout_types: string[],
  }

export const getPreferences = async (): Promise<PreferenceSetting> => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huIiwiZXhwIjoxNzQxMzE1MjY5fQ.7DO1X8lXJ7TFtl3wVdyVJbD3-RF2SDGBjWjpzEY_kFA';
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const preferenceData = await response.json();
    if (!response.ok) {
      if (response.status === 401) throw new Error('Authentication required');
      throw new Error(`Failed to fetch schedule: ${response.status} ${preferenceData}`);
      
    }
    const preference: PreferenceSetting = {
      dob: preferenceData.dob,
      gender: preferenceData.gender,
      fitness_level: preferenceData.fitness_level,
      height: preferenceData.height,
      weight: preferenceData.weight,
      workout_location: preferenceData.workout_location,
      workout_categories: preferenceData.workout_categories,
      workout_types: preferenceData.workout_types
    };
    
    return preference;
    
    } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};

export const updatePreferences = async (preferences: PreferenceSetting): Promise<void> => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huIiwiZXhwIjoxNzQxMzE1MjY5fQ.7DO1X8lXJ7TFtl3wVdyVJbD3-RF2SDGBjWjpzEY_kFA';
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Authentication required');
      else if (response.status === 422) throw new Error('Invalid schedule data');
      const errorData = await response.json();
      throw new Error(`Failed to update preferences: ${errorData.message || errorData}`);
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};
