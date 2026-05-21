import { render, screen, fireEvent } from "@testing-library/react";
import SignupPage from "./SignupPage";

describe("SignupPage Component", () => {

  test("renders heading", () => {
    render(<SignupPage />);

    expect(
      screen.getByText("Create your account")
    ).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(<SignupPage />);

    expect(
      screen.getByText("Join the AI medical assistant platform")
    ).toBeInTheDocument();
  });

  test("renders all input fields", () => {
    render(<SignupPage />);

    expect(
      screen.getByPlaceholderText("Enter your full name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Create a password")
    ).toBeInTheDocument();
  });

  test("renders create account button", () => {
    render(<SignupPage />);

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      })
    ).toBeInTheDocument();
  });

  test("renders social login buttons", () => {
    render(<SignupPage />);

    expect(
      screen.getByText("Continue with Google")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Continue with GitHub")
    ).toBeInTheDocument();
  });

  test("allows typing in full name input", () => {
    render(<SignupPage />);

    const input = screen.getByPlaceholderText(
      "Enter your full name"
    );

    fireEvent.change(input, {
      target: { value: "Aadinath" },
    });

    expect(input.value).toBe("Aadinath");
  });

  test("allows typing in email input", () => {
    render(<SignupPage />);

    const input = screen.getByPlaceholderText(
      "Enter your email"
    );

    fireEvent.change(input, {
      target: { value: "test@gmail.com" },
    });

    expect(input.value).toBe("test@gmail.com");
  });

});