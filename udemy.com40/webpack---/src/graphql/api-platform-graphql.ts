import {useQuery, UseQueryOptions} from 'react-query';
import {fetchData} from './fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]?: Maybe<T[SubKey]>};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]: Maybe<T[SubKey]>};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    AccountNumber: any;
    AverageRating: any;
    BigInt: any;
    Byte: any;
    CountryCode: any;
    CourseDuration: any;
    CourseDurationInSeconds: any;
    CourseHtmlString: any;
    Cuid: any;
    Currency: any;
    DID: any;
    Date: any;
    DateTime: any;
    Decimal: any;
    Duration: any;
    EmailAddress: any;
    GUID: any;
    HSL: any;
    HSLA: any;
    HexColorCode: any;
    Hexadecimal: any;
    IBAN: any;
    IPv4: any;
    IPv6: any;
    ISBN: any;
    ISO8601Duration: any;
    JSON: any;
    JSONObject: any;
    JWT: any;
    Latitude: any;
    LocalDate: any;
    LocalEndTime: any;
    LocalTime: any;
    Locale: any;
    Long: any;
    Longitude: any;
    MAC: any;
    MaxResultsPerPage: any;
    NegativeFloat: any;
    NegativeInt: any;
    NonEmptyString: any;
    NonNegativeFloat: any;
    NonNegativeInt: any;
    NonPositiveFloat: any;
    NonPositiveInt: any;
    ObjectID: any;
    PhoneNumber: any;
    Port: any;
    PositiveFloat: any;
    PositiveInt: any;
    PostalCode: any;
    RGB: any;
    RGBA: any;
    RoutingNumber: any;
    SafeInt: any;
    Time: any;
    TimeZone: any;
    Timestamp: any;
    URL: any;
    USCurrency: any;
    UUID: any;
    UnsignedFloat: any;
    UnsignedInt: any;
    UtcOffset: any;
    Void: any;
};

/** Price option for computed price plan. Will be returned for annual plans */
export type AnnualSubscriptionPlanPricingOption = {
    __typename?: 'AnnualSubscriptionPlanPricingOption';
    /** The annual savings amount for the subscription price plan when compared to monthly plans. calculated on pricing backend can be null */
    annualSavings?: Maybe<Money>;
    /** ID of the price option: */
    id: Scalars['ID'];
    /** The list price of the subscription price plan based on provided requested count from request */
    listPrice: Money;
    /** The monthly list price of the subscription price plan. Applicable for annual plan only. Represents fraction of list price */
    monthlyPrice: Money;
    /** Interval for renewing the subscription plan ie the length of the subscription plan */
    renewalInterval: DateInterval;
    /** Field containing details about the trial subscription offer for a given user. Null indicates no trial is available */
    trial?: Maybe<SubscriptionTrial>;
};

/** Article lecture */
export type ArticleLecture = Lecture & {
    __typename?: 'ArticleLecture';
    /** Id of the lecture */
    id: Scalars['ID'];
    /** Lecture title */
    title: Scalars['String'];
};

/** Types of captions */
export enum CaptionType {
    /** Captions covering speech and descriptions of non-spoken sounds */
    ClosedCaption = 'CLOSED_CAPTION',
    /** Captions covering speech only */
    Subtitle = 'SUBTITLE',
}

/** Category the Course belongs to */
export type Category = {
    /** ID of the category */
    id: Scalars['ID'];
    /** Name of the category */
    name: Scalars['String'];
    /** Subcategories belonging to the category */
    subcategories: Array<SubCategory>;
};

/** Coding exercise for students to practice their programming */
export type CodingExercise = {
    __typename?: 'CodingExercise';
    /** Problem statement */
    description?: Maybe<Scalars['String']>;
    /** The Id of the coding exercise */
    id: Scalars['ID'];
    /** The language the coding exercise is written in */
    language: CodingExerciseLanguageOption;
    /** The title of the coding exercise */
    title: Scalars['String'];
};

/** Language possibilities for a coding exercise */
export enum CodingExerciseLanguageOption {
    /** C++ */
    Cplusplus = 'CPLUSPLUS',
    /** CSV processing with Python */
    CsvProcessingWithPython = 'CSV_PROCESSING_WITH_PYTHON',
    /** C# */
    CSharp = 'C_SHARP',
    /** HTML */
    Html = 'HTML',
    /** JavaScript ES6 */
    JavascriptEs6 = 'JAVASCRIPT_ES6',
    /** Java 9 */
    Java_9 = 'JAVA_9',
    /** Java 11 */
    Java_11 = 'JAVA_11',
    /** PHP 5 */
    Php_5 = 'PHP_5',
    /** PHP 7 */
    Php_7 = 'PHP_7',
    /** Python 3.5 */
    Python_3_5 = 'PYTHON_3_5',
    /** Python 3.8 */
    Python_3_8 = 'PYTHON_3_8',
    /** Python 3.10 */
    Python_3_10 = 'PYTHON_3_10',
    /** React 16 */
    React_16 = 'REACT_16',
    /** Ruby */
    Ruby = 'RUBY',
    /** R 3.6 */
    R_3_6 = 'R_3_6',
    /** SciPy 1.4 (Numby, Pandas, SymPy and SkiCit Learn 0.23 */
    Scipy_1_4NumpyPandasSympyAndScikitLearn_0_23 = 'SCIPY_1_4_NUMPY_PANDAS_SYMPY_AND_SCIKIT_LEARN_0_23',
    /** SQL (MySQL) */
    Sql = 'SQL',
    /** Swift 3 */
    Swift_3 = 'SWIFT_3',
    /** Swift 5 */
    Swift_5 = 'SWIFT_5',
}

