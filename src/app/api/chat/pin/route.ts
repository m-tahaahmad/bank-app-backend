import prisma from "@/app/lib/prisma";
import { apiResponse } from "@/app/helpers/functions";
import { z } from "zod";

const schema = z.object({
  chat_id: z.string().min(1),
  user_id: z.string().min(1),
});

export async function POST(req: Request) {
  if (req.method == "POST") {
    try {
      let body = await req.json();

      const parsedData = schema.parse(body);

      const chat = await prisma.pin_chats.create({
        data: { chat_id: parsedData.chat_id, user_id: parsedData.user_id },
      });

      return apiResponse(true, chat, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return apiResponse(
          false,
          error.errors.map((e) => e.message),
          400
        );
      }
      return apiResponse(false, error, 500);
    }
  } else {
    return apiResponse(false, "Method Not Allowed", 405);
  }
}
