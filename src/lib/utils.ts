export const getTypedError = (error: unknown) => {
    if (error instanceof Error) return error
    return String(error)
}

export const currentTime = (): number => Math.floor(Date.now() / 1000);

export const minuteFromNow = (): number => currentTime() + 60;

export const minuteFromTime = (time: number): number => time + 60;
