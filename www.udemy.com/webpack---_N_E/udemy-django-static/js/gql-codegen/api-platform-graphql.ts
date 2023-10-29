import {useQuery, useMutation, UseQueryOptions, UseMutationOptions} from '@tanstack/react-query';
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
    /** Contains information about the license context for a given subscription plan price option */
    licenseContext?: Maybe<SubscriptionPlanLicenseContext>;
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

/** Certification Subject Area (topic descriptor) for Open Badges */
export type BadgeCertificationSubjectArea = {
    __typename?: 'BadgeCertificationSubjectArea';
    /** ID of certification subject area */
    id: Scalars['ID'];
    /** Title of certification subject area(Cloud, SQL) */
    name: Scalars['String'];
};

/** The BadgeClass object. A collection of information about the accomplishment recognized by the Open Badge. It means Certification for the most cases. */
export type BadgeClass = {
    __typename?: 'BadgeClass';
    /** An object describing which objectives or educational standards this badge aligns to, if any. */
    alignment?: Maybe<Array<BadgeClassAlignment>>;
    /** Criteria document describing how to earn the BadgeClass (Certification) */
    criteria: BadgeClassCriteria;
    /** A short description of BadgeClass */
    description: Scalars['String'];
    /** IRI of the BadgeClass. IRI of OpenBadge specification */
    externalUrl: Scalars['URL'];
    /** ID of the BadgeClass. */
    id: Scalars['ID'];
    /** A PNG or SVG image of the BadgeClass */
    image: BadgeClassImage;
    /** Organization that issued the badge. */
    issuer: BadgeClassIssuer;
    /** Name of the BadgeClass */
    name: Scalars['String'];
    /** A tag that describes the type of achievement. (Skills) */
    tags: Array<Scalars['String']>;
    /** Topic of badge class */
    topic: Topic;
    /** Type of the BadgeClass. In most cases, this will simply be the string BadgeClass */
    type: Array<Scalars['String']>;
};

/** Alignment object. An intangible item that describes an alignment between a learning resource and a BadgeClass */
export type BadgeClassAlignment = {
    __typename?: 'BadgeClassAlignment';
    /** If applicable, a locally unique string identifier that identifies the alignment target within its framework and/or targetUrl. */
    targetCode?: Maybe<Scalars['String']>;
    /** Short description of the alignment target. */
    targetDescription?: Maybe<Scalars['String']>;
    /** Name of the framework the alignment target. */
    targetFramework?: Maybe<Scalars['String']>;
    /** Name of the alignment. */
    targetName?: Maybe<Scalars['String']>;
    /** URL linking to the official description of the alignment target, for example an individual standard within an educational framework. */
    targetUrl?: Maybe<Scalars['URL']>;
};

/** Descriptive metadata about the achievements necessary to be issued with particular BadgeClass (Certification). */
export type BadgeClassCriteria = {
    __typename?: 'BadgeClassCriteria';
    /** The URI of a webpage that describes in a human-readable format the criteria for the BadgeClass */
    id?: Maybe<Scalars['URL']>;
    /** A narrative of what is needed to earn the badge. */
    narrative?: Maybe<Scalars['String']>;
    /** Type of the Criteria */
    type?: Maybe<Array<Scalars['String']>>;
};

/** Image object of BadgeClass or Issuer */
export type BadgeClassImage = {
    __typename?: 'BadgeClassImage';
    /** The author of the image */
    author?: Maybe<Scalars['String']>;
    /** The caption for the image */
    caption?: Maybe<Scalars['String']>;
    /** URI of the image */
    id: Scalars['ID'];
    /** Type of Image */
    type?: Maybe<Array<Scalars['String']>>;
};

/** Issuer of BadgeClass. A collection of information that describes the entity or organization */
export type BadgeClassIssuer = {
    __typename?: 'BadgeClassIssuer';
    /** A short description of the issuer entity or organization. */
    description?: Maybe<Scalars['String']>;
    /** Contact address for the individual or organization. */
    email?: Maybe<Scalars['EmailAddress']>;
    /** Unique IRI for the Issuer/Profile file */
    id: Scalars['ID'];
    /** IRI or document representing an image of the issuer. This must be a PNG or SVG image. */
    image?: Maybe<BadgeClassImage>;
    /** The name of the entity or organization. */
    name: Scalars['String'];
    /** A phone number for the entity. */
    telephone?: Maybe<Scalars['String']>;
    /** Issuer type. In most cases, this will simply be the string Issuer or the more general Profile */
    type: Array<Scalars['String']>;
    /** The homepage or social media profile of the entity, whether individual or institutional */
    url: Scalars['URL'];
};

