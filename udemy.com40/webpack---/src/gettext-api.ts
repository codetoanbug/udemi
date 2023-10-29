import Gettext from 'node-gettext';

import {CompactTranslations, GettextApi} from './types';

export function createGettextApi(translations: CompactTranslations, lang: string): GettextApi {
    // Instantiate Gettext object
    const gt = new Gettext();
    const domain = 'messages';
    const gtTranslations: Record<string, unknown> = {'': {}};
    for (const [key, value] of Object.entries(translations)) {
        const valueAsObj = value as unknown as {msgctxt: unknown};
        if (valueAsObj.msgctxt) {
            gtTranslations[key] = value;
        } else {
            const translationContext = gtTranslations[''] as Record<string, unknown>;
            const normalizedValue = typeof value === 'string' ? [value] : value;
            translationContext[key] = {
                comments: {},
                msgid: key,
                msgstr: normalizedValue,
            };
        }
    }

    const getTextTranslations = {
        charset: 'utf-8',
        translations: gtTranslations,
    };
    gt.addTranslations(lang, domain, getTextTranslations);
    gt.setLocale(lang);

    const interpolate = (e: string, t: unknown, n?: boolean) => {
        if (n) {
            return e.replace(/%\(\w+\)s/g, function (e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return String((t as any)[e.slice(2, -2)]);
            });
        } else {
            return e.replace(/%s/g, function () {
                return String((t as number[]).shift());
            });
        }
    };

    const ninterpolate = (
        singular: string,
        plural: string,
        count: number,
        namedContext: unknown,
    ) => {
        let context: number[] | unknown = [count];
        let named = false;

        if (namedContext) {
            context = namedContext;
            named = true;
        }

        // eslint-disable-next-line @udemy/no-variable-string
        return interpolate(gt.ngettext(singular, plural, count), context, named);
    };

    // *** IMPORTANT ***
    // These APIs need to be bound to the Gettext object, otherwise we will run into scoping issues when trying
    // to use them as desctructured functions, such as const {gettext} = useI18n()
    return {
        gettext: gt.gettext.bind(gt),
        dgettext: gt.dgettext.bind(gt),
        dngettext: gt.dngettext.bind(gt),
        dpgettext: gt.dpgettext.bind(gt),
        ngettext: gt.ngettext.bind(gt),
        npgettext: gt.npgettext.bind(gt),
        pgettext: gt.pgettext.bind(gt),
        interpolate,
        ninterpolate,
    };
}
