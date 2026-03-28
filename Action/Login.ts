"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { LoginInterface } from "@/Interface/Login";

export async function User_Register_Login(params: LoginInterface) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_Send_OTP/login_user`,
      {
        email: params.email,
        password: params.password,
      }
    );

   
    (await
      cookies()).set("token", response.data.token, {
      httpOnly: true,
       secure: process.env.NODE_ENV === "production",  
      path: "/",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    return {   
      status: "success",
      message: response.data.message,
      role: response.data.role,
    };

  } catch (error: unknown) {
    return {
      status: "error",
      message:"Login failed",
    };
  }
}
