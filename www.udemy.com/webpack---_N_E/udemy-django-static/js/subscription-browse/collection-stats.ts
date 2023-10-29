import {UDData} from '@udemy/ud-data';

import {formatCurrencyGlobal as formatCurrency} from 'src/lib/format-currency-global';
import getConfigData from 'udemy-django-static/js/utils/get-config-data';

export interface PersonalPlanCollectionStats {
    courses: number;
    avgRating: number;
    instructors: number;
    practiceExercises: number;
    practiceTestCourses: number;
    englishCourses?: number;
}

/* eslint-disable @typescript-eslint/naming-convention */
export const PP_COLLECTION_STATS: {[locale: string]: PersonalPlanCollectionStats} = {
    en_US: {
        courses: 10500,
        avgRating: 4.4,
        instructors: 3000,
        practiceExercises: 4000,
        practiceTestCourses: 136,
    },
    es_ES: {
        courses: 1500,
        avgRating: 4.5,
        instructors: 740,
        practiceExercises: 400,
        practiceTestCourses: 10,
    },
    pt_BR: {
        courses: 1300,
        avgRating: 4.6,
        instructors: 650,
        practiceExercises: 180,
        practiceTestCourses: 9,
    },
    de_DE: {
        courses: 800,
        avgRating: 4.5,
        instructors: 360,
        practiceExercises: 130,
        practiceTestCourses: 5,
    },
};

export interface PersonalPlanPricing {
    annualPerMonth: number;
    annualSavings: number;
}

export const PP_PRICING: {
    [priceCountry: string]: PersonalPlanPricing;
} = {
    US: {
        annualPerMonth: 16.58,
        annualSavings: 160,
    },
    GB: {
        annualPerMonth: 15,
        annualSavings: 143,
    },
    AU: {
        annualPerMonth: 19,
        annualSavings: 131,
    },
    ZA: {
        annualPerMonth: 183,
        annualSavings: 1992,
    },
};

export const getPersonalPlanPrice = (
    stat: keyof PersonalPlanPricing,
    format = true,
    globalOverrides: Partial<UDData> = {},
) => {
    const priceCountry =
        globalOverrides.Config?.price_country.id ?? getConfigData().price_country.id;
    const value = PP_PRICING[priceCountry][stat];
    return format ? (formatCurrency(value) as string) : String(value);
};

export const getPersonalPlanCollectionStats = (locale = 'en_US') => {
    let stats: PersonalPlanCollectionStats = {...PP_COLLECTION_STATS.en_US};
    if (locale in PP_COLLECTION_STATS) {
        stats = {...PP_COLLECTION_STATS[locale]};
        if (locale !== 'en_US') {
            stats.englishCourses = PP_COLLECTION_STATS.en_US.courses;
        }
    }
    return stats;
};
