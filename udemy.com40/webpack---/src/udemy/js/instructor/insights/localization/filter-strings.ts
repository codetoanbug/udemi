export const LANGUAGE_FILTER_DATA = {
    title: 'Course language',
    options: [
        {key: 'za', value: gettext('Afrikaans')}, // South Africa
        {key: 'al', value: gettext('Albanian')}, // Albania
        {key: 'sa', value: gettext('Arabic')}, // Saudi Arabia
        {key: 'am', value: gettext('Armenian')}, // Armenia
        {key: 'bo', value: gettext('Aymara')}, // Bolivia
        {key: 'az', value: gettext('Azeri')}, // Azerbaijan
        {key: 'bes', value: gettext('Basque')}, // Spain
        {key: 'bd', value: gettext('Bengali')}, // Bangladesh
        {key: 'ba', value: gettext('Bosnian')}, // Bosnia and Herzegovina
        {key: 'bg', value: gettext('Bulgarian')}, // Bulgaria
        {key: 'mm', value: gettext('Burmese')}, // Myanmar (Burma)
        {key: 'es', value: gettext('Catalan')}, // Spain
        {key: 'us', value: gettext('Cherokee')}, // United States
        {key: 'cn', value: gettext('Chinese')}, // China
        {key: 'hr', value: gettext('Croatian')}, // Croatia
        {key: 'cz', value: gettext('Czech')}, // Czech Republic
        {key: 'dk', value: gettext('Danish')}, // Denmark
        {key: 'be', value: gettext('Dutch (België)')}, // Belgium
        {key: 'dnl', value: gettext('Dutch')}, // Netherlands
        {key: 'in', value: gettext('English (India)')}, // India
        {key: 'gbu', value: gettext('English (UK)')}, // United Kingdom
        {key: 'usu', value: gettext('English (US)')}, // United States
        {key: 'use', value: gettext('English')}, // United States
        {key: 'ee', value: gettext('Estonian')}, // Estonia
        {key: 'fo', value: gettext('Faroese')}, // Faroe Islands
        {key: 'ph', value: gettext('Filipino')}, // Philippines
        {key: 'fi', value: gettext('Finnish')}, // Finland
        {key: 'ca', value: gettext('French (Canada)')}, // Canada
        {key: 'frf', value: gettext('French (France)')}, // France
        {key: 'fr', value: gettext('French')}, // France
        {key: 'nl', value: gettext('Frisian')}, // Netherlands
        {key: 'ges', value: gettext('Galician')}, // Spain
        {key: 'ge', value: gettext('Georgian')}, // Georgia
        {key: 'de', value: gettext('German')}, // Germany
        {key: 'gr', value: gettext('Greek')}, // Greece
        {key: 'py', value: gettext('Guaraní')}, // Paraguay
        {key: 'gin', value: gettext('Gujarati')}, // India
        {key: 'ht', value: gettext('Haitian')}, // Haiti
        {key: 'il', value: gettext('Hebrew')}, // Israel
        {key: 'hin', value: gettext('Hindi')}, // India
        {key: 'hu', value: gettext('Hungarian')}, // Hungary
        {key: 'is', value: gettext('Icelandic')}, // Iceland
        {key: 'id', value: gettext('Indonesian')}, // Indonesia
        {key: 'ie', value: gettext('Irish')}, // Ireland
        {key: 'it', value: gettext('Italian')}, // Italy
        {key: 'jp', value: gettext('Japanese')}, // Japan
        {key: 'idj', value: gettext('Javanese')}, // Indonesia
        {key: 'kin', value: gettext('Kannada')}, // India
        {key: 'kz', value: gettext('Kazakh')}, // Kazakhstan
        {key: 'kh', value: gettext('Khmer')}, // Cambodia
        {key: 'kr', value: gettext('Korean')}, // South Korea
        {key: 'iq', value: gettext('Kurdish')}, // Iraq
        {key: 'lv', value: gettext('Latvian')}, // Latvia
        {key: 'lnl', value: gettext('Limburgish')}, // Netherlands
        {key: 'lt', value: gettext('Lithuanian')}, // Lithuania
        {key: 'mk', value: gettext('Macedonian')}, // North Macedonia
        {key: 'mg', value: gettext('Malagasy')}, // Madagascar
        {key: 'my', value: gettext('Malay')}, // Malaysia
        {key: 'ml', value: gettext('Malayalam')}, // Maldives
        {key: 'mt', value: gettext('Maltese')}, // Malta
        {key: 'min', value: gettext('Marathi')}, // India
        {key: 'mn', value: gettext('Mongolian')}, // Mongolia
        {key: 'np', value: gettext('Nepali')}, // Nepal
        {key: 'no', value: gettext('Northern Sámi')}, // Norway
        {key: 'nob', value: gettext('Norwegian (bokmal)')}, // Norway
        {key: 'non', value: gettext('Norwegian (nynorsk)')}, // Norway
        {key: 'nor', value: gettext('Norwegian')}, // Norway
        {key: 'af', value: gettext('Pashto')}, // Afghanistan
        {key: 'ir', value: gettext('Persian')}, // Iran
        {key: 'pl', value: gettext('Polish')}, // Poland
        {key: 'br', value: gettext('Portuguese (Brazil)')}, // Brazil
        {key: 'ptp', value: gettext('Portuguese (Portugal)')}, // Portugal
        {key: 'pt', value: gettext('Portuguese')}, // Portugal
        {key: 'pin', value: gettext('Punjabi')}, // India
        {key: 'pe', value: gettext('Quechua')}, // Peru
        {key: 'ro', value: gettext('Romanian')}, // Romania
        {key: 'ch', value: gettext('Romansh')}, // Switzerland
        {key: 'ru', value: gettext('Russian')}, // Russia
        {key: 'sin', value: gettext('Sanskrit')}, // India
        {key: 'rs', value: gettext('Serbian')}, // Serbia
        {key: 'scn', value: gettext('Simplified Chinese (China)')}, // China
        {key: 'sk', value: gettext('Slovak')}, // Slovakia
        {key: 'si', value: gettext('Slovenian')}, // Slovenia
        {key: 'so', value: gettext('Somali')}, // Somalia
        {key: 'cl', value: gettext('Spanish (Chile)')}, // Chile
        {key: 'co', value: gettext('Spanish (Colombia)')}, // Colombia
        {key: 'mx', value: gettext('Spanish (Mexico)')}, // Mexico
        {key: 'ses', value: gettext('Spanish (Spain)')}, // Spain
        {key: 've', value: gettext('Spanish (Venezuela)')}, // Venezuela
        {key: 'ess', value: gettext('Spanish')}, // Spain
        {key: 'tz', value: gettext('Swahili')}, // Tanzania
        {key: 'se', value: gettext('Swedish')}, // Sweden
        {key: 'sy', value: gettext('Syriac')}, // Syria
        {key: 'tj', value: gettext('Tajik')}, // Tajikistan
        {key: 'lk', value: gettext('Tamil')}, // Sri Lanka
        {key: 'rut', value: gettext('Tatar')}, // Russia
        {key: 'tin', value: gettext('Telugu')}, // India
        {key: 'th', value: gettext('Thai')}, // Thailand
        {key: 'hk', value: gettext('Traditional Chinese (Hong Kong)')}, // Hong
        {key: 'tw', value: gettext('Traditional Chinese (Taiwan)')}, // Taiwan
        {key: 'tr', value: gettext('Turkish')}, // Turkey
        {key: 'ua', value: gettext('Ukrainian')}, // Ukraine
        {key: 'pk', value: gettext('Urdu')}, // Pakistan
        {key: 'uz', value: gettext('Uzbek')}, // Uzbekistan
        {key: 'vn', value: gettext('Vietnamese')}, // Vietnam
        {key: 'gb', value: gettext('Welsh')}, // United Kingdom
        {key: 'zax', value: gettext('Xhosa')}, // South Africa
        {key: 'usy', value: gettext('Yiddish')}, // United States
        {key: 'zaz', value: gettext('Zulu')}, // South Africa
    ],
};

