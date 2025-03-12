import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import axios from "axios";
import { Alert } from "react-native";
import { setAuthToken } from "../sched_src/auth";

jest.mock("axios");
jest.mock("../sched_src/auth", () => ({
  setAuthToken: jest.fn(),
}));

describe("LoginScreen - Unit Tests", () => {
  const mockSetIsLoggedIn = jest.fn();
  const mockSetCurrentScreen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Render correctly in the beginning", () => {
    render(<LoginScreen setIsLoggedIn={mockSetIsLoggedIn} setCurrentScreen={mockSetCurrentScreen} />);
    
    expect(screen.getByText("Username")).toBeTruthy();
    expect(screen.getByText("Password")).toBeTruthy();
    expect(screen.getByText("Log In")).toBeTruthy();
  });

  test("Enter username and password", () => {
    render(<LoginScreen setIsLoggedIn={mockSetIsLoggedIn} setCurrentScreen={mockSetCurrentScreen} />);
    
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(passwordInput, "testpass");

    expect(usernameInput.props.value).toBe("testuser");
    expect(passwordInput.props.value).toBe("testpass");
  });
});

describe("LoginScreen - Integration Tests", () => {
  const mockSetIsLoggedIn = jest.fn();
  const mockSetCurrentScreen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Handle successful login", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { access_token: "mock-token" } });

    render(<LoginScreen setIsLoggedIn={mockSetIsLoggedIn} setCurrentScreen={mockSetCurrentScreen} />);
    
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(passwordInput, "testpass");
    
    fireEvent.press(screen.getByText("Log In"));

    await waitFor(() => expect(setAuthToken).toHaveBeenCalledWith("mock-token"));
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    expect(mockSetCurrentScreen).toHaveBeenCalledWith("Home");
  });

  test("Shlow an alert when login fails", async () => {
    jest.spyOn(Alert, "alert");
    (axios.post as jest.Mock).mockRejectedValue({ response: { status: 401 } });

    render(<LoginScreen setIsLoggedIn={mockSetIsLoggedIn} setCurrentScreen={mockSetCurrentScreen} />);

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    
    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(passwordInput, "testpass");
    
    fireEvent.press(screen.getByText("Log In"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed", "Cannot find that combination of username and password.")
    );
  });
});
