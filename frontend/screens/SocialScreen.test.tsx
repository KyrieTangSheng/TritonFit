import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import SocialScreen from "../screens/SocialScreen";
import axios from "axios";
import { getAuthToken } from "../sched_src/auth";

jest.mock("axios");
jest.mock("../sched_src/auth", () => ({
    getAuthToken: jest.fn(() => Promise.resolve("mock-token")), // Mock return value
}));

describe("SocialScreen - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render correctly in the beginning", () => {
    render(<SocialScreen setCurrentScreen={jest.fn()} />);
    expect(screen.getByText(
        "This Function aims to match your with Gym Mates that have similar characteristics \
        with you, including same gym, similiar fitness goals, and sharing compatible workout schedules."
    )).toBeTruthy();
  });
});

const mockedGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

describe("SocialScreen - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAuthToken.mockResolvedValue("mock-token"); // Ensure the mocked getAuthToken resolves before rendering
  });

  test("Display recommendation", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        recommendations: [
          {
            username: "gymUser1",
            preferences: { fitness_level: 3, workout_categories: ["Strength"], workout_types: ["Core"], username: "gymUser1" },
            similarity: 0.9,
          },
        ],
      },
    });

    render(<SocialScreen setCurrentScreen={jest.fn()} />);
    
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText("gymUser1")).toBeTruthy());
  });
});
