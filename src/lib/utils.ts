export const getTypedError = (error: unknown) => {
    if (error instanceof Error) return error
    return String(error)
}
