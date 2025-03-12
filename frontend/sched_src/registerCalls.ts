import { API_BASE_URL } from './config';

// Define the registration request body
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  profile: {
    dob: string;
    gender: string;
    fitness_level: number;
    height: number;
    weight: number;
    workout_location: string;
    workout_categories: string[];
    workout_types: string[];
  };
}

// Register User Function
export const registerUser = async (registerData: RegisterRequest): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });
    const responseData = await response.json();
    if (!response.ok) {
      // Check if the response has a "detail" field and extract error messages
      if (response.status === 422 && responseData.detail) {
        const errorMessages = responseData.detail.map((err: any) => err.msg).join('\n');
        return { success: false, message: errorMessages };
      }

      return { success: false, message: responseData.message || 'Failed to register user.' };
    }

    return { success: true, message: 'Registration successful!' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }

};


