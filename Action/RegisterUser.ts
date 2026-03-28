"use server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

type RegisterResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};
export async function User_Register(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_Send_OTP/register_Send_OTP`,
      {
        email: email,
        password: password,
      }
    );

    return {
      success: true,
      message: response.data?.message || "OTP sent successfully",
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function User_Register_verify(
  email: string,
  otp: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_Send_OTP/register_Verify_OTP`,
      {
        email: email,
        otp: otp,
      }
    );
    const cookieStore = await cookies();
    if (response.data?.token) {
      cookieStore.set("token", response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      success: true,
      message: response.data?.message || "Registration successful",
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "OTP verification failed",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

