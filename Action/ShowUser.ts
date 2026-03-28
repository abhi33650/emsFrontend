"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getUserData (){
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
     if (!token) {
      return {
        status: "error",
        message: "No token found",
        data: [],
      };
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getALLUsers/get_ALL_Users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log("API RESPONSE:", response.data); 

    return {
      status: "success",
      data: response.data.data,
    };
  } catch (error: unknown) {
    return {
      status: "error",
      message: "Failed to fetch Users ",
      data: [],
    };
  }
}
