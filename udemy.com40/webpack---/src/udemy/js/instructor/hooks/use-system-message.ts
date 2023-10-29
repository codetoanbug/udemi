import {AxiosResponse} from 'axios';
import {useEffect, useState} from 'react';

import UdSystemMessage from 'utils/ud-system-message';

export function useSystemMessage(
    id: keyof typeof UdSystemMessage.ids,
): [() => Promise<AxiosResponse<boolean>>, () => Promise<AxiosResponse<null>>] {
    const key = UdSystemMessage.ids[id];
    return [() => UdSystemMessage.hasSeen(key), () => UdSystemMessage.seen(key)];
}
export function useSystemMessageWithOpenFlag(
    id: keyof typeof UdSystemMessage.ids,
): [boolean, () => void] {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [hasSeen, setSeen] = useSystemMessage(id);
    useEffect(
        (() => {
            hasSeen().then((response: AxiosResponse<boolean>) => {
                if (!response.data) setOpen(true);
            });
        }) as VoidFunction,
        [],
    );
    return [
        isOpen,
        () => {
            setSeen().then();
            setOpen(false);
        },
    ];
}
