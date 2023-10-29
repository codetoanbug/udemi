export function ordinal(number: number) {
    // JS version of Django's `ordinal` template tag.
    // https://github.com/django/django/blob/2da029d8540ab0b2e9edcba25c4d46c52853197f/django/contrib/humanize/templatetags/humanize.py#L19-L57
    // Our l10n system does not support the same string in multiple contexts.
    // We work around this by using `%(0)s`, `%(1)s`, etc to make the strings unique,
    // and a custom interpolation that replaces `%(x)s` with `number`.
    const templates = [
        pgettext('Ordinal format when value ends with 0, e.g. 80th', '%(0)sth'),
        pgettext('Ordinal format when value ends with 1, e.g. 81st, except 11', '%(1)sst'),
        pgettext('Ordinal format when value ends with 2, e.g. 82nd, except 12', '%(2)snd'),
        pgettext('Ordinal format when value ends with 3, e.g. 83rd, except 13', '%(3)srd'),
        pgettext('Ordinal format when value ends with 4, e.g. 84th', '%(4)sth'),
        pgettext('Ordinal format when value ends with 5, e.g. 85th', '%(5)sth'),
        pgettext('Ordinal format when value ends with 6, e.g. 86th', '%(6)sth'),
        pgettext('Ordinal format when value ends with 7, e.g. 87th', '%(7)sth'),
        pgettext('Ordinal format when value ends with 8, e.g. 88th', '%(8)sth'),
        pgettext('Ordinal format when value ends with 9, e.g. 89th', '%(9)sth'),
    ];
    const template =
        number % 100 >= 11 && number % 100 <= 13
            ? pgettext('Ordinal format for 11 (11th), 12 (12th), and 13 (13th)', '%(11,12,13)sth')
            : templates[number % 10];

    return template.replace(/%\([\d,]+\)s/g, `${number}`);
}
