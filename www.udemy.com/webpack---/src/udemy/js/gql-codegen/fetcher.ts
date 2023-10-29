import Cookies from 'js-cookie';

const populateAcceptLanguageHeader = () => {
    const cookies = Cookies.getJSON() || {};

    if (cookies.ud_locale) {
        // Convert locale string to Accept-Language standard
        const udLocaleConverted = cookies.ud_locale.split('_').join('-');
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Accept-Language': udLocaleConverted,
        };
    }
};

export const fetchData = <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit['headers'],
): (() => Promise<TData>) => {
    return async () => {
        /**
         * Because of the graphql-codegen library, we're not able to change the signature of this function. It's hard
         * coded to the codegen itself. So we couldn't change the options parameter to RequestInit.
         * Introduced in this https://github.com/dotansimha/graphql-code-generator/pull/7371
         *
         * Therefore, we needed to implicitly give the signal parameter to options
         */
        let signal: AbortSignal | undefined;
        if (options && '_signal' in options) {
            signal = (options._signal as unknown) as AbortSignal;
            delete options._signal;
        }

        const res = await fetch('/api/2022-03/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...populateAcceptLanguageHeader(),
                ...(options ?? {}),
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            signal,
        });
        const json = await res.json();

        if (json.errors) {
            const {message} = json.errors[0] || 'Error..';
            throw new Error(message);
        }

        return json.data;
    };
};
