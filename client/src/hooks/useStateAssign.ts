import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { assign } from "../tools/object/objectUtils";

type ReturnType<T> = [value: T, setValue: Dispatch<SetStateAction<T>>, assignValue: (assignable: Partial<T>) => void];

function useStateAssign<T>(defaultValue: T): ReturnType<T> {
    const [value, setValue] = useState<T>(defaultValue);

    const assignValue = useCallback((assignable: Partial<T>) => {
        setValue(actualValue => assign(actualValue, assignable));
    }, []);

    return [value, setValue, assignValue];
}

export default useStateAssign;