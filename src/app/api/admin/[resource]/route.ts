import { NextResponse } from "next/server";
import { getDelegate, guard, orderBy, prismaError, resourceSchemas, revalidateSite } from "@/lib/admin-server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { resource } = await params;
  const denied = await guard(resource);
  if (denied) return denied;
  try {
    const rows = await getDelegate(resource)!.findMany({ orderBy: orderBy[resource] });
    return NextResponse.json({ data: rows });
  } catch (err) {
    return prismaError(err);
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const denied = await guard(resource);
  if (denied) return denied;
  if (resource === "messages") return NextResponse.json({ error: "Messages come from the contact form." }, { status: 405 });

  const parsed = resourceSchemas[resource].safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });

  try {
    const row = await getDelegate(resource)!.create({ data: parsed.data });
    revalidateSite();
    return NextResponse.json({ data: row }, { status: 201 });
  } catch (err) {
    return prismaError(err);
  }
}
