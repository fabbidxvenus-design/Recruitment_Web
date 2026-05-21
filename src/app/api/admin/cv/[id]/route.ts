import { NextResponse } from 'next/server'
import { downloadAdminCv } from '@/lib/admin/cv'
import { requireAdmin } from '@/lib/auth/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin.success) {
    return NextResponse.json(admin, { status: 401 })
  }

  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'CV not found' } }, { status: 404 })
  }

  const cv = await downloadAdminCv(id)
  if (!cv) {
    return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'CV not found' } }, { status: 404 })
  }

  return new NextResponse(cv.body, {
    headers: {
      'content-disposition': `inline; filename="${cv.filename.replaceAll('"', '')}"`,
      'content-type': cv.mimeType,
      'x-content-type-options': 'nosniff'
    }
  })
}
