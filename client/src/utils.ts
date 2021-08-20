export function formatRPCError(error: unknown) {
  console.error(error);
  if (typeof error === 'object' && error != null) {
    // @ts-expect-error
    if (error.data?.message) return error.data.message;
    // @ts-expect-error
    return error.message ?? 'Unexpected error';
  }
  return 'Unexpected error';
}
