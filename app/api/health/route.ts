import { OLLAMA_BASE_URL } from "@/lib/ai/config";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/tags`, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json({ online: false }, { status: 200 });
    }

    const data = (await res.json()) as { models?: { name: string }[] };
    return Response.json({
      online: true,
      models: data.models?.map((m) => m.name) ?? [],
    });
  } catch {
    return Response.json({ online: false }, { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}
