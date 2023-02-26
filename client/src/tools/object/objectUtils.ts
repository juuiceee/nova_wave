export const assign = <T>(target: T, assignable: Partial<T>): T => {
    const emptyClone = new ((target as any).constructor)();
    return Object.assign(emptyClone, target, assignable);
}