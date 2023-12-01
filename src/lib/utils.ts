export const getTypedError = (error: unknown) => {
    if (error instanceof Error) return error
    return String(error)
}

export const timeoutIntervalSeconds = 1;

export const currentTime = (): number => Math.floor(Date.now() / 1000);

export const nextInterval = (): number => currentTime() + timeoutIntervalSeconds;


// export const secondFromTime = (time: number): number => time + 1;
