"use server";
import { cookies } from "next/headers";
import axios from "axios";

export async function sendRemark(payload: {
  emailId: number;
  remark: string;
}) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      console.log("No token found");
      return { success: false, data: [] };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/remark/sendRemark`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getRemark(payload: {
  emailId: number;
}) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      console.log("No token found");
      return { success: false, data: [] };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/remark/getRemark`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}
