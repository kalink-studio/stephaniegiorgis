import { draftMode } from 'next/headers';

export async function GET() {
  const draft = await draftMode();
  draft.disable();

  return Response.json({ draft: false });
}
