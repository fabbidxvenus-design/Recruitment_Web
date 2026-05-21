export type ActionResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: { code: string; message: string; fieldErrors?: Record<string, string> } }
