import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
    func: () => Promise<T>,
    deps: any[] = []
) {
    const [state, seState] = useState<T | undefined>()
    useEffect(() => {
        (async () => {
            seState(await func())
        })()
    }, deps)
    return state
}