/** Type representing a group of content for a subscription plan */
export type ContentCollection = {
    __typename?: 'ContentCollection';
    /** ID of the Content Collection */
    id: Scalars['ID'];
};

/** The Course object. */
export type Course = LearningProduct & {
    __typename?: 'Course';
    /** Accreditations a course has */
    accreditations?: Maybe<Array<CourseAccreditation>>;
    /** Caption and subtitles the course has */
    captions?: Maybe<Array<CourseCaptionDetails>>;
    /** Categories the course is part of */
    categories: Array<CourseCategory>;
    /** Course's curriculum */
    curriculum: Curriculum;
    /** Description of the course */
    description?: Maybe<Scalars['CourseHtmlString']>;
    /** Total duration of the course's content */
    duration?: Maybe<Scalars['CourseDuration']>;
    /** Total duration of the course's content in seconds */
    durationInSeconds?: Maybe<Scalars['CourseDurationInSeconds']>;
    /** Total duration of video content only */
    durationVideoContent?: Maybe<Scalars['CourseDurationInSeconds']>;
    /** Whether a learner can enroll in a course or not */
    enrollable: Scalars['Boolean'];
    /** Learners enrolled in a course */
    enrollments: CourseEnrollments;
    /** Headline to show under the title */
    headline?: Maybe<Scalars['String']>;
    /** ID of the course. */
    id: Scalars['ID'];
    /** Images by their dimensions */
    images: CourseImages;
    /** Instructors of the Course */
    instructors: Array<CourseInstructor>;
    /** What you will learn in this course */
    learningOutcome: Array<Scalars['String']>;
    /** Instruction level of the course */
    level?: Maybe<DifficultyLevel>;
    /** Course locale e.g. en-US or en-GB */
    locale: Scalars['Locale'];
    /** The UB organization this course belongs to, only visible if you are part of that organization */
    organization?: Maybe<Organization>;
    /** Prerequisites for taking the course */
    prerequisites: Array<Scalars['String']>;
    /** Whether the course is publicly available or not */
    private?: Maybe<Scalars['Boolean']>;
    /** How do students rate the course */
    rating: CourseRating;
    /** Who should attend the course */
    targetAudience: Array<Scalars['String']>;
    /** Title of the course. */
    title?: Maybe<Scalars['String']>;
    /** Topics course is tagged with */
    topics?: Maybe<Array<Topic>>;
    /** When the course was last updated */
    updated?: Maybe<Scalars['Date']>;
    /**
     * The URL to access the course landing page
     * @deprecated url field is deprecated. Use urlCourseLanding instead.
     */
    url?: Maybe<Scalars['URL']>;
    /** The URL to access the auto-enroll page */
    urlAutoEnroll?: Maybe<Scalars['URL']>;
    /** The URL to access the course landing page */
    urlCourseLanding?: Maybe<Scalars['URL']>;
    /** Activity ID of xAPI statement to identify course */
    xapiActivityId: Scalars['ID'];
};

/** Accreditations */
export type CourseAccreditation = {
    __typename?: 'CourseAccreditation';
    /** Start date of accreditation */
    compliantSince?: Maybe<Scalars['Date']>;
    /** The amount of credits this accreditations supplies */
    creditCount: Scalars['NonNegativeFloat'];
    /** The level of the accreditation */
    level?: Maybe<Scalars['String']>;
    /** Technical subject area */
    subject?: Maybe<Scalars['String']>;
    /** The type of accreditation */
    type: CourseAccreditationType;
};

/** Accreditation types */
export enum CourseAccreditationType {
    /** Continuing professional education */
    Cpe = 'CPE',
}

/** Course caption details such as locale, type, and source */
export type CourseCaptionDetails = {
    __typename?: 'CourseCaptionDetails';
    /** Whether the caption is automatically generated */
    automaticallyGenerated: Scalars['Boolean'];
    /** The caption's locale */
    locale: Scalars['Locale'];
    /** The caption type, either subtitles or closed captions */
    type: CaptionType;
};

/** Category the Course belongs to */
export type CourseCategory = Category & {
    __typename?: 'CourseCategory';
    /** ID of the category */
    id: Scalars['ID'];
    /** Name of the category */
    name: Scalars['String'];
    /** Subcategories belonging to the category */
    subcategories: Array<CourseSubCategory>;
    /** The URL to the category page this course is a part of */
    url: Scalars['URL'];
};

/** Enrollments belonging to the course */
export type CourseEnrollments = {
    __typename?: 'CourseEnrollments';
    /** Exact count of how many students are there currently enrolled (course purchase and subscription). Requires token scope 'udemy:application' to access. */
    count: Scalars['Int'];
    /**
     * Count of how many students are currently enrolled (course purchase and subscription) rounded to the nearest decimal
     * Exception: if there are fewer than 10 enrollments we show the exact amount (instead of 0)
     */
    roundedCount: Scalars['Int'];
};

