import {History} from 'history';

export function updateSearchParams(params: Record<string, string>, history: History) {
    const searchParams = new URLSearchParams(history.location.search);
    Object.entries(params).forEach(([k, v]) => {
        if (k === 'p' && v === '1') {
            searchParams.delete('p');
        } else {
            searchParams.set(k, v);
        }
    });
    searchParams.sort();
    history.push({pathname: history.location.pathname, search: searchParams.toString()});
}
