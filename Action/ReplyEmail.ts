"use server";

import type { ReplyEmailPayload, ReplyEmailResponse } from "@/Interface/ReplyEmail";
import { cookies } from "next/headers"; // ✅ Add this

export async function sendReplyEmail(
  data: ReplyEmailPayload
): Promise<ReplyEmailResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // ✅ Build FormData so file binary is properly transmitted
    const formData = new FormData();
    formData.append("fromEmail", data.fromEmail);
    formData.append("toEmail", data.toEmail);
    formData.append("subject", data.subject);
    formData.append("body", data.body);
    formData.append("inReplyTo", data.inReplyTo);
    formData.append("emailId", data.emailId.toString());
    if (data.file) {
      formData.append("file", data.file); 
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/replyEmail/saveReplyEmail`,
      {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData, // ✅ Send FormData, not JSON.stringify
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

// export async function sendReplyEmail(
//   data: ReplyEmailPayload
// ): Promise<ReplyEmailResponse> {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value; // ✅ Apna cookie name yahan likho

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/replyEmail/saveReplyEmail`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }), // ✅ Token attach
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     const result = await response.json();

//     return {
//       success: true,
//       data: result,
//     };
//   } catch (error) {
//     console.error("Reply Email Error:", error);
//     return {
//       success: false,
//       message: "Failed to send reply",
//     };
//   }
// }