/** Course images by varying dimensions */
export type CourseImages = {
    __typename?: 'CourseImages';
    /** Course preview image with 125 pixels height */
    height125?: Maybe<Scalars['String']>;
    /** Course preview image with 200 pixels height */
    height200?: Maybe<Scalars['String']>;
    /** Course preview image with 48x27 dimensions in pixels */
    px48x27?: Maybe<Scalars['String']>;
    /** Course preview image with 50x50 dimensions in pixels */
    px50x50?: Maybe<Scalars['String']>;
    /** Course preview image with 75x75 dimensions in pixels */
    px75x75?: Maybe<Scalars['String']>;
    /** Course preview image with 96x54 dimensions in pixels */
    px96x54?: Maybe<Scalars['String']>;
    /** Course preview image with 100x100 dimensions in pixels */
    px100x100?: Maybe<Scalars['String']>;
    /** Course preview image with 240x135 dimensions in pixels */
    px240x135?: Maybe<Scalars['String']>;
    /** Course preview image with 304x171 dimensions in pixels */
    px304x171?: Maybe<Scalars['String']>;
    /** Course preview image with 480x270 dimensions in pixels */
    px480x270?: Maybe<Scalars['String']>;
};

/** Instructor for a course */
export type CourseInstructor = Instructor & {
    __typename?: 'CourseInstructor';
    /** ID of the Instructor */
    id: Scalars['ID'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']>;
};

/** Ratings of a course */
export type CourseRating = {
    __typename?: 'CourseRating';
    /** Weighted average rating. Ranges from 0 to 5.0. */
    average?: Maybe<Scalars['AverageRating']>;
    /** Number of ratings */
    count: Scalars['Int'];
};

/** Search filters to apply on search request */
export type CourseSearchFilters = {
    /** Filter results based on closed caption language */
    closedCaptionLanguage?: InputMaybe<Array<LanguageCode>>;
    /** Filter results based on course language */
    language?: InputMaybe<Array<LanguageCode>>;
    /** Filter course based on difficulty level */
    level?: InputMaybe<Array<DifficultyLevel>>;
    /** Minimum average rating for the course. Ranges from 0 to 5.0. */
    minAverageRating?: InputMaybe<Scalars['AverageRating']>;
    /** Whether or not course must have closed captions */
    mustHaveClosedCaption?: InputMaybe<Scalars['Boolean']>;
    /** Whether or not course must have coding exercises */
    mustHaveCodingExercise?: InputMaybe<Scalars['Boolean']>;
    /** Whether or not course must have practice tests */
    mustHavePracticeTest?: InputMaybe<Scalars['Boolean']>;
    /** Whether or not course must have quizzes */
    mustHaveQuiz?: InputMaybe<Scalars['Boolean']>;
    /** Whether or not course must have workspaces */
    mustHaveWorkspace?: InputMaybe<Scalars['Boolean']>;
    /** Filter courses based on topics */
    topicIds?: InputMaybe<Array<Scalars['ID']>>;
    /** Filter course based on video length */
    videoLength?: InputMaybe<Array<VideoLength>>;
};

/** List of Courses and additional data about search response */
export type CourseSearchResponse = Paginated & {
    __typename?: 'CourseSearchResponse';
    /** Total number of Courses matching the search query and filters. */
    count: Scalars['Int'];
    /** List of Course objects. */
    courses: Array<Course>;
    /** Identifies available search filter facets. */
    filterOptions: Array<SearchAggregation>;
    /** The current page number, 0 based */
    page: Scalars['Int'];
    /** The total amount of pages in search response */
    pageCount: Scalars['Int'];
};

/** Sort order for courses in search response */
export enum CourseSearchSortType {
    /** Highest rated */
    Rating = 'RATING',
    /** Most relevant */
    Relevance = 'RELEVANCE',
    /** Most reviewed */
    Reviews = 'REVIEWS',
    /** Newest */
    Time = 'TIME',
}

/** Section of the course containing all types of curriculum items */
export type CourseSection = {
    __typename?: 'CourseSection';
    /** What will students be able to do at the end of this section? */
    description?: Maybe<Scalars['String']>;
    /** Identifier for the course section */
    id: Scalars['Int'];
    /** Content of the section */
    items: Array<CurriculumItem>;
    /** Title of the section */
    title: Scalars['String'];
};

/** SubCategory that is part of CourseCategory */
export type CourseSubCategory = SubCategory & {
    __typename?: 'CourseSubCategory';
    /** ID of the subcategory */
    id: Scalars['ID'];
    /** Name of the subcategory */
    name: Scalars['String'];
    /** The URL to the subcategory page this course is a part of */
    url: Scalars['URL'];
};

/** Currencies available */
export enum CurrencyCode {
    /** Australian dollar */
    Aud = 'AUD',
    /** Brazilian real */
    Brl = 'BRL',
    /** Canadian dollar */
    Cad = 'CAD',
    /** Danish crone */
    Dkk = 'DKK',
    /** Euro */
    Eur = 'EUR',
    /** Sterling */
    Gbp = 'GBP',
    /** Indonesian rupiah */
    Idr = 'IDR',
    /** Israel new shekel */
    Ils = 'ILS',
    /** Indian rupee */
    Inr = 'INR',
    /** Japanese yen */
    Jpy = 'JPY',
    /** South Korean won */
    Krw = 'KRW',
    /** Mexican peso */
    Mxn = 'MXN',
    /** Norwegian krone */
    Nok = 'NOK',
    /** Polish złoty */
    Pln = 'PLN',
    /** Russian ruble */
    Rub = 'RUB',
    /** Singapore dollar */
    Sgd = 'SGD',
    /** Thai baht */
    Thb = 'THB',
    /** Turkish lira */
    Try = 'TRY',
    /** New Taiwan dollar */
    Twd = 'TWD',
    /** United States dollar */
    Usd = 'USD',
    /** Vietnamese dong */
    Vnd = 'VND',
    /** South African rand */
    Zar = 'ZAR',
}

/** Curriculum part of a course */
export type Curriculum = {
    __typename?: 'Curriculum';
    /** Each course section containing the course curriculum content */
    sections: Array<CourseSection>;
};

/** All curriculum items */
export type CurriculumItem =
    | ArticleLecture
    | CodingExercise
    | PracticeAssignment
    | PracticeTest
    | Quiz
    | VideoLecture
    | VideoMashupLecture;

/** Type representing details about an interval of dates */
export type DateInterval = {
    __typename?: 'DateInterval';
    /** The count of type in the interval */
    count: Scalars['Int'];
    /** Type type of interval */
    type: DateIntervalType;
};

/** Supported units of time over which a subscription trial or billing cycle can occur */
export enum DateIntervalType {
    /** Daily interval */
    Day = 'DAY',
    /** Monthly interval */
    Month = 'MONTH',
    /** Weekly interval */
    Week = 'WEEK',
    /** Yearly interval */
    Year = 'YEAR',
}

/** Instruction level of the course */
export enum DifficultyLevel {
    /** Item is appropriate for all skill levels */
    AllLevels = 'ALL_LEVELS',
    /** Item is for beginners */
    Beginner = 'BEGINNER',
    /** Item is for students with expert knowledge */
    Expert = 'EXPERT',
    /** Item is for students with intermediates knowledge */
    Intermediate = 'INTERMEDIATE',
}

/** Stores realtime attribute like build_number->20220322_v1 */
export type FeatureRequestAttributeInput = {
    /** Key, ex: build_number */
    key: Scalars['String'];
    /** Value, ex: 20220322_v1 */
    value: Scalars['String'];
};

/** Holds assigned feature variant  */
export type FeatureVariantAssignment = {
    __typename?: 'FeatureVariantAssignment';
    /** Configuration data of assigned feature variant */
    configuration?: Maybe<Scalars['JSON']>;
    /** List of experiment ids bucketed for current feature */
    experimentIds: Array<Scalars['Int']>;
    /** Feature code of assigned feature variant */
    featureCode: Scalars['String'];
    /** Shows whether this feature variant is in experiment */
    isInExperiment?: Maybe<Scalars['Boolean']>;
};

/** Instructor for a learning product */
export type Instructor = {
    /** ID of the Instructor */
    id: Scalars['ID'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']>;
};

/** Instructor images by varying dimensions */
export type InstructorImages = {
    __typename?: 'InstructorImages';
    /** Instructor image with 50x50 dimensions in pixels */
    px50x50?: Maybe<Scalars['String']>;
};

/** The Lab object. */
export type Lab = {
    __typename?: 'Lab';
    /** Bulleted list of things a person will accomplish in this Lab. */
    activities: Array<Scalars['String']>;
    /** Top level description of the Lab. */
    description: Scalars['String'];
    /** ID of the Lab. */
    id: Scalars['ID'];
    /** The Lab's Instructors */
    instructors: Array<LabInstructor>;
    /** Bulleted list of things a person will learn in this Lab. */
    learningOutcomes: Array<Scalars['String']>;
    /** Upper bound of estimated time (in seconds) to complete Lab. */
    maxEstimatedTime: Scalars['Int'];
    /** Metadata associated with the lab */
    metadata?: Maybe<LabMetaData>;
    /** Lower bound of estimated time (in seconds) to complete Lab. */
    minEstimatedTime: Scalars['Int'];
    /** Bulleted list of things a person should already know in order to do this Lab. */
    prerequisites: Array<Scalars['String']>;
    /** Title of the Lab. */
    title: Scalars['String'];
    /** The Lab's topics */
    topics?: Maybe<Array<Topic>>;
};

/** Instructor for a lab */
export type LabInstructor = Instructor & {
    __typename?: 'LabInstructor';
    /** ID of the Instructor */
    id: Scalars['ID'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']>;
};

/** MetaData for a lab */
export type LabMetaData = {
    __typename?: 'LabMetaData';
    /** Unique analytics ID for this instance of Lab returned from the server in this request. */
    trackingId?: Maybe<Scalars['String']>;
};

/** List of Labs and additional data about search response */
export type LabSearchResponse = {
    __typename?: 'LabSearchResponse';
    /** Total number of Labs matching the search query and filters. */
    count: Scalars['Int'];
    /** Identifies available search filter facets. */
    filterOptions: Array<SearchAggregation>;
    /** List of Lab objects. */
    labs: Array<Lab>;
    /** Search analytics tracking id; for uniquely identifying this query and result set; for this request */
    trackingId: Scalars['String'];
};

/** The LanguageCode scalar type as defined by ISO 639-1. */
export enum LanguageCode {
    /** Afrikaans */
    Af = 'AF',
    /** Akan */
    Ak = 'AK',
    /** Amharic */
    Am = 'AM',
    /** Arabic */
    Ar = 'AR',
    /** Assamese */
    As = 'AS',
    /** Azerbaijani */
    Az = 'AZ',
    /** Belarusian */
    Be = 'BE',
    /** Bulgarian */
    Bg = 'BG',
    /** Bambara */
    Bm = 'BM',
    /** Bangla */
    Bn = 'BN',
    /** Tibetan */
    Bo = 'BO',
    /** Breton */
    Br = 'BR',
    /** Bosnian */
    Bs = 'BS',
    /** Catalan */
    Ca = 'CA',
    /** Chechen */
    Ce = 'CE',
    /** Czech */
    Cs = 'CS',
    /** Church Slavic */
    Cu = 'CU',
    /** Welsh */
    Cy = 'CY',
    /** Danish */
    Da = 'DA',
    /** German */
    De = 'DE',
    /** Dzongkha */
    Dz = 'DZ',
    /** Ewe */
    Ee = 'EE',
    /** Greek */
    El = 'EL',
    /** English */
    En = 'EN',
    /** Esperanto */
    Eo = 'EO',
    /** Spanish */
    Es = 'ES',
    /** Estonian */
    Et = 'ET',
    /** Basque */
    Eu = 'EU',
    /** Persian */
    Fa = 'FA',
    /** Fulah */
    Ff = 'FF',
    /** Finnish */
    Fi = 'FI',
    /** Faroese */
    Fo = 'FO',
    /** French */
    Fr = 'FR',
    /** Western Frisian */
    Fy = 'FY',
    /** Irish */
    Ga = 'GA',
    /** Scottish Gaelic */
    Gd = 'GD',
    /** Galician */
    Gl = 'GL',
    /** Gujarati */
    Gu = 'GU',
    /** Manx */
    Gv = 'GV',
    /** Hausa */
    Ha = 'HA',
    /** Hebrew */
    He = 'HE',
    /** Hindi */
    Hi = 'HI',
    /** Croatian */
    Hr = 'HR',
    /** Hungarian */
    Hu = 'HU',
    /** Armenian */
    Hy = 'HY',
    /** Interlingua */
    Ia = 'IA',
    /** Indonesian */
    Id = 'ID',
    /** Igbo */
    Ig = 'IG',
    /** Sichuan Yi */
    Ii = 'II',
    /** Icelandic */
    Is = 'IS',
    /** Italian */
    It = 'IT',
    /** Japanese */
    Ja = 'JA',
    /** Javanese */
    Jv = 'JV',
    /** Georgian */
    Ka = 'KA',
    /** Kikuyu */
    Ki = 'KI',
    /** Kazakh */
    Kk = 'KK',
    /** Kalaallisut */
    Kl = 'KL',
    /** Khmer */
    Km = 'KM',
    /** Kannada */
    Kn = 'KN',
    /** Korean */
    Ko = 'KO',
    /** Kashmiri */
    Ks = 'KS',
    /** Kurdish */
    Ku = 'KU',
    /** Cornish */
    Kw = 'KW',
    /** Kyrgyz */
    Ky = 'KY',
    /** Luxembourgish */
    Lb = 'LB',
    /** Ganda */
    Lg = 'LG',
    /** Lingala */
    Ln = 'LN',
    /** Lao */
    Lo = 'LO',
    /** Lithuanian */
    Lt = 'LT',
    /** Luba-Katanga */
    Lu = 'LU',
    /** Latvian */
    Lv = 'LV',
    /** Malagasy */
    Mg = 'MG',
    /** Māori */
    Mi = 'MI',
    /** Macedonian */
    Mk = 'MK',
    /** Malayalam */
    Ml = 'ML',
    /** Mongolian */
    Mn = 'MN',
    /** Marathi */
    Mr = 'MR',
    /** Malay */
    Ms = 'MS',
    /** Maltese */
    Mt = 'MT',
    /** Burmese */
    My = 'MY',
    /** Norwegian (Bokmål) */
    Nb = 'NB',
    /** North Ndebele */
    Nd = 'ND',
    /** Nepali */
    Ne = 'NE',
    /** Dutch */
    Nl = 'NL',
    /** Norwegian Nynorsk */
    Nn = 'NN',
    /** Norwegian */
    No = 'NO',
    /** Oromo */
    Om = 'OM',
    /** Odia */
    Or = 'OR',
    /** Ossetic */
    Os = 'OS',
    /** Punjabi */
    Pa = 'PA',
    /** Polish */
    Pl = 'PL',
    /** Pashto */
    Ps = 'PS',
    /** Portuguese */
    Pt = 'PT',
    /** Portuguese (Brazil) */
    PtBr = 'PT_BR',
    /** Portuguese (Portugal) */
    PtPt = 'PT_PT',
    /** Quechua */
    Qu = 'QU',
    /** Romansh */
    Rm = 'RM',
    /** Rundi */
    Rn = 'RN',
    /** Romanian */
    Ro = 'RO',
    /** Russian */
    Ru = 'RU',
    /** Kinyarwanda */
    Rw = 'RW',
    /** Sindhi */
    Sd = 'SD',
    /** Northern Sami */
    Se = 'SE',
    /** Sango */
    Sg = 'SG',
    /** Sinhala */
    Si = 'SI',
    /** Slovak */
    Sk = 'SK',
    /** Slovenian */
    Sl = 'SL',
    /** Shona */
    Sn = 'SN',
    /** Somali */
    So = 'SO',
    /** Albanian */
    Sq = 'SQ',
    /** Serbian */
    Sr = 'SR',
    /** Sundanese */
    Su = 'SU',
    /** Swedish */
    Sv = 'SV',
    /** Swahili */
    Sw = 'SW',
    /** Tamil */
    Ta = 'TA',
    /** Telugu */
    Te = 'TE',
    /** Tajik */
    Tg = 'TG',
    /** Thai */
    Th = 'TH',
    /** Tigrinya */
    Ti = 'TI',
    /** Turkmen */
    Tk = 'TK',
    /** Tongan */
    To = 'TO',
    /** Turkish */
    Tr = 'TR',
    /** Tatar */
    Tt = 'TT',
    /** Uyghur */
    Ug = 'UG',
    /** Ukrainian */
    Uk = 'UK',
    /** Urdu */
    Ur = 'UR',
    /** Uzbek */
    Uz = 'UZ',
    /** Vietnamese */
    Vi = 'VI',
    /** Volapük */
    Vo = 'VO',
    /** Wolof */
    Wo = 'WO',
    /** Xhosa */
    Xh = 'XH',
    /** Yiddish */
    Yi = 'YI',
    /** Yoruba */
    Yo = 'YO',
    /** Chinese */
    Zh = 'ZH',
    /** Chinese (Simplified) */
    ZhCn = 'ZH_CN',
    /** Chinese (Traditional) */
    ZhTw = 'ZH_TW',
    /** Zulu */
    Zu = 'ZU',
}

/** All partner's content collection items that are available, currently just course */
export type LearningProduct = {
    /** ID of the learning product */
    id: Scalars['ID'];
};

/** A collection of learning products for a partner */
export type LearningProductsPaged = Paginated & {
    __typename?: 'LearningProductsPaged';
    /** The contents of the collection, currently just courses. Items may be less than requested size if objects become unavailable */
    items: Array<LearningProduct>;
    /** The current page number, 0 based */
    page: Scalars['Int'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int'];
};

/** Represents a lecture type  */
export type Lecture = {
    /** Id of the lecture */
    id: Scalars['ID'];
    /** Lecture title */
    title: Scalars['String'];
};

/** Money */
export type Money = {
    __typename?: 'Money';
    /** Amount */
    amount?: Maybe<Scalars['Decimal']>;
    /** Currency */
    currency?: Maybe<CurrencyCode>;
};

/** Price option for computed price plan. Will be returned for daily, weekly or monthly plans */
export type MonthlySubscriptionPlanPricingOption = {
    __typename?: 'MonthlySubscriptionPlanPricingOption';
    /** ID of the price option: */
    id: Scalars['ID'];
    /** The list price of the subscription price plan based on provided requested count from request */
    listPrice: Money;
    /** Interval for renewing the subscription plan ie the length of the subscription plan */
    renewalInterval: DateInterval;
    /** Field containing details about the trial subscription offer for a given user. Null indicates no trial is available */
    trial?: Maybe<SubscriptionTrial>;
};

/** A UB organization */
export type Organization = {
    __typename?: 'Organization';
    /** The UB organization's unique identifier */
    id: Scalars['ID'];
};

/** Interface for implementing paginated results */
export type Paginated = {
    /** The current page number, 0 based */
    page: Scalars['Int'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int'];
};

/** Popular topic */
export type PopularTopic = {
    __typename?: 'PopularTopic';
    /** The type of popularity associated with this topic */
    popularityType?: Maybe<TopicPopularityTypes>;
    /** Associated Subcategory */
    subcategory?: Maybe<PopularTopicSubCategory>;
    /** A topic */
    topic: Topic;
};

/** Topic SubCategory */
export type PopularTopicSubCategory = SubCategory & {
    __typename?: 'PopularTopicSubCategory';
    /** ID of the subcategory */
    id: Scalars['ID'];
    /** Name of the subcategory */
    name: Scalars['String'];
};

/** Assigment test with multiple-choice and free-from questions reviewed by instructors */
export type PracticeAssignment = {
    __typename?: 'PracticeAssignment';
    /** Description of the assignment */
    description: Scalars['String'];
    /** The Id of the assignment */
    id: Scalars['ID'];
};

/** Practice test that is more detailed than a Quiz */
export type PracticeTest = {
    __typename?: 'PracticeTest';
    /** The Id of the practice test */
    id: Scalars['ID'];
    /** Percentage required to pass (0 - 100) */
    minimumPassingScore: Scalars['Int'];
    /** Whether the question and answer order is randomized */
    randomized: Scalars['Boolean'];
    /** The title of the practice test */
    title: Scalars['String'];
};

/** Root query from which every schema extends */
export type Query = {
    __typename?: 'Query';
    /** Retrieve a course by its ID */
    course?: Maybe<Course>;
    /** Retrieve a category by id */
    courseCategory?: Maybe<CourseCategory>;
    /** Retrieve a set of courses by their IDs */
    courses: Array<Maybe<Course>>;
    /** Returns assigned feature variants */
    featureVariantAssignmentsByCodeAndAttributes: Array<FeatureVariantAssignment>;
    /** Retrieve a Lab by its ID */
    lab?: Maybe<Lab>;
    /** Retrieve a set of Labs by their IDs */
    labs: Array<Maybe<Lab>>;
    /** Returns available learning products for the client */
    learningProductByPage: LearningProductsPaged;
    /** Gets a list of all popular topics */
    popularTopics: Array<Maybe<PopularTopic>>;
    /** Search for autocomplete */
    searchAutocomplete: Array<Maybe<SearchAutocompleteSuggestion>>;
    /** Search for courses */
    searchCourses?: Maybe<CourseSearchResponse>;
    /** Search for labs */
    searchLabs?: Maybe<LabSearchResponse>;
    /** Returns available subscription plans for a given user */
    subscriptionPlans: Array<SubscriptionPlan>;
    /** Returns list of available plans based on the subscription plan product type */
    subscriptionPlansByProductType: Array<SubscriptionPlan>;
};

/** Root query from which every schema extends */
export type QueryCourseArgs = {
    id: Scalars['ID'];
};

/** Root query from which every schema extends */
export type QueryCourseCategoryArgs = {
    id: Scalars['ID'];
};

/** Root query from which every schema extends */
export type QueryCoursesArgs = {
    ids: Array<Scalars['ID']>;
};

/** Root query from which every schema extends */
export type QueryFeatureVariantAssignmentsByCodeAndAttributesArgs = {
    featureCodes: Array<Scalars['String']>;
    realtimeAttributes?: InputMaybe<Array<FeatureRequestAttributeInput>>;
};

/** Root query from which every schema extends */
export type QueryLabArgs = {
    id: Scalars['ID'];
};

/** Root query from which every schema extends */
export type QueryLabsArgs = {
    ids: Array<Scalars['ID']>;
};

/** Root query from which every schema extends */
export type QueryLearningProductByPageArgs = {
    page?: InputMaybe<Scalars['Int']>;
    size?: InputMaybe<Scalars['MaxResultsPerPage']>;
};

/** Root query from which every schema extends */
export type QueryPopularTopicsArgs = {
    categoryId: Scalars['ID'];
};

/** Root query from which every schema extends */
export type QuerySearchAutocompleteArgs = {
    request: SearchAutocompleteRequestInput;
};

/** Root query from which every schema extends */
export type QuerySearchCoursesArgs = {
    filters?: InputMaybe<CourseSearchFilters>;
    page?: InputMaybe<Scalars['NonNegativeInt']>;
    query: Scalars['String'];
    sortOrder?: InputMaybe<CourseSearchSortType>;
};

/** Root query from which every schema extends */
export type QuerySearchLabsArgs = {
    filters?: InputMaybe<Array<SearchAggregationInputOption>>;
    query: Scalars['String'];
};

/** Root query from which every schema extends */
export type QuerySubscriptionPlansByProductTypeArgs = {
    productType?: InputMaybe<SubscriptionPlanProductType>;
};

/** Quiz with simple questions and multiple choice answers */
export type Quiz = {
    __typename?: 'Quiz';
    /** An optional description */
    description?: Maybe<Scalars['String']>;
    /** The Id of the quiz */
    id: Scalars['ID'];
    /** The title of the quiz */
    title: Scalars['String'];
};

/** Identifies available search filter facets. */
export type SearchAggregation = {
    __typename?: 'SearchAggregation';
    /** Available values for this aggregation. */
    buckets: Array<SearchAggregationOption>;
    /** Key argument that can be passed to query to filter by this option. */
    key: Scalars['String'];
    /** Label for this type/group of aggregation; e.g. 'Topic'. */
    label: Scalars['String'];
};

/** Options for search aggregates */
export type SearchAggregationInputOption = {
    /** Key of search aggregation to apply */
    key: Scalars['String'];
    /** Value of search aggregation to apply */
    value: Scalars['String'];
};

/** One of the available options within a search facet type */
export type SearchAggregationOption = {
    __typename?: 'SearchAggregationOption';
    /** Number of results if this filter option were to be applied. */
    countWithFilterApplied: Scalars['Int'];
    /** Human-readable label for this filter option. */
    label: Scalars['String'];
    /** Value argument that can be passed to query to filter by this option. */
    value: Scalars['String'];
};

/** A simple auto-complete item can be search log, course or instructor */
export type SearchAutocompleteItem = Course | CourseInstructor | SearchAutocompleteLogItem;

/** Search Log suggestion for autocomplete */
export type SearchAutocompleteLogItem = {
    __typename?: 'SearchAutocompleteLogItem';
    /** Phrase that will be shows as a suggestion */
    title: Scalars['String'];
};

/** Search param for autocomplete */
export type SearchAutocompleteRequestInput = {
    /** Indicates either free courses will be shown or not */
    freeCourseSuppression?: InputMaybe<Scalars['Boolean']>;
    /** Size of the response */
    responseSize?: Scalars['Int'];
    /** Searched Phrase for the requests */
    searchedPhrase: Scalars['String'];
};

/** A simple autocomplete item with the tracking metadata */
export type SearchAutocompleteSuggestion = {
    __typename?: 'SearchAutocompleteSuggestion';
    /** Search Autocomplete suggestion for autocomplete */
    item?: Maybe<SearchAutocompleteItem>;
    /** Search analytics tracking id; for uniquely identifying whole result set; for this request */
    resultTrackingId: Scalars['String'];
    /** Search analytics tracking id; for uniquely identifying this item */
    trackingId: Scalars['String'];
};

/** SubCategory that is part of CourseCategory */
export type SubCategory = {
    /** ID of the subcategory */
    id: Scalars['ID'];
    /** Name of the subcategory */
    name: Scalars['String'];
};

/** An offer for a consumer subscription plan to access a catalog of Udemy content */
export type SubscriptionPlan = {
    __typename?: 'SubscriptionPlan';
    /** List of content groups included in a given plan */
    contentCollections: Array<ContentCollection>;
    /** ID of the subscription plan: */
    id: Scalars['ID'];
    /**
     * The non-sale price of the subscription plan
     * @deprecated list price field is deprecated. Use listPrice filed from PriceOption instead.
     */
    listPrice: Money;
    /** Computed price options for given plan */
    priceOptions: Array<SubscriptionPlanPricingOptionItem>;
    /** Type of subscription plan being offered */
    productType: SubscriptionPlanProductType;
    /**
     * Interval for renewing the subscription plan ie the length of the subscription plan
     * @deprecated renewal interval field is deprecated. Use renewalInterval filed from PriceOption instead.
     */
    renewalInterval: DateInterval;
    /**
     * Field containing details about the trial subscription offer for a given user. Null indicates no trial is available
     * @deprecated trial field is deprecated. Use trial filed from PriceOption instead.
     */
    trial?: Maybe<SubscriptionTrial>;
    /** Express checkout url for given plan */
    urlExpressCheckout: Scalars['URL'];
    /** Learn more url for a given plan */
    urlLearnMore: Scalars['URL'];
};

/** Union of possible plan pricing options */
export type SubscriptionPlanPricingOptionItem =
    | AnnualSubscriptionPlanPricingOption
    | MonthlySubscriptionPlanPricingOption;

/** The type of subscription plan being offered */
export enum SubscriptionPlanProductType {
    /** Consumer subscription (previously Spadefish) */
    Consumersubscription = 'CONSUMERSUBSCRIPTION',
    /** Enterprise Plan */
    Enterprise = 'ENTERPRISE',
    /** Team Plan */
    Team = 'TEAM',
    /** Udemy Pro */
    Udemypro = 'UDEMYPRO',
}

/** Type representing details about the trial subscription offer available for a given user and plan */
export type SubscriptionTrial = {
    __typename?: 'SubscriptionTrial';
    /** The length of the trial available to a user for a subscription plan. */
    dateInterval: DateInterval;
};

/** Topic */
export type Topic = {
    __typename?: 'Topic';
    /** ID of topic */
    id: Scalars['ID'];
    /** Title of topic (Python, Programming Languages) */
    name: Scalars['String'];
    /** Web url of the topic page */
    url: Scalars['URL'];
};

/** Types of popularity for Topics */
export enum TopicPopularityTypes {
    /** Popular popularity type */
    Popular = 'POPULAR',
    /** Trending popularity type */
    Trending = 'TRENDING',
}

/** Video lecture */
export type VideoLecture = Lecture & {
    __typename?: 'VideoLecture';
    /** Id of the video lecture */
    id: Scalars['ID'];
    /** Lecture title */
    title: Scalars['String'];
};

/** Length of the video in course */
export enum VideoLength {
    /** Extra long */
    ExtraLong = 'EXTRA_LONG',
    /** Extra short */
    ExtraShort = 'EXTRA_SHORT',
    /** Long */
    Long = 'LONG',
    /** Medium */
    Medium = 'MEDIUM',
    /** Short */
    Short = 'SHORT',
}

/** Mashup lecture has both video and a presentation */
export type VideoMashupLecture = Lecture & {
    __typename?: 'VideoMashupLecture';
    /** Id of the lecture */
    id: Scalars['ID'];
    /** Lecture title */
    title: Scalars['String'];
};

export type AutocompleteSuggestionsQueryVariables = Exact<{
    searchedPhrase: Scalars['String'];
}>;

export type AutocompleteSuggestionsQuery = {
    __typename?: 'Query';
    searchAutocomplete: Array<{
        __typename?: 'SearchAutocompleteSuggestion';
        resultTrackingId: string;
        trackingId: string;
        item?:
            | {
                  __typename: 'Course';
                  id: string;
                  title?: string | null;
                  url?: any | null;
                  instructors: Array<{__typename?: 'CourseInstructor'; name: string}>;
                  images: {__typename?: 'CourseImages'; px50x50?: string | null};
              }
            | {
                  __typename: 'CourseInstructor';
                  id: string;
                  name: string;
                  url?: any | null;
                  images: {__typename?: 'InstructorImages'; px50x50?: string | null};
              }
            | {__typename: 'SearchAutocompleteLogItem'; phrase: string}
            | null;
    } | null>;
};

export const AutocompleteSuggestionsDocument = `
    query AutocompleteSuggestions($searchedPhrase: String!) {
  searchAutocomplete(request: {searchedPhrase: $searchedPhrase}) {
    item {
      ... on SearchAutocompleteLogItem {
        phrase: title
        __typename
      }
      ... on CourseInstructor {
        id
        name
        url
        images {
          px50x50
        }
        __typename
      }
      ... on Course {
        id
        title
        url
        instructors {
          name
        }
        images {
          px50x50
        }
        __typename
      }
    }
    resultTrackingId
    trackingId
  }
}
    `;
export const useAutocompleteSuggestionsQuery = <
    TData = AutocompleteSuggestionsQuery,
    TError = unknown,
>(
    variables: AutocompleteSuggestionsQueryVariables,
    options?: UseQueryOptions<AutocompleteSuggestionsQuery, TError, TData>,
) =>
    useQuery<AutocompleteSuggestionsQuery, TError, TData>(
        ['AutocompleteSuggestions', variables],
        fetchData<AutocompleteSuggestionsQuery, AutocompleteSuggestionsQueryVariables>(
            AutocompleteSuggestionsDocument,
            variables,
        ),
        options,
    );

useAutocompleteSuggestionsQuery.getKey = (variables: AutocompleteSuggestionsQueryVariables) => [
    'AutocompleteSuggestions',
    variables,
];
useAutocompleteSuggestionsQuery.fetcher = (
    variables: AutocompleteSuggestionsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<AutocompleteSuggestionsQuery, AutocompleteSuggestionsQueryVariables>(
        AutocompleteSuggestionsDocument,
        variables,
        options,
    );
