"use server";

import { cookies } from "next/headers";
import axios from "axios";

export async function getEmailData() {
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
      `${process.env.NEXT_PUBLIC_API_URL}/getAllEmails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      status: "success",
      data: response.data.data,
    };
  } catch (error: unknown) {
    return {
      status: "error",
      message: "Failed to fetch emails",
      data: [],
    };
  }
}
