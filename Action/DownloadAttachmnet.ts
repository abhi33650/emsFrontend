"use server";
import { cookies } from "next/headers";

export async function getAttachmentDownload(id: number): Promise<{ url: string; token: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    return {
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/showattachment/download`,
      token,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}