"use server";
import { cookies } from "next/headers";
import axios from "axios";
export async function getAssignedEmails(userId: string) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      console.log("No token found");
      return { status: "error", data: [] };
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/emailAssign/get_my_assign_email`,
      { userId: String(userId) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;   
  } catch (error) {
    console.error(error);
    return { status: "error", data: [] };
  }
}

