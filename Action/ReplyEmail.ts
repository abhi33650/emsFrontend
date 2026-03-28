"use server";

import type { ReplyEmailPayload, ReplyEmailResponse } from "@/Interface/ReplyEmail";
import { cookies } from "next/headers"; // ✅ Add this

export async function sendReplyEmail(
  data: ReplyEmailPayload
): Promise<ReplyEmailResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // ✅ Apna cookie name yahan likho

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/replyEmail/saveReplyEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // ✅ Token attach
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Reply Email Error:", error);
    return {
      success: false,
      message: "Failed to send reply",
    };
  }
}