/** Paginated list of BadgeClasses for search response */
export type BadgeClassSearchResponse = Paginated & {
    __typename?: 'BadgeClassSearchResponse';
    /** List of BadgeClasses */
    items: Array<BadgeClass>;
    /** The current page number, 0 based */
    page: Scalars['Int'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int'];
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

/** Type of the files withing coding exercise templates */
export type CodeFile = {
    __typename?: 'CodeFile';
    /** Content of the codefile inside one of the file list of the coding exercise template */
    content: Scalars['String'];
    /** File name of the codefile inside one of file list of the coding exercise template */
    fileName: Scalars['String'];
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
    /** C# 11 */
    CSharp_11 = 'C_SHARP_11',
    /** HTML */
    Html = 'HTML',
    /** JavaScript ES6 */
    JavascriptEs6 = 'JAVASCRIPT_ES6',
    /** Java 9 */
    Java_9 = 'JAVA_9',
    /** Java 11 */
    Java_11 = 'JAVA_11',
    /** Java 17 */
    Java_17 = 'JAVA_17',
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
    /** SQLITE 3 */
    Sqlite_3 = 'SQLITE_3',
    /** Swift 3 */
    Swift_3 = 'SWIFT_3',
    /** Swift 5 */
    Swift_5 = 'SWIFT_5',
}

/** Type of the coding exercise templates */
export type CodingExerciseTemplate = {
    __typename?: 'CodingExerciseTemplate';
    /** Description of the coding exercise template */
    description: Scalars['String'];
    /** Language of the coding exercise template */
    language: CodingExerciseLanguageOption;
    /** Name of the coding exercise template */
    name: Scalars['String'];
    /** Set of setup files of the sql type coding exercise template */
    setupFiles: Array<CodeFile>;
    /** Set of solution files of the  coding exercise template */
    solutionFiles: Array<CodeFile>;
    /** Supported versions of the language for which the template can be applied */
    supportedVersions: Array<CodingExerciseLanguageOption>;
    /** Set of test files of the coding exercise template */
    testFiles: Array<CodeFile>;
};

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
    /** Mobile Native deep link of the course */
    urlMobileNativeDeeplink: Scalars['URL'];
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

/** A catalog of all courses available to the client */
export type CourseCatalogResponsePaged = {
    __typename?: 'CourseCatalogResponsePaged';
    /** Courses added since last sync or all courses if syncToken is not provided */
    addedCourses: Array<Course>;
    /** Cursor to get the next page. Null if no more results available */
    cursor?: Maybe<Scalars['String']>;
    /** Course IDs for courses removed since last sync */
    removedCourses: Array<Scalars['ID']>;
    /** Sync Token to use for the next delta sync */
    syncToken: Scalars['String'];
    /** Courses updated since last sync */
    updatedCourses: Array<Course>;
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
    /** Contains information about the license context for a given subscription plan price option */
    licenseContext?: Maybe<SubscriptionPlanLicenseContext>;
    /** The list price of the subscription price plan based on provided requested count from request */
    listPrice: Money;
    /** Interval for renewing the subscription plan ie the length of the subscription plan */
    renewalInterval: DateInterval;
    /** Field containing details about the trial subscription offer for a given user. Null indicates no trial is available */
    trial?: Maybe<SubscriptionTrial>;
};

/** Root mutation from which every mutation schema extends */
export type Mutation = {
    __typename?: 'Mutation';
    /**
     * This mutation is used when a user wants to cancel a subscription.
     *
     * Preconditions:
     * - The status of the subscription enrollment is either ACTIVE or TRIAL.
     * - The product type of the subscription enrollment is either 'Consumer Subscription' or 'Team Plan'.
     * - The user must be authorized on that subscription. Being authorized means either:
     *     - Product type is 'Consumer Subscription' and the user is the subscriber of the subscription enrollment.
     *     - Product type is 'Team Plan' and the user is an admin for the subscriber organization.
     *
     * If the criteria above are met, the subscription will be canceled and the new SubscriptionEnrollment data will be
     * returned. As a result of the cancellation:
     * - There won't be any future charges. There will not be any refund for earlier charges.
     * - The user will see the subscription status as CANCELED immediately. However, the content will remain accessible
     *     until the end of the existing billing period.
     * - The user may revert this cancellation until the end of the current billing period. (See the mutation named
     *     'subscriptionEnrollmentReactivate')
     * - At the end of the current billing period, the status will become EXPIRED and the content will become inaccessible.
     */
    subscriptionEnrollmentCancel?: Maybe<SubscriptionEnrollment>;
    /**
     * This mutation is used when a user wants to revert a previous cancellation operation done by the mutation named
     * 'subscriptionEnrollmentCancel'.
     *
     * Preconditions:
     * - The status of the subscription enrollment is CANCELED.
     * - The product type of the subscription enrollment is either 'Consumer Subscription' or 'Team Plan'.
     * - The user must be authorized on that subscription. Being authorized means either:
     *     - Product type is 'Consumer Subscription' and the user is the subscriber of the subscription enrollment.
     *     - Product type is 'Team Plan' and the user is an admin for the subscriber organization.
     *
     * If the criteria above are met, the previous cancellation will be reverted and the new SubscriptionEnrollment data
     * will be returned. As a result of the reactivation:
     * - Future charges will be scheduled again according to the initial plan.
     * - The user will be able to see the new subscription status immediately. The new status will be:
     *     - TRIAL, unless the trial period has ended
     *     - ACTIVE, if the trial period has ended
     */
    subscriptionEnrollmentReactivate?: Maybe<SubscriptionEnrollment>;
};

/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentCancelArgs = {
    id: Scalars['ID'];
};

/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentReactivateArgs = {
    id: Scalars['ID'];
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

/** Root query from which every query schema extends */
export type Query = {
    __typename?: 'Query';
    /** Get certification subject areas for badges */
    badgeCertificationSubjectAreas: Array<BadgeCertificationSubjectArea>;
    /** Get BadgeClass by id */
    badgeClass?: Maybe<BadgeClass>;
    /** Issuer list of all BadgeClasses */
    badgeClassIssuers: Array<BadgeClassIssuer>;
    /** Get list of BadgeClasses under a topic */
    badgeClassesByTopic: Array<BadgeClass>;
    /** Retrieve a single coding exercise template by specifying the language and version and name of the template */
    codingExerciseTemplateByLanguageVersionName: CodingExerciseTemplate;
    /** Retrieve a set of coding exercise templates by their language */
    codingExerciseTemplatesByLanguage: Array<CodingExerciseTemplate>;
    /** Retrieve a set of coding exercise templates by specifying their language and version of the language */
    codingExerciseTemplatesByLanguageVersion: Array<CodingExerciseTemplate>;
    /** Retrieve a course by its ID */
    course?: Maybe<Course>;
    /** Retrieve course catalog for the client */
    courseCatalogByPage?: Maybe<CourseCatalogResponsePaged>;
    /** Retrieve a category by id */
    courseCategory?: Maybe<CourseCategory>;
    /** Retrieve a set of courses by their IDs */
    courses: Array<Maybe<Course>>;
    /** Fetch the current subscription of user or subscription of user's organization if user is a member of an organization. Current subscription could be cancelled or expired. */
    currentSubscriptionEnrollment?: Maybe<SubscriptionEnrollment>;
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
    /** Search for BadgeClasses */
    searchBadgeClasses?: Maybe<BadgeClassSearchResponse>;
    /** Search for courses */
    searchCourses?: Maybe<CourseSearchResponse>;
    /** Search for labs */
    searchLabs?: Maybe<LabSearchResponse>;
    /** Get current lecture consumption streak data for a request's user. */
    streakUserLectureConsumptionWeekly: StreakUserLectureConsumptionWeekly;
    /** Returns available subscription plans for a given user */
    subscriptionPlans: Array<SubscriptionPlan>;
    /** Returns list of available plans based on the subscription plan product type */
    subscriptionPlansByProductType: Array<SubscriptionPlan>;
    /** Returns a topic by ID */
    topic?: Maybe<Topic>;
};

/** Root query from which every query schema extends */
export type QueryBadgeClassArgs = {
    id: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QueryBadgeClassesByTopicArgs = {
    topicId: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QueryCodingExerciseTemplateByLanguageVersionNameArgs = {
    language: CodingExerciseLanguageOption;
    name: Scalars['String'];
};

/** Root query from which every query schema extends */
export type QueryCodingExerciseTemplatesByLanguageArgs = {
    language: CodingExerciseLanguageOption;
};

/** Root query from which every query schema extends */
export type QueryCodingExerciseTemplatesByLanguageVersionArgs = {
    language: CodingExerciseLanguageOption;
};

/** Root query from which every query schema extends */
export type QueryCourseArgs = {
    id: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QueryCourseCatalogByPageArgs = {
    cursor?: InputMaybe<Scalars['String']>;
    pageSize?: InputMaybe<Scalars['MaxResultsPerPage']>;
    syncToken?: InputMaybe<Scalars['String']>;
};

/** Root query from which every query schema extends */
export type QueryCourseCategoryArgs = {
    id: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QueryCoursesArgs = {
    ids: Array<Scalars['ID']>;
};

/** Root query from which every query schema extends */
export type QueryFeatureVariantAssignmentsByCodeAndAttributesArgs = {
    featureCodes: Array<Scalars['String']>;
    realtimeAttributes?: InputMaybe<Array<FeatureRequestAttributeInput>>;
};

/** Root query from which every query schema extends */
export type QueryLabArgs = {
    id: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QueryLabsArgs = {
    ids: Array<Scalars['ID']>;
};

/** Root query from which every query schema extends */
export type QueryLearningProductByPageArgs = {
    page?: InputMaybe<Scalars['Int']>;
    size?: InputMaybe<Scalars['MaxResultsPerPage']>;
};

/** Root query from which every query schema extends */
export type QueryPopularTopicsArgs = {
    categoryId: Scalars['ID'];
};

/** Root query from which every query schema extends */
export type QuerySearchAutocompleteArgs = {
    request: SearchAutocompleteRequestInput;
};

/** Root query from which every query schema extends */
export type QuerySearchBadgeClassesArgs = {
    certificationAreaIds?: InputMaybe<Array<Scalars['ID']>>;
    issuerId?: InputMaybe<Array<Scalars['ID']>>;
    page?: Scalars['Int'];
    query?: InputMaybe<Scalars['String']>;
    size?: Scalars['Int'];
};

/** Root query from which every query schema extends */
export type QuerySearchCoursesArgs = {
    filters?: InputMaybe<CourseSearchFilters>;
    page?: InputMaybe<Scalars['NonNegativeInt']>;
    query: Scalars['String'];
    sortOrder?: InputMaybe<CourseSearchSortType>;
};

/** Root query from which every query schema extends */
export type QuerySearchLabsArgs = {
    filters?: InputMaybe<Array<SearchAggregationInputOption>>;
    query: Scalars['String'];
};

/** Root query from which every query schema extends */
export type QuerySubscriptionPlansByProductTypeArgs = {
    productType?: InputMaybe<SubscriptionPlanProductType>;
};

/** Root query from which every query schema extends */
export type QueryTopicArgs = {
    id: Scalars['ID'];
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

/** Status of any type of streak */
export enum StreakStatus {
    /** The user's streak is ongoing and has not been broken, and they have completed their goals this week */
    ActiveCurrentPeriodAchieved = 'ACTIVE_CURRENT_PERIOD_ACHIEVED',
    /** The user's streak is ongoing and has not been broken, but they haven't completed their goals this week */
    ActiveCurrentPeriodUnachieved = 'ACTIVE_CURRENT_PERIOD_UNACHIEVED',
    /** The user's streak has expired, they will need to start a new streak from scratch */
    Dropped = 'DROPPED',
    /** The user has no history for this type of streak, they never have achieved this streak */
    ZeroHistory = 'ZERO_HISTORY',
}

/** Details about a user's lecture minutes consumption streak, including what to achieve by what date */
export type StreakUserLectureConsumptionWeekly = {
    __typename?: 'StreakUserLectureConsumptionWeekly';
    /** Lecture consumption target the user needs to hit to continue streak, in minutes. */
    goalMinutesThisWeek?: Maybe<Scalars['Int']>;
    /** Lecture consumption so far this week, in minutes. */
    minutesThisWeek?: Maybe<Scalars['Int']>;
    /** Current status of the streak. */
    streakStatus: StreakStatus;
    /** Date to display to user for when the week ended. */
    weekEndTime: Scalars['DateTime'];
    /** Date to display to user for when the week started. */
    weekStartTime: Scalars['DateTime'];
    /** Serialized WeeklyStreak object. */
    weeklyStreak: WeeklyStreak;
};

/** SubCategory that is part of CourseCategory */
export type SubCategory = {
    /** ID of the subcategory */
    id: Scalars['ID'];
    /** Name of the subcategory */
    name: Scalars['String'];
};

/** Subscription plan that the subscriber is subscribed to */
export type SubscribedPlan = {
    __typename?: 'SubscribedPlan';
    /** Content collections that are included in the subscription plan */
    contentCollections: Array<ContentCollection>;
    /** Description of the subscription plan */
    description?: Maybe<Scalars['String']>;
    /** Id of the subscription plan */
    id: Scalars['ID'];
    /** Type of the subscription product in the plan */
    productType: SubscriptionPlanProductType;
    /** Title of the subscription plan */
    title: Scalars['String'];
    /** URL for the learn more page of the subscription plan */
    urlLearnMore: Scalars['URL'];
};

/** Subscriber of the subscription */
export type Subscriber = Organization | User;

/** Subscription object that represents consumer and UB subscriptions */
export type SubscriptionEnrollment = {
    __typename?: 'SubscriptionEnrollment';
    /** Date when the subscription was canceled */
    cancelDate?: Maybe<Scalars['DateTime']>;
    /** Reference key to Recurring Billing System */
    checkoutReference?: Maybe<Scalars['String']>;
    /** End date of the subscription */
    endDate?: Maybe<Scalars['DateTime']>;
    /** Id of the subscription */
    id: Scalars['ID'];
    /** Max number of licenses (seats) allocated for the subscription */
    licenseCount: Scalars['Int'];
    /** Renewal period of the subscription */
    renewalInterval: DateInterval;
    /** Start date of the subscription */
    startDate: Scalars['DateTime'];
    /** Status of the subscription */
    status: SubscriptionStatus;
    /** Subscription plan that the subscriber is subscribed to */
    subscribedPlan: SubscribedPlan;
    /** User or Organization that has the subscription */
    subscriber: Subscriber;
    /** Trial period of the subscription */
    trialInterval?: Maybe<DateInterval>;
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
    /** Terms and Conditions url for a given plan */
    urlTermsOfUse: Scalars['URL'];
};

/** An offer for a consumer subscription plan to access a catalog of Udemy content */
export type SubscriptionPlanPriceOptionsArgs = {
    licenseCount?: InputMaybe<Scalars['Int']>;
};

/** Contains information about the license context for a given subscription plan price option */
export type SubscriptionPlanLicenseContext = {
    __typename?: 'SubscriptionPlanLicenseContext';
    /** Default license count to be offered for purchase for given subscription plan option */
    defaultLicenseCount: Scalars['Int'];
    /** License count for the subscription plan option */
    licenseCount: Scalars['Int'];
    /** Maximum license count for purchase for given subscription plan option */
    maximumLicenseCount: Scalars['Int'];
    /** Minimum license count for purchase for given subscription plan option */
    minimumLicenseCount: Scalars['Int'];
    /** The unit price of the subscription price plan option based on provided requested count from request */
    unitPrice: Money;
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

/** Status of the subscription */
export enum SubscriptionStatus {
    /** Subscription is paid and active */
    Active = 'ACTIVE',
    /** Subscription has canceled but still usable until the end date */
    Canceled = 'CANCELED',
    /** Subscription has ended and not usable anymore */
    Expired = 'EXPIRED',
    /** Subscription has not started yet (only for UB subscriptions) */
    Future = 'FUTURE',
    /** Subscription is in free trial period */
    Trial = 'TRIAL',
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

/** A Udemy user */
export type User = {
    __typename?: 'User';
    /** Id of the user */
    id: Scalars['ID'];
};

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

/** Contains metadata about any retention streak */
export type WeeklyStreak = {
    __typename?: 'WeeklyStreak';
    /** Have they achieved their goal this week? */
    achievedThisWeek: Scalars['Boolean'];
    /** ID of the streak. */
    id: Scalars['ID'];
    /** Start date of the first week of this streak chain. */
    startDate?: Maybe<Scalars['DateTime']>;
    /** Current number of weeks achieved. */
    streakLength: Scalars['Int'];
    /** User who this streak belongs to. */
    userId: Scalars['ID'];
};

export type GetTemplatesByLanguageQueryVariables = Exact<{
    languageInput: CodingExerciseLanguageOption;
}>;

export type GetTemplatesByLanguageQuery = {
    __typename?: 'Query';
    codingExerciseTemplatesByLanguage: Array<{
        __typename?: 'CodingExerciseTemplate';
        language: CodingExerciseLanguageOption;
        supportedVersions: Array<CodingExerciseLanguageOption>;
        name: string;
        description: string;
        solutionFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        testFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        setupFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
    }>;
};

export type GetTemplatesByLanguageVersionQueryVariables = Exact<{
    languageInput: CodingExerciseLanguageOption;
}>;

export type GetTemplatesByLanguageVersionQuery = {
    __typename?: 'Query';
    codingExerciseTemplatesByLanguageVersion: Array<{
        __typename?: 'CodingExerciseTemplate';
        language: CodingExerciseLanguageOption;
        supportedVersions: Array<CodingExerciseLanguageOption>;
        name: string;
        description: string;
        solutionFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        testFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        setupFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
    }>;
};

export type GetTemplatesByLanguageVersionNameQueryVariables = Exact<{
    languageInput: CodingExerciseLanguageOption;
    nameInput: Scalars['String'];
}>;

export type GetTemplatesByLanguageVersionNameQuery = {
    __typename?: 'Query';
    codingExerciseTemplateByLanguageVersionName: {
        __typename?: 'CodingExerciseTemplate';
        language: CodingExerciseLanguageOption;
        supportedVersions: Array<CodingExerciseLanguageOption>;
        name: string;
        description: string;
        solutionFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        testFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
        setupFiles: Array<{__typename?: 'CodeFile'; fileName: string; content: string}>;
    };
};

export type FetchPublicQuizzesOfACourseQueryVariables = Exact<{
    id: Scalars['ID'];
}>;

export type FetchPublicQuizzesOfACourseQuery = {
    __typename?: 'Query';
    course?: {
        __typename?: 'Course';
        id: string;
        curriculum: {
            __typename?: 'Curriculum';
            sections: Array<{
                __typename?: 'CourseSection';
                items: Array<
                    | {__typename?: 'ArticleLecture'}
                    | {__typename: 'CodingExercise'; id: string; title: string}
                    | {__typename?: 'PracticeAssignment'}
                    | {__typename: 'PracticeTest'; id: string; title: string}
                    | {__typename: 'Quiz'; id: string; title: string}
                    | {__typename?: 'VideoLecture'}
                    | {__typename?: 'VideoMashupLecture'}
                >;
            }>;
        };
    } | null;
};

export type SubjectAreasQueryVariables = Exact<{[key: string]: never}>;

export type SubjectAreasQuery = {
    __typename?: 'Query';
    badgeCertificationSubjectAreas: Array<{
        __typename?: 'BadgeCertificationSubjectArea';
        id: string;
        name: string;
    }>;
};

export type BadgeClassIssuerFiltersQueryVariables = Exact<{[key: string]: never}>;

export type BadgeClassIssuerFiltersQuery = {
    __typename?: 'Query';
    badgeClassIssuers: Array<{__typename?: 'BadgeClassIssuer'; id: string; name: string}>;
};

export type BadgeClassWithTopicQueryVariables = Exact<{
    id: Scalars['ID'];
}>;

export type BadgeClassWithTopicQuery = {
    __typename?: 'Query';
    badgeClass?: {
        __typename?: 'BadgeClass';
        id: string;
        name: string;
        description: string;
        type: Array<string>;
        tags: Array<string>;
        image: {__typename?: 'BadgeClassImage'; id: string};
        issuer: {__typename?: 'BadgeClassIssuer'; name: string};
        criteria: {__typename?: 'BadgeClassCriteria'; id?: any | null};
        topic: {__typename?: 'Topic'; id: string};
    } | null;
};

export type SearchBadgeClassesQueryVariables = Exact<{
    query: Scalars['String'];
    issuerIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
    certificationAreaIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
    page?: Scalars['Int'];
    size: Scalars['Int'];
}>;

export type SearchBadgeClassesQuery = {
    __typename?: 'Query';
    searchBadgeClasses?: {
        __typename?: 'BadgeClassSearchResponse';
        page: number;
        pageCount: number;
        items: Array<{
            __typename?: 'BadgeClass';
            id: string;
            name: string;
            image: {__typename?: 'BadgeClassImage'; id: string};
            issuer: {__typename?: 'BadgeClassIssuer'; id: string; name: string};
        }>;
    } | null;
};

export type BadgeClassesByTopicQueryVariables = Exact<{
    topicId: Scalars['ID'];
}>;

export type BadgeClassesByTopicQuery = {
    __typename?: 'Query';
    badgeClassesByTopic: Array<{
        __typename?: 'BadgeClass';
        id: string;
        name: string;
        image: {__typename?: 'BadgeClassImage'; id: string};
        issuer: {__typename?: 'BadgeClassIssuer'; name: string};
    }>;
};

export type LabSearchResponseQueryVariables = Exact<{
    query: Scalars['String'];
    filters?: InputMaybe<Array<SearchAggregationInputOption> | SearchAggregationInputOption>;
}>;

export type LabSearchResponseQuery = {
    __typename?: 'Query';
    searchLabs?: {
        __typename?: 'LabSearchResponse';
        count: number;
        trackingId: string;
        labs: Array<{
            __typename?: 'Lab';
            id: string;
            title: string;
            description: string;
            learningOutcomes: Array<string>;
            activities: Array<string>;
            prerequisites: Array<string>;
            minEstimatedTime: number;
            maxEstimatedTime: number;
            instructors: Array<{__typename?: 'LabInstructor'; name: string}>;
            topics?: Array<{__typename?: 'Topic'; id: string}> | null;
            metadata?: {__typename?: 'LabMetaData'; trackingId?: string | null} | null;
        }>;
    } | null;
};

export type SubscriptionPlansByProductTypeQueryVariables = Exact<{
    productType?: InputMaybe<SubscriptionPlanProductType>;
    licenseCount?: InputMaybe<Scalars['Int']>;
}>;

export type SubscriptionPlansByProductTypeQuery = {
    __typename?: 'Query';
    subscriptionPlansByProductType: Array<{
        __typename?: 'SubscriptionPlan';
        id: string;
        productType: SubscriptionPlanProductType;
        urlLearnMore: any;
        urlExpressCheckout: any;
        priceOptions: Array<
            | {
                  __typename?: 'AnnualSubscriptionPlanPricingOption';
                  id: string;
                  listPrice: {
                      __typename?: 'Money';
                      amount?: any | null;
                      currency?: CurrencyCode | null;
                  };
                  annualSavings?: {
                      __typename?: 'Money';
                      amount?: any | null;
                      currency?: CurrencyCode | null;
                  } | null;
                  monthlyPrice: {
                      __typename?: 'Money';
                      amount?: any | null;
                      currency?: CurrencyCode | null;
                  };
                  renewalInterval: {
                      __typename?: 'DateInterval';
                      type: DateIntervalType;
                      count: number;
                  };
                  trial?: {
                      __typename?: 'SubscriptionTrial';
                      dateInterval: {
                          __typename?: 'DateInterval';
                          type: DateIntervalType;
                          count: number;
                      };
                  } | null;
                  licenseContext?: {
                      __typename?: 'SubscriptionPlanLicenseContext';
                      licenseCount: number;
                      defaultLicenseCount: number;
                      minimumLicenseCount: number;
                      maximumLicenseCount: number;
                      unitPrice: {
                          __typename?: 'Money';
                          amount?: any | null;
                          currency?: CurrencyCode | null;
                      };
                  } | null;
              }
            | {
                  __typename?: 'MonthlySubscriptionPlanPricingOption';
                  id: string;
                  listPrice: {
                      __typename?: 'Money';
                      amount?: any | null;
                      currency?: CurrencyCode | null;
                  };
                  renewalInterval: {
                      __typename?: 'DateInterval';
                      type: DateIntervalType;
                      count: number;
                  };
                  trial?: {
                      __typename?: 'SubscriptionTrial';
                      dateInterval: {
                          __typename?: 'DateInterval';
                          type: DateIntervalType;
                          count: number;
                      };
                  } | null;
                  licenseContext?: {
                      __typename?: 'SubscriptionPlanLicenseContext';
                      licenseCount: number;
                      defaultLicenseCount: number;
                      minimumLicenseCount: number;
                      maximumLicenseCount: number;
                      unitPrice: {
                          __typename?: 'Money';
                          amount?: any | null;
                          currency?: CurrencyCode | null;
                      };
                  } | null;
              }
        >;
    }>;
};

export type SubscriptionPlansQueryVariables = Exact<{[key: string]: never}>;

export type SubscriptionPlansQuery = {
    __typename?: 'Query';
    subscriptionPlans: Array<{
        __typename?: 'SubscriptionPlan';
        id: string;
        productType: SubscriptionPlanProductType;
        listPrice: {__typename?: 'Money'; amount?: any | null; currency?: CurrencyCode | null};
        renewalInterval: {__typename?: 'DateInterval'; type: DateIntervalType; count: number};
        trial?: {
            __typename?: 'SubscriptionTrial';
            dateInterval: {__typename?: 'DateInterval'; type: DateIntervalType; count: number};
        } | null;
    }>;
};

export type FetchCurrentSubscriptionEnrollmentQueryVariables = Exact<{[key: string]: never}>;

export type FetchCurrentSubscriptionEnrollmentQuery = {
    __typename?: 'Query';
    currentSubscriptionEnrollment?: {
        __typename?: 'SubscriptionEnrollment';
        id: string;
        checkoutReference?: string | null;
        startDate: any;
        endDate?: any | null;
        cancelDate?: any | null;
        status: SubscriptionStatus;
        licenseCount: number;
        subscriber: {__typename: 'Organization'; id: string} | {__typename: 'User'; id: string};
        trialInterval?: {__typename?: 'DateInterval'; type: DateIntervalType; count: number} | null;
        renewalInterval: {__typename?: 'DateInterval'; type: DateIntervalType; count: number};
    } | null;
};

export type CancelSubscriptionEnrollmentMutationVariables = Exact<{
    id: Scalars['ID'];
}>;

export type CancelSubscriptionEnrollmentMutation = {
    __typename?: 'Mutation';
    subscriptionEnrollmentCancel?: {
        __typename?: 'SubscriptionEnrollment';
        id: string;
        status: SubscriptionStatus;
        cancelDate?: any | null;
        endDate?: any | null;
    } | null;
};

export type ReactivateSubscriptionEnrollmentMutationVariables = Exact<{
    id: Scalars['ID'];
}>;

export type ReactivateSubscriptionEnrollmentMutation = {
    __typename?: 'Mutation';
    subscriptionEnrollmentReactivate?: {
        __typename?: 'SubscriptionEnrollment';
        id: string;
        status: SubscriptionStatus;
        cancelDate?: any | null;
        endDate?: any | null;
    } | null;
};

export type FeatureVariantAssignmentsQueryVariables = Exact<{
    featureCodes: Array<Scalars['String']> | Scalars['String'];
    realtimeAttributes?: InputMaybe<
        Array<FeatureRequestAttributeInput> | FeatureRequestAttributeInput
    >;
}>;

export type FeatureVariantAssignmentsQuery = {
    __typename?: 'Query';
    featureVariantAssignmentsByCodeAndAttributes: Array<{
        __typename?: 'FeatureVariantAssignment';
        featureCode: string;
        configuration?: any | null;
        isInExperiment?: boolean | null;
        experimentIds: Array<number>;
    }>;
};

export const GetTemplatesByLanguageDocument = `
    query GetTemplatesByLanguage($languageInput: CodingExerciseLanguageOption!) {
  codingExerciseTemplatesByLanguage(language: $languageInput) {
    language
    supportedVersions
    name
    description
    solutionFiles {
      fileName
      content
    }
    testFiles {
      fileName
      content
    }
    setupFiles {
      fileName
      content
    }
  }
}
    `;
export const useGetTemplatesByLanguageQuery = <
    TData = GetTemplatesByLanguageQuery,
    TError = unknown,
>(
    variables: GetTemplatesByLanguageQueryVariables,
    options?: UseQueryOptions<GetTemplatesByLanguageQuery, TError, TData>,
) =>
    useQuery<GetTemplatesByLanguageQuery, TError, TData>(
        ['GetTemplatesByLanguage', variables],
        fetchData<GetTemplatesByLanguageQuery, GetTemplatesByLanguageQueryVariables>(
            GetTemplatesByLanguageDocument,
            variables,
        ),
        options,
    );

useGetTemplatesByLanguageQuery.getKey = (variables: GetTemplatesByLanguageQueryVariables) => [
    'GetTemplatesByLanguage',
    variables,
];
useGetTemplatesByLanguageQuery.fetcher = (
    variables: GetTemplatesByLanguageQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<GetTemplatesByLanguageQuery, GetTemplatesByLanguageQueryVariables>(
        GetTemplatesByLanguageDocument,
        variables,
        options,
    );
export const GetTemplatesByLanguageVersionDocument = `
    query GetTemplatesByLanguageVersion($languageInput: CodingExerciseLanguageOption!) {
  codingExerciseTemplatesByLanguageVersion(language: $languageInput) {
    language
    supportedVersions
    name
    description
    solutionFiles {
      fileName
      content
    }
    testFiles {
      fileName
      content
    }
    setupFiles {
      fileName
      content
    }
  }
}
    `;
export const useGetTemplatesByLanguageVersionQuery = <
    TData = GetTemplatesByLanguageVersionQuery,
    TError = unknown,
>(
    variables: GetTemplatesByLanguageVersionQueryVariables,
    options?: UseQueryOptions<GetTemplatesByLanguageVersionQuery, TError, TData>,
) =>
    useQuery<GetTemplatesByLanguageVersionQuery, TError, TData>(
        ['GetTemplatesByLanguageVersion', variables],
        fetchData<GetTemplatesByLanguageVersionQuery, GetTemplatesByLanguageVersionQueryVariables>(
            GetTemplatesByLanguageVersionDocument,
            variables,
        ),
        options,
    );

useGetTemplatesByLanguageVersionQuery.getKey = (
    variables: GetTemplatesByLanguageVersionQueryVariables,
) => ['GetTemplatesByLanguageVersion', variables];
useGetTemplatesByLanguageVersionQuery.fetcher = (
    variables: GetTemplatesByLanguageVersionQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<GetTemplatesByLanguageVersionQuery, GetTemplatesByLanguageVersionQueryVariables>(
        GetTemplatesByLanguageVersionDocument,
        variables,
        options,
    );
export const GetTemplatesByLanguageVersionNameDocument = `
    query GetTemplatesByLanguageVersionName($languageInput: CodingExerciseLanguageOption!, $nameInput: String!) {
  codingExerciseTemplateByLanguageVersionName(
    language: $languageInput
    name: $nameInput
  ) {
    language
    supportedVersions
    name
    description
    solutionFiles {
      fileName
      content
    }
    testFiles {
      fileName
      content
    }
    setupFiles {
      fileName
      content
    }
  }
}
    `;
export const useGetTemplatesByLanguageVersionNameQuery = <
    TData = GetTemplatesByLanguageVersionNameQuery,
    TError = unknown,
>(
    variables: GetTemplatesByLanguageVersionNameQueryVariables,
    options?: UseQueryOptions<GetTemplatesByLanguageVersionNameQuery, TError, TData>,
) =>
    useQuery<GetTemplatesByLanguageVersionNameQuery, TError, TData>(
        ['GetTemplatesByLanguageVersionName', variables],
        fetchData<
            GetTemplatesByLanguageVersionNameQuery,
            GetTemplatesByLanguageVersionNameQueryVariables
        >(GetTemplatesByLanguageVersionNameDocument, variables),
        options,
    );

useGetTemplatesByLanguageVersionNameQuery.getKey = (
    variables: GetTemplatesByLanguageVersionNameQueryVariables,
) => ['GetTemplatesByLanguageVersionName', variables];
useGetTemplatesByLanguageVersionNameQuery.fetcher = (
    variables: GetTemplatesByLanguageVersionNameQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        GetTemplatesByLanguageVersionNameQuery,
        GetTemplatesByLanguageVersionNameQueryVariables
    >(GetTemplatesByLanguageVersionNameDocument, variables, options);
export const FetchPublicQuizzesOfACourseDocument = `
    query FetchPublicQuizzesOfACourse($id: ID!) {
  course(id: $id) {
    id
    curriculum {
      sections {
        items {
          ... on CodingExercise {
            __typename
            id
            title
          }
          ... on Quiz {
            __typename
            id
            title
          }
          ... on PracticeTest {
            __typename
            id
            title
          }
        }
      }
    }
  }
}
    `;
export const useFetchPublicQuizzesOfACourseQuery = <
    TData = FetchPublicQuizzesOfACourseQuery,
    TError = unknown,
>(
    variables: FetchPublicQuizzesOfACourseQueryVariables,
    options?: UseQueryOptions<FetchPublicQuizzesOfACourseQuery, TError, TData>,
) =>
    useQuery<FetchPublicQuizzesOfACourseQuery, TError, TData>(
        ['FetchPublicQuizzesOfACourse', variables],
        fetchData<FetchPublicQuizzesOfACourseQuery, FetchPublicQuizzesOfACourseQueryVariables>(
            FetchPublicQuizzesOfACourseDocument,
            variables,
        ),
        options,
    );

useFetchPublicQuizzesOfACourseQuery.getKey = (
    variables: FetchPublicQuizzesOfACourseQueryVariables,
) => ['FetchPublicQuizzesOfACourse', variables];
useFetchPublicQuizzesOfACourseQuery.fetcher = (
    variables: FetchPublicQuizzesOfACourseQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<FetchPublicQuizzesOfACourseQuery, FetchPublicQuizzesOfACourseQueryVariables>(
        FetchPublicQuizzesOfACourseDocument,
        variables,
        options,
    );
export const SubjectAreasDocument = `
    query subjectAreas {
  badgeCertificationSubjectAreas {
    id
    name
  }
}
    `;
export const useSubjectAreasQuery = <TData = SubjectAreasQuery, TError = unknown>(
    variables?: SubjectAreasQueryVariables,
    options?: UseQueryOptions<SubjectAreasQuery, TError, TData>,
) =>
    useQuery<SubjectAreasQuery, TError, TData>(
        variables === undefined ? ['subjectAreas'] : ['subjectAreas', variables],
        fetchData<SubjectAreasQuery, SubjectAreasQueryVariables>(SubjectAreasDocument, variables),
        options,
    );

useSubjectAreasQuery.getKey = (variables?: SubjectAreasQueryVariables) =>
    variables === undefined ? ['subjectAreas'] : ['subjectAreas', variables];
useSubjectAreasQuery.fetcher = (
    variables?: SubjectAreasQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<SubjectAreasQuery, SubjectAreasQueryVariables>(
        SubjectAreasDocument,
        variables,
        options,
    );
export const BadgeClassIssuerFiltersDocument = `
    query badgeClassIssuerFilters {
  badgeClassIssuers {
    id
    name
  }
}
    `;
export const useBadgeClassIssuerFiltersQuery = <
    TData = BadgeClassIssuerFiltersQuery,
    TError = unknown,
>(
    variables?: BadgeClassIssuerFiltersQueryVariables,
    options?: UseQueryOptions<BadgeClassIssuerFiltersQuery, TError, TData>,
) =>
    useQuery<BadgeClassIssuerFiltersQuery, TError, TData>(
        variables === undefined
            ? ['badgeClassIssuerFilters']
            : ['badgeClassIssuerFilters', variables],
        fetchData<BadgeClassIssuerFiltersQuery, BadgeClassIssuerFiltersQueryVariables>(
            BadgeClassIssuerFiltersDocument,
            variables,
        ),
        options,
    );

useBadgeClassIssuerFiltersQuery.getKey = (variables?: BadgeClassIssuerFiltersQueryVariables) =>
    variables === undefined ? ['badgeClassIssuerFilters'] : ['badgeClassIssuerFilters', variables];
useBadgeClassIssuerFiltersQuery.fetcher = (
    variables?: BadgeClassIssuerFiltersQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeClassIssuerFiltersQuery, BadgeClassIssuerFiltersQueryVariables>(
        BadgeClassIssuerFiltersDocument,
        variables,
        options,
    );
export const BadgeClassWithTopicDocument = `
    query badgeClassWithTopic($id: ID!) {
  badgeClass(id: $id) {
    id
    name
    image {
      id
    }
    description
    type
    tags
    issuer {
      name
    }
    criteria {
      id
    }
    topic {
      id
    }
  }
}
    `;
export const useBadgeClassWithTopicQuery = <TData = BadgeClassWithTopicQuery, TError = unknown>(
    variables: BadgeClassWithTopicQueryVariables,
    options?: UseQueryOptions<BadgeClassWithTopicQuery, TError, TData>,
) =>
    useQuery<BadgeClassWithTopicQuery, TError, TData>(
        ['badgeClassWithTopic', variables],
        fetchData<BadgeClassWithTopicQuery, BadgeClassWithTopicQueryVariables>(
            BadgeClassWithTopicDocument,
            variables,
        ),
        options,
    );

useBadgeClassWithTopicQuery.getKey = (variables: BadgeClassWithTopicQueryVariables) => [
    'badgeClassWithTopic',
    variables,
];
useBadgeClassWithTopicQuery.fetcher = (
    variables: BadgeClassWithTopicQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeClassWithTopicQuery, BadgeClassWithTopicQueryVariables>(
        BadgeClassWithTopicDocument,
        variables,
        options,
    );
export const SearchBadgeClassesDocument = `
    query searchBadgeClasses($query: String!, $issuerIds: [ID!], $certificationAreaIds: [ID!], $page: Int! = 0, $size: Int!) {
  searchBadgeClasses(
    query: $query
    issuerId: $issuerIds
    certificationAreaIds: $certificationAreaIds
    page: $page
    size: $size
  ) {
    items {
      id
      name
      image {
        id
      }
      issuer {
        id
        name
      }
    }
    page
    pageCount
  }
}
    `;
export const useSearchBadgeClassesQuery = <TData = SearchBadgeClassesQuery, TError = unknown>(
    variables: SearchBadgeClassesQueryVariables,
    options?: UseQueryOptions<SearchBadgeClassesQuery, TError, TData>,
) =>
    useQuery<SearchBadgeClassesQuery, TError, TData>(
        ['searchBadgeClasses', variables],
        fetchData<SearchBadgeClassesQuery, SearchBadgeClassesQueryVariables>(
            SearchBadgeClassesDocument,
            variables,
        ),
        options,
    );

useSearchBadgeClassesQuery.getKey = (variables: SearchBadgeClassesQueryVariables) => [
    'searchBadgeClasses',
    variables,
];
useSearchBadgeClassesQuery.fetcher = (
    variables: SearchBadgeClassesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<SearchBadgeClassesQuery, SearchBadgeClassesQueryVariables>(
        SearchBadgeClassesDocument,
        variables,
        options,
    );
export const BadgeClassesByTopicDocument = `
    query badgeClassesByTopic($topicId: ID!) {
  badgeClassesByTopic(topicId: $topicId) {
    id
    name
    image {
      id
    }
    issuer {
      name
    }
  }
}
    `;
export const useBadgeClassesByTopicQuery = <TData = BadgeClassesByTopicQuery, TError = unknown>(
    variables: BadgeClassesByTopicQueryVariables,
    options?: UseQueryOptions<BadgeClassesByTopicQuery, TError, TData>,
) =>
    useQuery<BadgeClassesByTopicQuery, TError, TData>(
        ['badgeClassesByTopic', variables],
        fetchData<BadgeClassesByTopicQuery, BadgeClassesByTopicQueryVariables>(
            BadgeClassesByTopicDocument,
            variables,
        ),
        options,
    );

useBadgeClassesByTopicQuery.getKey = (variables: BadgeClassesByTopicQueryVariables) => [
    'badgeClassesByTopic',
    variables,
];
useBadgeClassesByTopicQuery.fetcher = (
    variables: BadgeClassesByTopicQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeClassesByTopicQuery, BadgeClassesByTopicQueryVariables>(
        BadgeClassesByTopicDocument,
        variables,
        options,
    );
export const LabSearchResponseDocument = `
    query LabSearchResponse($query: String!, $filters: [SearchAggregationInputOption!]) {
  searchLabs(query: $query, filters: $filters) {
    count
    trackingId
    labs {
      id
      title
      description
      learningOutcomes
      activities
      prerequisites
      minEstimatedTime
      maxEstimatedTime
      instructors {
        name
      }
      topics {
        id
      }
      instructors {
        name
      }
      metadata {
        trackingId
      }
    }
  }
}
    `;
export const useLabSearchResponseQuery = <TData = LabSearchResponseQuery, TError = unknown>(
    variables: LabSearchResponseQueryVariables,
    options?: UseQueryOptions<LabSearchResponseQuery, TError, TData>,
) =>
    useQuery<LabSearchResponseQuery, TError, TData>(
        ['LabSearchResponse', variables],
        fetchData<LabSearchResponseQuery, LabSearchResponseQueryVariables>(
            LabSearchResponseDocument,
            variables,
        ),
        options,
    );

useLabSearchResponseQuery.getKey = (variables: LabSearchResponseQueryVariables) => [
    'LabSearchResponse',
    variables,
];
useLabSearchResponseQuery.fetcher = (
    variables: LabSearchResponseQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<LabSearchResponseQuery, LabSearchResponseQueryVariables>(
        LabSearchResponseDocument,
        variables,
        options,
    );
export const SubscriptionPlansByProductTypeDocument = `
    query SubscriptionPlansByProductType($productType: SubscriptionPlanProductType, $licenseCount: Int) {
  subscriptionPlansByProductType(productType: $productType) {
    id
    productType
    urlLearnMore
    urlExpressCheckout
    priceOptions(licenseCount: $licenseCount) {
      ... on MonthlySubscriptionPlanPricingOption {
        id
        listPrice {
          amount
          currency
        }
        renewalInterval {
          type
          count
        }
        trial {
          dateInterval {
            type
            count
          }
        }
        licenseContext {
          unitPrice {
            amount
            currency
          }
          licenseCount
          defaultLicenseCount
          minimumLicenseCount
          maximumLicenseCount
        }
      }
      ... on AnnualSubscriptionPlanPricingOption {
        id
        listPrice {
          amount
          currency
        }
        annualSavings {
          amount
          currency
        }
        monthlyPrice {
          amount
          currency
        }
        renewalInterval {
          type
          count
        }
        trial {
          dateInterval {
            type
            count
          }
        }
        licenseContext {
          unitPrice {
            amount
            currency
          }
          licenseCount
          defaultLicenseCount
          minimumLicenseCount
          maximumLicenseCount
        }
      }
    }
  }
}
    `;
export const useSubscriptionPlansByProductTypeQuery = <
    TData = SubscriptionPlansByProductTypeQuery,
    TError = unknown,
>(
    variables?: SubscriptionPlansByProductTypeQueryVariables,
    options?: UseQueryOptions<SubscriptionPlansByProductTypeQuery, TError, TData>,
) =>
    useQuery<SubscriptionPlansByProductTypeQuery, TError, TData>(
        variables === undefined
            ? ['SubscriptionPlansByProductType']
            : ['SubscriptionPlansByProductType', variables],
        fetchData<
            SubscriptionPlansByProductTypeQuery,
            SubscriptionPlansByProductTypeQueryVariables
        >(SubscriptionPlansByProductTypeDocument, variables),
        options,
    );

useSubscriptionPlansByProductTypeQuery.getKey = (
    variables?: SubscriptionPlansByProductTypeQueryVariables,
) =>
    variables === undefined
        ? ['SubscriptionPlansByProductType']
        : ['SubscriptionPlansByProductType', variables];
useSubscriptionPlansByProductTypeQuery.fetcher = (
    variables?: SubscriptionPlansByProductTypeQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<SubscriptionPlansByProductTypeQuery, SubscriptionPlansByProductTypeQueryVariables>(
        SubscriptionPlansByProductTypeDocument,
        variables,
        options,
    );
export const SubscriptionPlansDocument = `
    query SubscriptionPlans {
  subscriptionPlans {
    id
    listPrice {
      amount
      currency
    }
    renewalInterval {
      type
      count
    }
    trial {
      dateInterval {
        type
        count
      }
    }
    productType
  }
}
    `;
export const useSubscriptionPlansQuery = <TData = SubscriptionPlansQuery, TError = unknown>(
    variables?: SubscriptionPlansQueryVariables,
    options?: UseQueryOptions<SubscriptionPlansQuery, TError, TData>,
) =>
    useQuery<SubscriptionPlansQuery, TError, TData>(
        variables === undefined ? ['SubscriptionPlans'] : ['SubscriptionPlans', variables],
        fetchData<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
            SubscriptionPlansDocument,
            variables,
        ),
        options,
    );

useSubscriptionPlansQuery.getKey = (variables?: SubscriptionPlansQueryVariables) =>
    variables === undefined ? ['SubscriptionPlans'] : ['SubscriptionPlans', variables];
useSubscriptionPlansQuery.fetcher = (
    variables?: SubscriptionPlansQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
        SubscriptionPlansDocument,
        variables,
        options,
    );
export const FetchCurrentSubscriptionEnrollmentDocument = `
    query FetchCurrentSubscriptionEnrollment {
  currentSubscriptionEnrollment {
    id
    subscriber {
      __typename
      ... on Organization {
        id
      }
      ... on User {
        id
      }
    }
    checkoutReference
    trialInterval {
      type
      count
    }
    renewalInterval {
      type
      count
    }
    startDate
    endDate
    cancelDate
    status
    licenseCount
  }
}
    `;
export const useFetchCurrentSubscriptionEnrollmentQuery = <
    TData = FetchCurrentSubscriptionEnrollmentQuery,
    TError = unknown,
>(
    variables?: FetchCurrentSubscriptionEnrollmentQueryVariables,
    options?: UseQueryOptions<FetchCurrentSubscriptionEnrollmentQuery, TError, TData>,
) =>
    useQuery<FetchCurrentSubscriptionEnrollmentQuery, TError, TData>(
        variables === undefined
            ? ['FetchCurrentSubscriptionEnrollment']
            : ['FetchCurrentSubscriptionEnrollment', variables],
        fetchData<
            FetchCurrentSubscriptionEnrollmentQuery,
            FetchCurrentSubscriptionEnrollmentQueryVariables
        >(FetchCurrentSubscriptionEnrollmentDocument, variables),
        options,
    );

useFetchCurrentSubscriptionEnrollmentQuery.getKey = (
    variables?: FetchCurrentSubscriptionEnrollmentQueryVariables,
) =>
    variables === undefined
        ? ['FetchCurrentSubscriptionEnrollment']
        : ['FetchCurrentSubscriptionEnrollment', variables];
useFetchCurrentSubscriptionEnrollmentQuery.fetcher = (
    variables?: FetchCurrentSubscriptionEnrollmentQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        FetchCurrentSubscriptionEnrollmentQuery,
        FetchCurrentSubscriptionEnrollmentQueryVariables
    >(FetchCurrentSubscriptionEnrollmentDocument, variables, options);
export const CancelSubscriptionEnrollmentDocument = `
    mutation CancelSubscriptionEnrollment($id: ID!) {
  subscriptionEnrollmentCancel(id: $id) {
    id
    status
    cancelDate
    endDate
  }
}
    `;
export const useCancelSubscriptionEnrollmentMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        CancelSubscriptionEnrollmentMutation,
        TError,
        CancelSubscriptionEnrollmentMutationVariables,
        TContext
    >,
) =>
    useMutation<
        CancelSubscriptionEnrollmentMutation,
        TError,
        CancelSubscriptionEnrollmentMutationVariables,
        TContext
    >(
        ['CancelSubscriptionEnrollment'],
        (variables?: CancelSubscriptionEnrollmentMutationVariables) =>
            fetchData<
                CancelSubscriptionEnrollmentMutation,
                CancelSubscriptionEnrollmentMutationVariables
            >(CancelSubscriptionEnrollmentDocument, variables)(),
        options,
    );
useCancelSubscriptionEnrollmentMutation.getKey = () => ['CancelSubscriptionEnrollment'];

useCancelSubscriptionEnrollmentMutation.fetcher = (
    variables: CancelSubscriptionEnrollmentMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<CancelSubscriptionEnrollmentMutation, CancelSubscriptionEnrollmentMutationVariables>(
        CancelSubscriptionEnrollmentDocument,
        variables,
        options,
    );
export const ReactivateSubscriptionEnrollmentDocument = `
    mutation ReactivateSubscriptionEnrollment($id: ID!) {
  subscriptionEnrollmentReactivate(id: $id) {
    id
    status
    cancelDate
    endDate
  }
}
    `;
export const useReactivateSubscriptionEnrollmentMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        ReactivateSubscriptionEnrollmentMutation,
        TError,
        ReactivateSubscriptionEnrollmentMutationVariables,
        TContext
    >,
) =>
    useMutation<
        ReactivateSubscriptionEnrollmentMutation,
        TError,
        ReactivateSubscriptionEnrollmentMutationVariables,
        TContext
    >(
        ['ReactivateSubscriptionEnrollment'],
        (variables?: ReactivateSubscriptionEnrollmentMutationVariables) =>
            fetchData<
                ReactivateSubscriptionEnrollmentMutation,
                ReactivateSubscriptionEnrollmentMutationVariables
            >(ReactivateSubscriptionEnrollmentDocument, variables)(),
        options,
    );
useReactivateSubscriptionEnrollmentMutation.getKey = () => ['ReactivateSubscriptionEnrollment'];

useReactivateSubscriptionEnrollmentMutation.fetcher = (
    variables: ReactivateSubscriptionEnrollmentMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        ReactivateSubscriptionEnrollmentMutation,
        ReactivateSubscriptionEnrollmentMutationVariables
    >(ReactivateSubscriptionEnrollmentDocument, variables, options);
export const FeatureVariantAssignmentsDocument = `
    query FeatureVariantAssignments($featureCodes: [String!]!, $realtimeAttributes: [FeatureRequestAttributeInput!]) {
  featureVariantAssignmentsByCodeAndAttributes(
    featureCodes: $featureCodes
    realtimeAttributes: $realtimeAttributes
  ) {
    featureCode
    configuration
    isInExperiment
    experimentIds
  }
}
    `;
export const useFeatureVariantAssignmentsQuery = <
    TData = FeatureVariantAssignmentsQuery,
    TError = unknown,
>(
    variables: FeatureVariantAssignmentsQueryVariables,
    options?: UseQueryOptions<FeatureVariantAssignmentsQuery, TError, TData>,
) =>
    useQuery<FeatureVariantAssignmentsQuery, TError, TData>(
        ['FeatureVariantAssignments', variables],
        fetchData<FeatureVariantAssignmentsQuery, FeatureVariantAssignmentsQueryVariables>(
            FeatureVariantAssignmentsDocument,
            variables,
        ),
        options,
    );

useFeatureVariantAssignmentsQuery.getKey = (variables: FeatureVariantAssignmentsQueryVariables) => [
    'FeatureVariantAssignments',
    variables,
];
useFeatureVariantAssignmentsQuery.fetcher = (
    variables: FeatureVariantAssignmentsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<FeatureVariantAssignmentsQuery, FeatureVariantAssignmentsQueryVariables>(
        FeatureVariantAssignmentsDocument,
        variables,
        options,
    );