export const DOMAIN_FILTER_DATA = {
    title: 'Domain',
    options: [
        {key: 'bu', value: gettext('Business Operations')},
        {key: 'cc', value: gettext('Cloud Computing')},
        {key: 'ceu', value: gettext('Continuing Education Units')},
        {key: 'cs', value: gettext('Cybersecurity')},
        {key: 'ds', value: gettext('Data Science')},
        {key: 'de', value: gettext('Design')},
        {key: 'dev', value: gettext('Development')},
        {key: 'fa', value: gettext('Finance & Accounting')},
        {key: 'it', value: gettext('IT Operations')},
        {key: 'll', value: gettext('Language Learning')},
        {key: 'lm', value: gettext('Leadership & Management')},
        {key: 'ma', value: gettext('Marketing')},
        {key: 'op', value: gettext('Office Productivity')},
        {key: 'pd', value: gettext('Personal Development')},
        {key: 'pp', value: gettext('Project & Product Management')},
        {key: 'sa', value: gettext('Sales')},
        {key: 'whr', value: gettext('Workplace & Human Resources')},
    ],
};

export const OPPORTUNITY_TYPE_FILTER_DATA = {
    title: 'Opportunity type',
    options: [
        {key: 'fm', value: gettext('First Mover')},
        {key: 'tr', value: gettext('Trending')},
        {key: 'sp', value: gettext('Specialized')},
    ],
};

export const FINANCIAL_INCENTIVE_FILTER_DATA = {
    title: 'Financial incentive',
    options: [
        {key: 'all', value: gettext('All')},
        {key: 'fi_only', value: gettext('Financial Incentive only')},
    ],
};

export const COURSE_LEVEL_FILTER_DATA = {
    title: 'Course level',
    options: [
        {key: 'be', value: gettext('Beginner')},
        {key: 'in', value: gettext('Intermediate')},
        {key: 'ex', value: gettext('Expert')},
        {key: 'all', value: gettext('All levels')},
        {key: 'any', value: gettext('Any level')},
    ],
};

export const TOOLTIP_MESSAGE_DATA = {
    title: 'Tooltip message',
    options: [
        {
            key: 'tt_fm',
            value: gettext(
                'This subject is in demand and has limited content coverage in Udemy Business',
            ),
        },
        {
            key: 'tt_tr',
            value: gettext(
                'This subject has some coverage in Udemy Business, but there is demand for additional options',
            ),
        },
        {
            key: 'tt_sp',
            value: gettext(
                'This subject is in demand among a subset of professional learners with a specific role or function',
            ),
        },
    ],
};
