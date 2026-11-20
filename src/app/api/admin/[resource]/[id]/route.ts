import { NextResponse } from "next/server";
import { getDelegate, guard, prismaError, resourceSchemas, revalidateSite } from "@/lib/admin-server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { resource, id } = await params;
  const denied = await guard(resource);
  if (denied) return denied;

  const parsed = resourceSchemas[resource].safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });

  try {
    const row = await getDelegate(resource)!.update({ where: { id }, data: parsed.data });
    revalidateSite();
    return NextResponse.json({ data: row });
  } catch (err) {
    return prismaError(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { resource, id } = await params;
  const denied = await guard(resource);
  if (denied) return denied;
  try {
    await getDelegate(resource)!.delete({ where: { id } });
    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return prismaError(err);
  }
}
