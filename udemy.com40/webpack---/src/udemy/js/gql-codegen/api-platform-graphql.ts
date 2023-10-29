import {useQuery, useMutation, UseQueryOptions, UseMutationOptions} from 'react-query';
import {fetchData} from 'gql-codegen/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]?: Maybe<T[SubKey]>};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]: Maybe<T[SubKey]>};
export type MakeEmpty<T extends {[key: string]: unknown}, K extends keyof T> = {[_ in K]?: never};
export type Incremental<T> =
    | T
    | {[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: {input: string; output: string};
    String: {input: string; output: string};
    Boolean: {input: boolean; output: boolean};
    Int: {input: number; output: number};
    Float: {input: number; output: number};
    AccountNumber: {input: any; output: any};
    AverageRating: {input: any; output: any};
    BigInt: {input: any; output: any};
    Byte: {input: any; output: any};
    CountryCode: {input: any; output: any};
    CourseDuration: {input: any; output: any};
    CourseDurationInSeconds: {input: any; output: any};
    CourseHtmlString: {input: any; output: any};
    Cuid: {input: any; output: any};
    Currency: {input: any; output: any};
    DID: {input: any; output: any};
    Date: {input: any; output: any};
    DateTime: {input: any; output: any};
    Decimal: {input: any; output: any};
    Duration: {input: any; output: any};
    DurationInMinutes: {input: any; output: any};
    DurationInSeconds: {input: any; output: any};
    EmailAddress: {input: any; output: any};
    GUID: {input: any; output: any};
    HSL: {input: any; output: any};
    HSLA: {input: any; output: any};
    HexColorCode: {input: any; output: any};
    Hexadecimal: {input: any; output: any};
    IBAN: {input: any; output: any};
    IPv4: {input: any; output: any};
    IPv6: {input: any; output: any};
    ISBN: {input: any; output: any};
    ISO8601Duration: {input: any; output: any};
    JSON: {input: any; output: any};
    JSONObject: {input: any; output: any};
    JWT: {input: any; output: any};
    Latitude: {input: any; output: any};
    LocalDate: {input: any; output: any};
    LocalEndTime: {input: any; output: any};
    LocalTime: {input: any; output: any};
    Locale: {input: any; output: any};
    Long: {input: any; output: any};
    Longitude: {input: any; output: any};
    MAC: {input: any; output: any};
    MaxResultsPerPage: {input: any; output: any};
    NegativeFloat: {input: any; output: any};
    NegativeInt: {input: any; output: any};
    NonEmptyString: {input: any; output: any};
    NonNegativeFloat: {input: any; output: any};
    NonNegativeInt: {input: any; output: any};
    NonPositiveFloat: {input: any; output: any};
    NonPositiveInt: {input: any; output: any};
    ObjectID: {input: any; output: any};
    PhoneNumber: {input: any; output: any};
    Port: {input: any; output: any};
    PositiveFloat: {input: any; output: any};
    PositiveInt: {input: any; output: any};
    PostalCode: {input: any; output: any};
    RGB: {input: any; output: any};
    RGBA: {input: any; output: any};
    RRuleString: {input: any; output: any};
    RoutingNumber: {input: any; output: any};
    SafeInt: {input: any; output: any};
    Time: {input: any; output: any};
    TimeStamp: {input: any; output: any};
    TimeZone: {input: any; output: any};
    Timestamp: {input: any; output: any};
    URL: {input: any; output: any};
    USCurrency: {input: any; output: any};
    UUID: {input: any; output: any};
    UnsignedFloat: {input: any; output: any};
    UnsignedInt: {input: any; output: any};
    UtcOffset: {input: any; output: any};
    Void: {input: any; output: any};
};

/** Price option for computed price plan. Will be returned for annual plans */
export type AnnualSubscriptionPlanPricingOption = {
    __typename?: 'AnnualSubscriptionPlanPricingOption';
    /** The annual savings amount for the subscription price plan when compared to monthly plans. calculated on pricing backend can be null */
    annualSavings?: Maybe<Money>;
    /** ID of the price option: */
    id: Scalars['ID']['output'];
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

/** An API client */
export type ApiClient = {
    /** The API Client expiration date */
    expiration?: Maybe<Scalars['Date']['output']>;
    /** The API Client ID as UUID */
    id: Scalars['ID']['output'];
    /** The API Client name */
    name: Scalars['String']['output'];
    /** The scopes this API client has access to */
    scopes: Array<Scalars['String']['output']>;
};

/** An API client for an Organization */
export type ApiClientForOrganization = ApiClient & {
    __typename?: 'ApiClientForOrganization';
    /** The API Client expiration date */
    expiration?: Maybe<Scalars['Date']['output']>;
    /** The API Client ID */
    id: Scalars['ID']['output'];
    /** The API Client name */
    name: Scalars['String']['output'];
    /** The organization this API client is for */
    organization: Organization;
    /** The scopes this API client has access to */
    scopes: Array<Scalars['String']['output']>;
};

/** An API client for a Partner */
export type ApiClientForPartner = ApiClient & {
    __typename?: 'ApiClientForPartner';
    /** The API Client expiration date */
    expiration?: Maybe<Scalars['Date']['output']>;
    /** The API Client ID */
    id: Scalars['ID']['output'];
    /** The API Client name */
    name: Scalars['String']['output'];
    /** The partner this API client is for */
    partner: Partner;
    /** The scopes this API client has access to */
    scopes: Array<Scalars['String']['output']>;
};

/** Article lecture */
export type ArticleLecture = Lecture & {
    __typename?: 'ArticleLecture';
    /** Total duration of the lecture's content in seconds */
    durationInSeconds: Scalars['DurationInSeconds']['output'];
    /** Id of the lecture */
    id: Scalars['ID']['output'];
    /** Images by their dimensions */
    images: LectureImages;
    /** The URL of the lecture thumbnail */
    thumbnail?: Maybe<Scalars['URL']['output']>;
    /** Lecture title */
    title: Scalars['String']['output'];
    /** The URL to access the lecture on the auto-enroll page */
    urlAutoEnroll: Scalars['URL']['output'];
    /** Landing page to view this Lecture */
    urlLanding: Scalars['URL']['output'];
};

/** The Assessment object. */
export type Assessment = LearningProduct & {
    __typename?: 'Assessment';
    /** ID of the assessment. */
    id: Scalars['ID']['output'];
};

/** Issued Badge of a user (Assertion in OpenBadge specification) */
export type BadgeAssertion = {
    __typename?: 'BadgeAssertion';
    /** The BadgeClass object that this Assertion is issued for */
    badgeClass: BadgeClass;
    /** The date this assertion expires */
    expires?: Maybe<Scalars['Date']['output']>;
    /** IRI of the Assertion. IRI of OpenBadge specification */
    externalUrl: Scalars['URL']['output'];
    /** ID of the Assertion. */
    id: Scalars['ID']['output'];
    /** The date this assertion is issued */
    issuedOn: Scalars['Date']['output'];
    /** Owner of the assertion */
    user: User;
};

/** Issued badges of a user (Assertion in OpenBadge specification) */
export type BadgeAssertionPaged = Paginated & {
    __typename?: 'BadgeAssertionPaged';
    /** List of BadgeAssertions */
    items: Array<BadgeAssertion>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** Certification Subject Area (topic descriptor) for Open Badges */
export type BadgeCertificationSubjectArea = {
    __typename?: 'BadgeCertificationSubjectArea';
    /** ID of certification subject area */
    id: Scalars['ID']['output'];
    /** Title of certification subject area(Cloud, SQL) */
    name: Scalars['String']['output'];
};

/** The BadgeClass object. A collection of information about the accomplishment recognized by the Open Badge. It means Certification for the most cases. */
export type BadgeClass = {
    __typename?: 'BadgeClass';
    /** An object describing which objectives or educational standards this badge aligns to, if any. */
    alignment?: Maybe<Array<BadgeClassAlignment>>;
    /** User's assertions for the badge class */
    assertions: Array<BadgeAssertion>;
    /** Criteria document describing how to earn the BadgeClass (Certification) */
    criteria: BadgeClassCriteria;
    /** A short description of BadgeClass */
    description: Scalars['String']['output'];
    /** User's enrollments for the badge class */
    enrollments: Array<BadgeClassEnrollment>;
    /** IRI of the BadgeClass. IRI of OpenBadge specification */
    externalUrl: Scalars['URL']['output'];
    /** ID of the BadgeClass. */
    id: Scalars['ID']['output'];
    /** A PNG or SVG image of the BadgeClass */
    image: BadgeClassImage;
    /** Organization that issued the badge. */
    issuer: BadgeClassIssuer;
    /** Name of the BadgeClass */
    name: Scalars['String']['output'];
    /** A tag that describes the type of achievement. (Skills) */
    tags: Array<Scalars['String']['output']>;
    /** Topic of badge class. Can be null for badge classes uploaded by users */
    topic?: Maybe<Topic>;
    /** Type of the BadgeClass. In most cases, this will simply be the string BadgeClass */
    type: Array<Scalars['String']['output']>;
};

/** Alignment object. An intangible item that describes an alignment between a learning resource and a BadgeClass */
export type BadgeClassAlignment = {
    __typename?: 'BadgeClassAlignment';
    /** If applicable, a locally unique string identifier that identifies the alignment target within its framework and/or targetUrl. */
    targetCode?: Maybe<Scalars['String']['output']>;
    /** Short description of the alignment target. */
    targetDescription?: Maybe<Scalars['String']['output']>;
    /** Name of the framework the alignment target. */
    targetFramework?: Maybe<Scalars['String']['output']>;
    /** Name of the alignment. */
    targetName?: Maybe<Scalars['String']['output']>;
    /** URL linking to the official description of the alignment target, for example an individual standard within an educational framework. */
    targetUrl?: Maybe<Scalars['URL']['output']>;
};

/** Descriptive metadata about the achievements necessary to be issued with particular BadgeClass (Certification). */
export type BadgeClassCriteria = {
    __typename?: 'BadgeClassCriteria';
    /** The URI of a webpage that describes in a human-readable format the criteria for the BadgeClass */
    id?: Maybe<Scalars['URL']['output']>;
    /** A narrative of what is needed to earn the badge. */
    narrative?: Maybe<Scalars['String']['output']>;
    /** Type of the Criteria */
    type?: Maybe<Array<Scalars['String']['output']>>;
};

/** Enrolled learning products for a badge class */
export type BadgeClassEnrollment = {
    __typename?: 'BadgeClassEnrollment';
    /** Completion percentage for the learning product */
    completionPercentage: Scalars['NonNegativeFloat']['output'];
    /** Learning Product */
    learningProduct: LearningProduct;
};

/** Image object of BadgeClass or Issuer */
export type BadgeClassImage = {
    __typename?: 'BadgeClassImage';
    /** The author of the image */
    author?: Maybe<Scalars['String']['output']>;
    /** The caption for the image */
    caption?: Maybe<Scalars['String']['output']>;
    /** URI of the image */
    id: Scalars['ID']['output'];
    /** Type of Image */
    type?: Maybe<Array<Scalars['String']['output']>>;
};

/** Issuer of BadgeClass. A collection of information that describes the entity or organization */
export type BadgeClassIssuer = {
    __typename?: 'BadgeClassIssuer';
    /** A short description of the issuer entity or organization. */
    description?: Maybe<Scalars['String']['output']>;
    /** Contact address for the individual or organization. */
    email?: Maybe<Scalars['EmailAddress']['output']>;
    /** Unique IRI for the Issuer/Profile file */
    id: Scalars['ID']['output'];
    /** IRI or document representing an image of the issuer. This must be a PNG or SVG image. */
    image?: Maybe<BadgeClassImage>;
    /** The name of the entity or organization. */
    name: Scalars['String']['output'];
    /** A phone number for the entity. */
    telephone?: Maybe<Scalars['String']['output']>;
    /** Issuer type. In most cases, this will simply be the string Issuer or the more general Profile */
    type: Array<Scalars['String']['output']>;
    /** The homepage or social media profile of the entity, whether individual or institutional */
    url: Scalars['URL']['output'];
};

/** Paginated list of BadgeClasses for search response */
export type BadgeClassSearchResponse = Paginated & {
    __typename?: 'BadgeClassSearchResponse';
    /** List of BadgeClasses */
    items: Array<BadgeClass>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
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
    id: Scalars['ID']['output'];
    /** Name of the category */
    name: Scalars['String']['output'];
    /** Subcategories belonging to the category */
    subcategories: Array<SubCategory>;
};

/** Type of the files withing coding exercise templates */
export type CodeFile = {
    __typename?: 'CodeFile';
    /** Content of the codefile inside one of the file list of the coding exercise template */
    content: Scalars['String']['output'];
    /** File name of the codefile inside one of file list of the coding exercise template */
    fileName: Scalars['String']['output'];
};

/** Coding exercise for students to practice their programming */
export type CodingExercise = {
    __typename?: 'CodingExercise';
    /** Problem statement */
    description?: Maybe<Scalars['String']['output']>;
    /** The Id of the coding exercise */
    id: Scalars['ID']['output'];
    /** The title of the coding exercise */
    title: Scalars['String']['output'];
    /** Landing page to view this CodingExercise */
    urlLanding: Scalars['URL']['output'];
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
    /** React 18 */
    React_18 = 'REACT_18',
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
    description: Scalars['String']['output'];
    /** Language of the coding exercise template */
    language: CodingExerciseLanguageOption;
    /** Name of the coding exercise template */
    name: Scalars['String']['output'];
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
    id: Scalars['ID']['output'];
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
    description?: Maybe<Scalars['CourseHtmlString']['output']>;
    /** Total duration of the course's content */
    duration?: Maybe<Scalars['CourseDuration']['output']>;
    /** Total duration of the course's content in seconds */
    durationInSeconds?: Maybe<Scalars['CourseDurationInSeconds']['output']>;
    /** Total duration of video content only */
    durationVideoContent?: Maybe<Scalars['CourseDurationInSeconds']['output']>;
    /** Whether a learner can enroll in a course or not */
    enrollable: Scalars['Boolean']['output'];
    /** Learners enrolled in a course */
    enrollments: CourseEnrollments;
    /** Headline to show under the title */
    headline?: Maybe<Scalars['String']['output']>;
    /** ID of the course. */
    id: Scalars['ID']['output'];
    /** Images by their dimensions */
    images: CourseImages;
    /** Instructors of the Course */
    instructors: Array<CourseInstructor>;
    /** What you will learn in this course */
    learningOutcome: Array<Scalars['String']['output']>;
    /** Instruction level of the course */
    level?: Maybe<DifficultyLevel>;
    /** Course locale e.g. en-US or en-GB */
    locale: Scalars['Locale']['output'];
    /** The UB organization this course belongs to, only visible if you are part of that organization */
    organization?: Maybe<Organization>;
    /** Organization specific course properties, only visible if you are part of that organization */
    organizationInfo?: Maybe<CourseOrganizationInfo>;
    /** Prerequisites for taking the course */
    prerequisites: Array<Scalars['String']['output']>;
    /** Primary topic course is tagged with */
    primaryTopic?: Maybe<Topic>;
    /** Whether the course is publicly available or not */
    private?: Maybe<Scalars['Boolean']['output']>;
    /** Promotional video for the course. Clients need to renew it if URL expires by querying it again. */
    promoVideo?: Maybe<CoursePromoVideo>;
    /** How do students rate the course */
    rating: CourseRating;
    /** Who should attend the course */
    targetAudience: Array<Scalars['String']['output']>;
    /** Title of the course. */
    title?: Maybe<Scalars['String']['output']>;
    /** Topics course is tagged with */
    topics?: Maybe<Array<Topic>>;
    /** When the course was last updated */
    updated?: Maybe<Scalars['Date']['output']>;
    /**
     * The URL to access the course landing page
     * @deprecated url field is deprecated. Use urlCourseLanding instead.
     */
    url?: Maybe<Scalars['URL']['output']>;
    /** The URL to access the auto-enroll page */
    urlAutoEnroll?: Maybe<Scalars['URL']['output']>;
    /** The URL to access the course landing page */
    urlCourseLanding?: Maybe<Scalars['URL']['output']>;
    /** Mobile Native deep link of the course */
    urlMobileNativeDeeplink: Scalars['URL']['output'];
    /** Activity ID of xAPI statement to identify course */
    xapiActivityId: Scalars['ID']['output'];
};

/** Accreditations */
export type CourseAccreditation = {
    __typename?: 'CourseAccreditation';
    /** Start date of accreditation */
    compliantSince?: Maybe<Scalars['Date']['output']>;
    /** The amount of credits this accreditations supplies */
    creditCount: Scalars['NonNegativeFloat']['output'];
    /** The level of the accreditation */
    level?: Maybe<Scalars['String']['output']>;
    /** Technical subject area */
    subject?: Maybe<Scalars['String']['output']>;
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
    automaticallyGenerated: Scalars['Boolean']['output'];
    /** The caption's locale */
    locale: Scalars['Locale']['output'];
    /** The caption type, either subtitles or closed captions */
    type: CaptionType;
};

/** A catalog of all courses available to the client */
export type CourseCatalogResponsePaged = {
    __typename?: 'CourseCatalogResponsePaged';
    /** Courses added since last sync or all courses if syncToken is not provided */
    addedCourses: Array<Course>;
    /** Cursor to get the next page. Null if no more results available */
    cursor?: Maybe<Scalars['String']['output']>;
    /** Course IDs for courses removed since last sync */
    removedCourses: Array<Scalars['ID']['output']>;
    /** Sync Token to use for the next delta sync */
    syncToken: Scalars['String']['output'];
    /** Courses updated since last sync */
    updatedCourses: Array<Course>;
};

/** Category the Course belongs to */
export type CourseCategory = Category & {
    __typename?: 'CourseCategory';
    /** ID of the category */
    id: Scalars['ID']['output'];
    /** Name of the category */
    name: Scalars['String']['output'];
    /** Subcategories belonging to the category */
    subcategories: Array<CourseSubCategory>;
    /** The URL to the category page this course is a part of */
    url: Scalars['URL']['output'];
};

/** Enrollments belonging to the course */
export type CourseEnrollments = {
    __typename?: 'CourseEnrollments';
    /** Exact count of how many students are there currently enrolled (course purchase and subscription). Requires token scope 'udemy:application' to access. */
    count: Scalars['Int']['output'];
    /**
     * Count of how many students are currently enrolled (course purchase and subscription) rounded to the nearest decimal
     * Exception: if there are fewer than 10 enrollments we show the exact amount (instead of 0)
     */
    roundedCount: Scalars['Int']['output'];
};

/** Course images by varying dimensions */
export type CourseImages = {
    __typename?: 'CourseImages';
    /** Course preview image with 125 pixels height */
    height125?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 200 pixels height */
    height200?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 48x27 dimensions in pixels */
    px48x27?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 50x50 dimensions in pixels */
    px50x50?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 75x75 dimensions in pixels */
    px75x75?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 96x54 dimensions in pixels */
    px96x54?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 100x100 dimensions in pixels */
    px100x100?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 240x135 dimensions in pixels */
    px240x135?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 304x171 dimensions in pixels */
    px304x171?: Maybe<Scalars['String']['output']>;
    /** Course preview image with 480x270 dimensions in pixels */
    px480x270?: Maybe<Scalars['String']['output']>;
};

/** Instructor for a course */
export type CourseInstructor = Instructor & {
    __typename?: 'CourseInstructor';
    /** ID of the Instructor */
    id: Scalars['ID']['output'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String']['output'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']['output']>;
};

/** Organization specific course properties */
export type CourseOrganizationInfo = {
    __typename?: 'CourseOrganizationInfo';
    /** True if this course was purchased separately from the marketplace */
    isMarketplaceImported?: Maybe<Scalars['Boolean']['output']>;
    /** True if this course was created specifically for this organization */
    isOrganizationSpecific?: Maybe<Scalars['Boolean']['output']>;
    /** If not null returns the Date this course will retire from organization's content collection */
    retireOn?: Maybe<Scalars['Date']['output']>;
};

/** Object to store URL and expiration time for course's promo video */
export type CoursePromoVideo = {
    __typename?: 'CoursePromoVideo';
    /** Expiration time of the promo video URL. If null URL doesn't expire */
    expiration?: Maybe<Scalars['TimeStamp']['output']>;
    /** URL for a promo video asset in mp4 format */
    url: Scalars['URL']['output'];
};

/** Ratings of a course */
export type CourseRating = {
    __typename?: 'CourseRating';
    /** Weighted average rating. Ranges from 0 to 5.0. */
    average?: Maybe<Scalars['AverageRating']['output']>;
    /** Number of ratings */
    count: Scalars['Int']['output'];
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
    minAverageRating?: InputMaybe<Scalars['AverageRating']['input']>;
    /** Whether or not course must have closed captions */
    mustHaveClosedCaption?: InputMaybe<Scalars['Boolean']['input']>;
    /** Whether or not course must have coding exercises */
    mustHaveCodingExercise?: InputMaybe<Scalars['Boolean']['input']>;
    /** Whether or not course must have practice tests */
    mustHavePracticeTest?: InputMaybe<Scalars['Boolean']['input']>;
    /** Whether or not course must have quizzes */
    mustHaveQuiz?: InputMaybe<Scalars['Boolean']['input']>;
    /** Whether or not course must have workspaces */
    mustHaveWorkspace?: InputMaybe<Scalars['Boolean']['input']>;
    /** Filter courses based on topics */
    topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    /** Filter course based on video length */
    videoLength?: InputMaybe<Array<VideoLength>>;
};

/** List of Courses and additional data about search response */
export type CourseSearchResponse = Paginated & {
    __typename?: 'CourseSearchResponse';
    /** Total number of Courses matching the search query and filters. */
    count: Scalars['Int']['output'];
    /** List of Course objects. */
    courses: Array<Course>;
    /** Identifies available search filter facets. */
    filterOptions: Array<SearchAggregation>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages in search response */
    pageCount: Scalars['Int']['output'];
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
    description?: Maybe<Scalars['String']['output']>;
    /** Identifier for the course section */
    id: Scalars['Int']['output'];
    /** Content of the section */
    items: Array<CurriculumItem>;
    /** Title of the section */
    title: Scalars['String']['output'];
};

/** SubCategory that is part of CourseCategory */
export type CourseSubCategory = SubCategory & {
    __typename?: 'CourseSubCategory';
    /** ID of the subcategory */
    id: Scalars['ID']['output'];
    /** Name of the subcategory */
    name: Scalars['String']['output'];
    /** The URL to the subcategory page this course is a part of */
    url: Scalars['URL']['output'];
};

/** Input for creating an API client */
export type CreateApiClientRequestInput = {
    /** The API Client name */
    name: Scalars['String']['input'];
    /** The scopes this API client has access to */
    scopes: Array<Scalars['String']['input']>;
};

/** Response from creating an API client containing ApiClient info and client's secret */
export type CreateApiClientResponse = {
    __typename?: 'CreateApiClientResponse';
    /** The created API Client */
    apiClient: ApiClient;
    /** Client Secret for the created API Client */
    clientSecret: Scalars['String']['output'];
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

/** Price option for computed price plan. Will be returned for daily plans */
export type DailySubscriptionPlanPricingOption = {
    __typename?: 'DailySubscriptionPlanPricingOption';
    /** ID of the price option: */
    id: Scalars['ID']['output'];
    /** Contains information about the license context for a given subscription plan price option */
    licenseContext?: Maybe<SubscriptionPlanLicenseContext>;
    /** The list price of the subscription price plan based on provided requested count from request */
    listPrice: Money;
    /** Interval for renewing the subscription plan ie the length of the subscription plan */
    renewalInterval: DateInterval;
    /** Field containing details about the trial subscription offer for a given user. Null indicates no trial is available */
    trial?: Maybe<SubscriptionTrial>;
};

/** Type representing details about an interval of dates */
export type DateInterval = {
    __typename?: 'DateInterval';
    /** The count of type in the interval */
    count: Scalars['Int']['output'];
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

/** Paginated list of supply gap opportunities */
export type DeprecatedSupplyGapOpportunitiesResponse = Paginated & {
    __typename?: 'DeprecatedSupplyGapOpportunitiesResponse';
    /** List of supply gap opportunities */
    items: Array<DeprecatedSupplyGapOpportunity>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** Missing area/gap in the UB catalog that can be filled by the course(s). Supply gap opportunities are presented to Instructors */
export type DeprecatedSupplyGapOpportunity = {
    __typename?: 'DeprecatedSupplyGapOpportunity';
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The instructional level of the opportunity
     */
    courseInstructionalLevel?: Maybe<DeprecatedSupplyGapOpportunityInstructionalLevel>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The language of the course for which the opportunity is being generated
     */
    courseLanguage: Scalars['String']['output'];
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The display rule for the opportunity
     */
    displayRule?: Maybe<DeprecatedSupplyGapOpportunityDisplayRule>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The domain of the course for which the opportunity is being generated
     */
    domain: Scalars['String']['output'];
    /** The unique identifier for the opportunity */
    id: Scalars['ID']['output'];
    /** The intended audience of the opportunity */
    intendedAudience?: Maybe<Scalars['String']['output']>;
    /** Whether the opportunity is eligible for financial incentives */
    isFinancialIncentiveEligible: Scalars['Boolean']['output'];
    /** The key content of the opportunity */
    keyContent?: Maybe<Scalars['String']['output']>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The type of opportunity
     */
    opportunityType?: Maybe<DeprecatedSupplyGapOpportunityType>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The priority level of the opportunity
     */
    priorityLevel?: Maybe<DeprecatedSupplyGapOpportunityPriorityLevel>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * The subject of the course for which the opportunity is being generated
     */
    subject: Scalars['String']['output'];
};

/** Display rule for the supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityDisplayRule {
    /** Display opportunity to all instructors */
    AllInstructors = 'ALL_INSTRUCTORS',
    /** Do not display opportunity */
    Exclude = 'EXCLUDE',
    /** Display opportunity only to internal users */
    InternalOnly = 'INTERNAL_ONLY',
    /** Display opportunity only to IP/VIP instructors */
    IpOnly = 'IP_ONLY',
    /** Opportunity is no longer a priority */
    NoLongerAPriority = 'NO_LONGER_A_PRIORITY',
}

/**
 * Filter options for supply gap opportunities.
 * All filters are optional and provided filters are ANDed together.
 * If same filter is provided with multiple values, they are ORed together.
 */
export type DeprecatedSupplyGapOpportunityFilters = {
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given instructional levels
     */
    courseInstructionalLevels?: InputMaybe<Array<DeprecatedSupplyGapOpportunityInstructionalLevel>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given course languages
     */
    courseLanguages?: InputMaybe<Array<Scalars['String']['input']>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given display rules
     */
    displayRules?: InputMaybe<Array<DeprecatedSupplyGapOpportunityDisplayRule>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given domains
     */
    domains?: InputMaybe<Array<Scalars['String']['input']>>;
    /** Include opportunities for the given intended audiences */
    intendedAudiences?: InputMaybe<Array<Scalars['String']['input']>>;
    /** Include opportunities that are eligible for financial incentives */
    isFinancialIncentiveEligible?: InputMaybe<Scalars['Boolean']['input']>;
    /** Include opportunities for the given key contents */
    keyContents?: InputMaybe<Array<Scalars['String']['input']>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given mx category references.
     * mxCategoryReferences is used to filter opportunities whose domains (UB categories)
     * are mapped to the given mx_category_references.
     * Please note that in requests, either domains or mx_category_references should be used, but not both.
     */
    mxCategoryReferences?: InputMaybe<Array<Scalars['String']['input']>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given opportunity types
     */
    opportunityTypes?: InputMaybe<Array<DeprecatedSupplyGapOpportunityType>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given priority levels
     */
    priorityLevels?: InputMaybe<Array<DeprecatedSupplyGapOpportunityPriorityLevel>>;
    /**
     * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
     * Include opportunities for the given subjects
     */
    subjects?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Instructional level of the supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityInstructionalLevel {
    /** Opportunity is appropriate for all skill levels */
    AllLevels = 'ALL_LEVELS',
    /** Opportunity is for students with any level of knowledge */
    AnyLevel = 'ANY_LEVEL',
    /** Opportunity is for beginners */
    Beginner = 'BEGINNER',
    /** Opportunity is for students with expert knowledge */
    Expert = 'EXPERT',
    /** Opportunity is for students with intermediates knowledge */
    Intermediate = 'INTERMEDIATE',
}

/** Priority level of the supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityPriorityLevel {
    /** High priority */
    High = 'HIGH',
    /** Low priority */
    Low = 'LOW',
    /** Medium priority */
    Medium = 'MEDIUM',
}

/** The type of supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityType {
    /** First mover opportunity */
    FirstMover = 'FIRST_MOVER',
    /** Specialized opportunity */
    Specialized = 'SPECIALIZED',
    /** Trending opportunity */
    Trending = 'TRENDING',
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
    key: Scalars['String']['input'];
    /** Value, ex: 20220322_v1 */
    value: Scalars['String']['input'];
};

/** Holds assigned feature variant  */
export type FeatureVariantAssignment = {
    __typename?: 'FeatureVariantAssignment';
    /** Configuration data of assigned feature variant */
    configuration?: Maybe<Scalars['JSON']['output']>;
    /** List of experiment ids bucketed for current feature */
    experimentIds: Array<Scalars['Int']['output']>;
    /** Feature code of assigned feature variant */
    featureCode: Scalars['String']['output'];
    /** Shows whether this feature variant is in experiment */
    isInExperiment?: Maybe<Scalars['Boolean']['output']>;
};

/** Instructor for a learning product */
export type Instructor = {
    /** ID of the Instructor */
    id: Scalars['ID']['output'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String']['output'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']['output']>;
};

/** Instructor images by varying dimensions */
export type InstructorImages = {
    __typename?: 'InstructorImages';
    /** Instructor image with 50x50 dimensions in pixels */
    px50x50?: Maybe<Scalars['String']['output']>;
};

/** The Lab object. */
export type Lab = LearningProduct & {
    __typename?: 'Lab';
    /** Bulleted list of things a person will accomplish in this Lab. */
    activities: Array<Scalars['String']['output']>;
    /** Top level description of the Lab. */
    description: Scalars['String']['output'];
    /** ID of the Lab. */
    id: Scalars['ID']['output'];
    /** The Lab's Instructors */
    instructors: Array<LabInstructor>;
    /** Bulleted list of things a person will learn in this Lab. */
    learningOutcomes: Array<Scalars['String']['output']>;
    /** Upper bound of estimated time (in seconds) to complete Lab. */
    maxEstimatedTime: Scalars['Int']['output'];
    /** Metadata associated with the lab */
    metadata?: Maybe<LabMetaData>;
    /** Lower bound of estimated time (in seconds) to complete Lab. */
    minEstimatedTime: Scalars['Int']['output'];
    /** Bulleted list of things a person should already know in order to do this Lab. */
    prerequisites: Array<Scalars['String']['output']>;
    /** Title of the Lab. */
    title: Scalars['String']['output'];
    /** The Lab's topics */
    topics?: Maybe<Array<Topic>>;
};

/** Instructor for a lab */
export type LabInstructor = Instructor & {
    __typename?: 'LabInstructor';
    /** ID of the Instructor */
    id: Scalars['ID']['output'];
    /** Instructor's image by varying pixels */
    images: InstructorImages;
    /** Instructor's name */
    name: Scalars['String']['output'];
    /** The URL to access the instructor page */
    url?: Maybe<Scalars['URL']['output']>;
};

/** MetaData for a lab */
export type LabMetaData = {
    __typename?: 'LabMetaData';
    /** Unique analytics ID for this instance of Lab returned from the server in this request. */
    trackingId?: Maybe<Scalars['String']['output']>;
};

/** List of Labs and additional data about search response */
export type LabSearchResponse = {
    __typename?: 'LabSearchResponse';
    /** Total number of Labs matching the search query and filters. */
    count: Scalars['Int']['output'];
    /** Identifies available search filter facets. */
    filterOptions: Array<SearchAggregation>;
    /** List of Lab objects. */
    labs: Array<Lab>;
    /** Search analytics tracking id; for uniquely identifying this query and result set; for this request */
    trackingId: Scalars['String']['output'];
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

/** The Learning Community */
export type LearningCommunity = {
    __typename?: 'LearningCommunity';
    /** The reason for creating the learning community */
    creationReason: LearningCommunityCreateReason;
    /** The learning community description */
    description?: Maybe<Scalars['String']['output']>;
    /** The learning community ID. */
    id: Scalars['UUID']['output'];
    /** The members to the learning community, owner/creator is included here too */
    members: Array<User>;
    /** The number of members in the learning community */
    numberOfMembers: Scalars['Int']['output'];
    /** The organization in which the learning community is created */
    organizationId: Scalars['ID']['output'];
    /** The owner/creator of the learning community */
    owner: User;
    /** The learning community title */
    title: Scalars['String']['output'];
    /** The topics selected for the learning community, should not be empty */
    topics: Array<Topic>;
};

/** A page of Learning Community Activities */
export type LearningCommunityActivitiesPaged = {
    __typename?: 'LearningCommunityActivitiesPaged';
    /** The cursor to the next Learning Community Activities Page */
    cursor?: Maybe<Scalars['String']['output']>;
    /** The activities in this page */
    items: Array<LearningCommunityActivity>;
};

/** An activity is an event initiated by a user */
export type LearningCommunityActivity = {
    __typename?: 'LearningCommunityActivity';
    /** The user who initiated the event */
    by: User;
    /** The event */
    event: LearningCommunityActivityEvent;
};

/** All the activity types presented in a learning community activity feed */
export type LearningCommunityActivityEvent =
    | LearningCommunityCurriculumItemEvent
    | LearningProductEvent;

/** The input used for Adding new members to the learning community */
export type LearningCommunityAddMembersInput = {
    /** The invitation used to send to new members */
    invitation: LearningCommunityInviteInput;
    /** New member's ID to be added to the learning community, can not be empty */
    userIds: Array<Scalars['ID']['input']>;
};

/** The Reason for creating a new Learning Community */
export type LearningCommunityCreateReason = {
    __typename?: 'LearningCommunityCreateReason';
    /** If type is equal to OTHER you have to provide a text for Reason */
    text?: Maybe<Scalars['String']['output']>;
    /** The Reason for creating the learning community */
    type: LearningCommunityCreateReasonType;
};

/** The Reason for creating a new Learning Community */
export type LearningCommunityCreateReasonInput = {
    /** If type is equal to OTHER, you have to provide a text for Reason. */
    text?: InputMaybe<Scalars['String']['input']>;
    /** The Reason for creating the learning community */
    type: LearningCommunityCreateReasonType;
};

/** The Reasons for creating a new Learning Community */
export enum LearningCommunityCreateReasonType {
    /** The reason to create the Learning Community was to initiate a company-wide transformation */
    CompanyWideTransformationInitiate = 'COMPANY_WIDE_TRANSFORMATION_INITIATE',
    /** The reason to create the Learning Community was compliance training */
    ComplianceTraining = 'COMPLIANCE_TRAINING',
    /** The reason to create the Learning Community was to learn new skill(s) in a social setting */
    LearnNewSkillsTogetherWithOthers = 'LEARN_NEW_SKILLS_TOGETHER_WITH_OTHERS',
    /** The reason to create the Learning Community was to onboard new member(s) to a team */
    OnboardingANewTeam = 'ONBOARDING_A_NEW_TEAM',
    /** The reason to create the Learning Community was not included so a free text is provided */
    Other = 'OTHER',
    /** The reason to create the Learning Community was to Study for a certificate */
    StudyForACertificate = 'STUDY_FOR_A_CERTIFICATE',
}

/** An event happening to a curriculum item which is part of a course */
export type LearningCommunityCurriculumItemEvent = {
    __typename?: 'LearningCommunityCurriculumItemEvent';
    /** The course containing the item */
    course: Course;
    /** The moment in time which the event happend */
    dateTime: Scalars['DateTime']['output'];
    /** Type of event happening to the item */
    eventType: LearningCommunityCurriculumItemEventType;
    /** The curriculum item */
    item: CurriculumItem;
};

/** The type of events that happens to a curriculum item */
export enum LearningCommunityCurriculumItemEventType {
    /** Completed working on/watching a curriculum item */
    Completed = 'COMPLETED',
}

/** The input used for creating a new Learning Community */
export type LearningCommunityInput = {
    /** The reason for creating the learning community */
    creationReason: LearningCommunityCreateReasonInput;
    /** The learning community description */
    description?: InputMaybe<Scalars['String']['input']>;
    /** The learning community title */
    title: Scalars['String']['input'];
    /** The topics selected for the learning community, can not be empty */
    topicIds: Array<Scalars['ID']['input']>;
};

/** The input used for inviting new members to the learning community */
export type LearningCommunityInviteInput = {
    /** Invitation language */
    language: LanguageCode;
    /** Invitation Message */
    message: Scalars['String']['input'];
};

/** The input used for Removing members to the learning community */
export type LearningCommunityRemoveMembersInput = {
    /** Old members ID to be removed from the learning community, can not be empty */
    userIds: Array<Scalars['ID']['input']>;
};

/** The learning path object. */
export type LearningPath = {
    /** Description of the learning path. */
    description?: Maybe<Scalars['String']['output']>;
    /** ID of the learning path. */
    id: Scalars['ID']['output'];
    /** Number of items in the learning path. */
    itemCount: Scalars['Int']['output'];
    /** Total No of enrollments for the learning path. */
    numberOfEnrollments: Scalars['Int']['output'];
    /** Title of the learning path. */
    title: Scalars['String']['output'];
};

/** All partner's content collection items that are available, currently just course */
export type LearningProduct = {
    /** ID of the learning product */
    id: Scalars['ID']['output'];
};

/** An event happening to a learning product in a moment in time */
export type LearningProductEvent = {
    __typename?: 'LearningProductEvent';
    /** The moment in time which the event happened */
    dateTime: Scalars['DateTime']['output'];
    /** The type of event on the learning product */
    eventType: LearningProductEventType;
    /** The learning product */
    product: LearningProduct;
};

/** The type of events that happens to a learning product and matters to the learning community service */
export enum LearningProductEventType {
    /** Completed working on/watching a learning product */
    Completed = 'COMPLETED',
    /** Enrolled in a course */
    Enrolled = 'ENROLLED',
    /** Started working on/watching a learning product (lecture, lab, etc.) */
    Started = 'STARTED',
}

/** Input for getting badge classes by learning products */
export type LearningProductInput = {
    /** ID of the learning product */
    id: Scalars['ID']['input'];
    /** Type of the learning product */
    type: LearningProductType;
    /** Version ID of the learning product */
    versionId?: InputMaybe<Scalars['String']['input']>;
};

/** Type of learning product. */
export enum LearningProductType {
    /** Assessment */
    Assessment = 'ASSESSMENT',
    /** Course */
    Course = 'COURSE',
    /** Lab */
    Lab = 'LAB',
    /** Learning path */
    LearningPath = 'LEARNING_PATH',
}

/** A collection of learning products for a partner */
export type LearningProductsPaged = Paginated & {
    __typename?: 'LearningProductsPaged';
    /** The contents of the collection, currently just courses. Items may be less than requested size if objects become unavailable */
    items: Array<LearningProduct>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** The LearningReminder object. */
export type LearningReminder = {
    __typename?: 'LearningReminder';
    /** Calendar Type for the learning reminder */
    calendarType?: Maybe<LearningReminderCalendarType>;
    /** Duration of the learning event. */
    durationInMinutes?: Maybe<Scalars['DurationInMinutes']['output']>;
    /** End date of the recurring learning reminders. */
    endDate: Scalars['DateTime']['output'];
    /** ID of the learning reminder. */
    id: Scalars['ID']['output'];
    /** Learning product of the learning reminder. */
    learningProduct?: Maybe<LearningProduct>;
    /** The recurrence rule for the reminder */
    recurrencePattern?: Maybe<Scalars['RRuleString']['output']>;
    /** Delivery method for the learning reminder */
    reminderMethod: LearningReminderNotificationMethod;
    /** When to show the reminder, expressed as minutes before the learning reminder start time */
    reminderMinutesBefore: Scalars['Int']['output'];
    /** Start date of the first recurring learning reminder. */
    startDate: Scalars['DateTime']['output'];
    /** Title of the learning reminder. */
    title: Scalars['String']['output'];
};

/** Calendar type of the learning reminder */
export enum LearningReminderCalendarType {
    /** Apple Calendar Type */
    Apple = 'APPLE',
    /** Google Calendar Type */
    Google = 'GOOGLE',
    /** Other Calendars */
    Other = 'OTHER',
    /** Outlook Calendar Type */
    Outlook = 'OUTLOOK',
}

/** Input for creating and updating a learning reminder */
export type LearningReminderInput = {
    /** Calendar Type for the learning reminder */
    calendarType?: InputMaybe<LearningReminderCalendarType>;
    /** Duration of the learning event. */
    duration?: InputMaybe<Scalars['DurationInMinutes']['input']>;
    /** End date of the recurring learning reminders. */
    endDate: Scalars['DateTime']['input'];
    /** Learning product of the learning reminder. */
    learningProduct?: InputMaybe<LearningReminderLearningProductInput>;
    /** The recurrence rule for the reminder */
    recurrencePattern?: InputMaybe<Scalars['RRuleString']['input']>;
    /** Delivery method for the learning reminder */
    reminderMethod: LearningReminderNotificationMethod;
    /** When to show the reminder, expressed as minutes before the learning reminder start time */
    reminderMinutesBefore: Scalars['Int']['input'];
    /** Start date of the first recurring learning reminder. */
    startDate: Scalars['DateTime']['input'];
    /** Title of the learning reminder. */
    title: Scalars['String']['input'];
};

/** Input for learning product of the learning reminder */
export type LearningReminderLearningProductInput = {
    /** ID of the learning product. */
    id: Scalars['ID']['input'];
    /** ID of the learning product. */
    type: Scalars['String']['input'];
};

/** Notification method of the learning reminder */
export enum LearningReminderNotificationMethod {
    /** Email Reminder Method */
    Email = 'EMAIL',
    /** Push Reminder Method */
    Push = 'PUSH',
}

/** Paginated learning reminders of the user */
export type LearningRemindersPaged = Paginated & {
    __typename?: 'LearningRemindersPaged';
    /** Learning reminders of the user */
    items: Array<LearningReminder>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** Represents a lecture type  */
export type Lecture = {
    /** Total duration of the lecture's content in seconds */
    durationInSeconds: Scalars['DurationInSeconds']['output'];
    /** Id of the lecture */
    id: Scalars['ID']['output'];
    /** Images by their dimensions */
    images: LectureImages;
    /** The URL of the lecture thumbnail */
    thumbnail?: Maybe<Scalars['URL']['output']>;
    /** Lecture title */
    title: Scalars['String']['output'];
    /** The URL to access the lecture on the auto-enroll page */
    urlAutoEnroll: Scalars['URL']['output'];
    /** Landing page to view this Lecture */
    urlLanding: Scalars['URL']['output'];
};

/** Lecture images by varying dimensions */
export type LectureImages = {
    __typename?: 'LectureImages';
    /** Lecture preview image with 50 pixels height */
    height50?: Maybe<Scalars['String']['output']>;
    /** Lecture preview image with 75 pixels height */
    height75?: Maybe<Scalars['String']['output']>;
    /** Lecture preview image with 100 pixels height */
    height100?: Maybe<Scalars['String']['output']>;
    /** Lecture preview image with 320 pixels height */
    height320?: Maybe<Scalars['String']['output']>;
    /** Lecture preview image with 480 pixels height */
    height480?: Maybe<Scalars['String']['output']>;
};

/** List of LectureResults and additional data about search response */
export type LectureSearchResponse = {
    __typename?: 'LectureSearchResponse';
    /** List of LectureResult objects. */
    lectures: Array<LectureSearchResult>;
    /** Metadata for whole search result used by front end */
    metadata?: Maybe<LectureSearchResponseMetadata>;
};

/** Contains info for front end related stuff and tracking info. This data calculated by backend service. */
export type LectureSearchResponseMetadata = {
    __typename?: 'LectureSearchResponseMetadata';
    /** Experiment variant for the lecture unit  */
    lectureExperimentVariant: Scalars['String']['output'];
    /** Indicates whether lab unit should be shown */
    showLabUnit: Scalars['Boolean']['output'];
    /** Indicates whether lecture discovery unit is shown */
    showLectureDiscoveryUnit: Scalars['Boolean']['output'];
    /** Search analytics tracking id; for uniquely identifying this query and result set; for this request */
    trackingId: Scalars['String']['output'];
};

/** Identifies each result for lecture search. */
export type LectureSearchResult = {
    __typename?: 'LectureSearchResult';
    /** Containing course of the found lecture. */
    course: Course;
    /** Found lecture for lecture search request. */
    lecture: Lecture;
    /** Unique analytics ID for the found lecture. */
    trackingId?: Maybe<Scalars['String']['output']>;
};

/** License pool */
export type LicensePool = {
    __typename?: 'LicensePool';
    /** The License pool unique identifier */
    id: Scalars['ID']['output'];
    /** True if it is a default pool */
    isDefault: Scalars['Boolean']['output'];
    /** Set of license counts assigned to this license pool */
    licenseCounts: Array<LicensePoolProductTypeCount>;
    /** Pool name */
    name: Scalars['String']['output'];
    /** The organization this pool is assigned to */
    organization: Organization;
};

/** Product type license count */
export type LicensePoolProductTypeCount = {
    __typename?: 'LicensePoolProductTypeCount';
    /** The current max license count */
    maxLicenseCount: Scalars['Int']['output'];
    /** The product type this license count is assigned to */
    productType: SubscriptionPlanProductType;
    /** The current used license count for this license count */
    usedLicenseCount: Scalars['Int']['output'];
};

/** Money */
export type Money = {
    __typename?: 'Money';
    /** Amount */
    amount?: Maybe<Scalars['Decimal']['output']>;
    /** Currency */
    currency?: Maybe<CurrencyCode>;
};

/** Price option for computed price plan. Will be returned for monthly plans */
export type MonthlySubscriptionPlanPricingOption = {
    __typename?: 'MonthlySubscriptionPlanPricingOption';
    /** ID of the price option: */
    id: Scalars['ID']['output'];
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
    /** Create an API client for an organization or partner */
    apiClientCreate: CreateApiClientResponse;
    /** Delete an API client for an organization or partner, returns the deleted API Client ID */
    apiClientDelete?: Maybe<Scalars['ID']['output']>;
    /** Delete assertion of current user with given id */
    badgeAssertionDelete?: Maybe<Scalars['ID']['output']>;
    /** Storing assertion (which is given as external url) for current user */
    badgeAssertionStoreByUrl?: Maybe<BadgeAssertion>;
    /** Add members to a Learning Community */
    learningCommunityAddMembers?: Maybe<Scalars['Boolean']['output']>;
    /** Create a new Learning Community. */
    learningCommunityCreate?: Maybe<LearningCommunity>;
    /** Delete an existing Learning Community by ID. */
    learningCommunityDelete?: Maybe<Scalars['Boolean']['output']>;
    /** Remove members from a Learning Community */
    learningCommunityRemoveMembers?: Maybe<Scalars['Boolean']['output']>;
    /** Create a learning reminder */
    learningReminderCreate: LearningReminder;
    /** Delete the learning reminder */
    learningReminderDelete: Scalars['Boolean']['output'];
    /** Update the learning reminder */
    learningReminderUpdate: LearningReminder;
    /** Assign existing occupation to the user */
    occupationAssign: UserOccupationInfo;
    /** Assign existing occupation group to the user */
    occupationGroupAssign: UserOccupationInfo;
    /** Assign management status to the user. */
    occupationManagerAssign: UserOccupationInfo;
    /** Assign new occupation string to the user */
    occupationRawAssign: UserOccupationInfo;
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
    /** Assign a user's topic interest */
    topicInterestAssign: Array<Topic>;
    /** Unassign a user's topic interest */
    topicInterestUnassign: Array<Topic>;
};

/** Root mutation from which every mutation schema extends */
export type MutationApiClientCreateArgs = {
    apiClient: CreateApiClientRequestInput;
};

/** Root mutation from which every mutation schema extends */
export type MutationApiClientDeleteArgs = {
    clientId: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationBadgeAssertionDeleteArgs = {
    id: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationBadgeAssertionStoreByUrlArgs = {
    externalUrl: Scalars['URL']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityAddMembersArgs = {
    id: Scalars['UUID']['input'];
    input: LearningCommunityAddMembersInput;
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityCreateArgs = {
    learningCommunity: LearningCommunityInput;
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityDeleteArgs = {
    id: Scalars['UUID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityRemoveMembersArgs = {
    id: Scalars['UUID']['input'];
    input: LearningCommunityRemoveMembersInput;
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderCreateArgs = {
    learningReminder: LearningReminderInput;
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderDeleteArgs = {
    learningReminderId: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderUpdateArgs = {
    learningReminder: LearningReminderInput;
    learningReminderId: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationOccupationAssignArgs = {
    requestOccupationAssignment?: InputMaybe<OccupationAssignmentInput>;
};

/** Root mutation from which every mutation schema extends */
export type MutationOccupationGroupAssignArgs = {
    requestGroupOccupationAssignment?: InputMaybe<OccupationGroupAssignmentInput>;
};

/** Root mutation from which every mutation schema extends */
export type MutationOccupationManagerAssignArgs = {
    isManager: Scalars['Boolean']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationOccupationRawAssignArgs = {
    requestOccupationAssignment?: InputMaybe<OccupationRawAssignmentInput>;
};

/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentCancelArgs = {
    id: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentReactivateArgs = {
    id: Scalars['ID']['input'];
};

/** Root mutation from which every mutation schema extends */
export type MutationTopicInterestAssignArgs = {
    topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Root mutation from which every mutation schema extends */
export type MutationTopicInterestUnassignArgs = {
    topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Details of Occupation */
export type Occupation = {
    __typename?: 'Occupation';
    /** ID of the occupation instance */
    id: Scalars['ID']['output'];
    /** Name of the occupation */
    name: Scalars['String']['output'];
    /** Representative Topic */
    representativeTopic?: Maybe<Topic>;
    /** URL of the landing page, can be null if no landing page such as OLP exists */
    urlLandingPage?: Maybe<Scalars['URL']['output']>;
};

/** User is assigning occupation to themself */
export type OccupationAssignmentInput = {
    /** ID of the occupation */
    occupationId: Scalars['ID']['input'];
};

/** Occupation group type */
export type OccupationGroup = {
    __typename?: 'OccupationGroup';
    /** ID of the occupation group */
    id: Scalars['ID']['output'];
    /** Name of the occupation group */
    name: Scalars['String']['output'];
};

/** Current user assigning existing occupation group. */
export type OccupationGroupAssignmentInput = {
    /** ID of the occupation group */
    occupationGroupId: Scalars['ID']['input'];
};

/** Shows page search results of occupation */
export type OccupationPaged = Paginated & {
    __typename?: 'OccupationPaged';
    /** Occupation groups. Items may be less than requested size if objects become unavailable */
    items: Array<Occupation>;
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** Current user assigning user provided occupation. */
export type OccupationRawAssignmentInput = {
    /** Raw user provided string to represent the current user's occupation. */
    userProvidedOccupation: Scalars['String']['input'];
};

/** A UB organization */
export type Organization = {
    __typename?: 'Organization';
    /** The UB organization's unique identifier */
    id: Scalars['ID']['output'];
};

/** Object that describes the type and status of license assigned to a user in an organization */
export type OrganizationUserLicense = {
    __typename?: 'OrganizationUserLicense';
    /** The organization this license is assigned to */
    organization: Organization;
    /** The status of license assigned to the user */
    status: OrganizationUserLicenseStatus;
    /** The type of license assigned to the user */
    type: OrganizationUserLicenseType;
    /** The User this license is assigned to */
    user: User;
};

/** Object that describes the status of license assigned to a user in an organization */
export enum OrganizationUserLicenseStatus {
    /** license is usable and assigned to the specified user */
    Active = 'ACTIVE',
    /** license is not usable */
    Inactive = 'INACTIVE',
}

/** Object that describes the type of license assigned to a user in an organization */
export enum OrganizationUserLicenseType {
    /** Default Enterprise and Team Plan license Type */
    Basic = 'BASIC',
    /** UB Pro license Type */
    Pro = 'PRO',
}

/** Interface for implementing paginated results */
export type Paginated = {
    /** The current page number, 0 based */
    page: Scalars['Int']['output'];
    /** The total amount of pages. Calculated as (total result count / page size) */
    pageCount: Scalars['Int']['output'];
};

/** A Partner */
export type Partner = {
    __typename?: 'Partner';
    /** The partner's unique identifier */
    id: Scalars['ID']['output'];
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
    id: Scalars['ID']['output'];
    /** Name of the subcategory */
    name: Scalars['String']['output'];
};

/** Assigment test with multiple-choice and free-from questions reviewed by instructors */
export type PracticeAssignment = {
    __typename?: 'PracticeAssignment';
    /** Description of the assignment */
    description: Scalars['String']['output'];
    /** The Id of the assignment */
    id: Scalars['ID']['output'];
    /** Landing page to view this PracticeAssignment */
    urlLanding: Scalars['URL']['output'];
};

/** Practice test that is more detailed than a Quiz */
export type PracticeTest = {
    __typename?: 'PracticeTest';
    /** The Id of the practice test */
    id: Scalars['ID']['output'];
    /** Percentage required to pass (0 - 100) */
    minimumPassingScore: Scalars['Int']['output'];
    /** Whether the question and answer order is randomized */
    randomized: Scalars['Boolean']['output'];
    /** The title of the practice test */
    title: Scalars['String']['output'];
    /** Landing page to view this PracticeTest */
    urlLanding: Scalars['URL']['output'];
};

/** The Pro learning path object. */
export type ProLearningPath = LearningPath &
    LearningProduct & {
        __typename?: 'ProLearningPath';
        /** Description of the learning path. */
        description?: Maybe<Scalars['String']['output']>;
        /** ID of the learning path. */
        id: Scalars['ID']['output'];
        /** Number of items in the learning path. */
        itemCount: Scalars['Int']['output'];
        /** Total No of enrollments for the learning path. */
        numberOfEnrollments: Scalars['Int']['output'];
        /** Title of the learning path. */
        title: Scalars['String']['output'];
    };

/** Root query from which every query schema extends */
export type Query = {
    __typename?: 'Query';
    /** Get user's active certification preparation */
    activeBadgeClasses: Array<BadgeClass>;
    /** Get API client by ID */
    apiClient: ApiClient;
    /** Get all API clients the requesting organization user or partner has access to */
    apiClients: Array<ApiClient>;
    /** Get an Open Badge Assertion by id */
    badgeAssertion?: Maybe<BadgeAssertion>;
    /** Get list of Open Badge Assertions by their ids */
    badgeAssertions: Array<Maybe<BadgeAssertion>>;
    /** Get list of Open Badge Assertions of given user. Must be a UB admin for the given User */
    badgeAssertionsByUser?: Maybe<BadgeAssertionPaged>;
    /** Get user's issued badges that are uploaded by the user */
    badgeAssertionsImported?: Maybe<BadgeAssertionPaged>;
    /** Get certification subject areas for badges */
    badgeCertificationSubjectAreas: Array<BadgeCertificationSubjectArea>;
    /** Get BadgeClass by id */
    badgeClass?: Maybe<BadgeClass>;
    /** Get user's enrollments for a badge class */
    badgeClassEnrollmentsByBadgeClassId: Array<BadgeClassEnrollment>;
    /** Issuer list of all BadgeClasses */
    badgeClassIssuers: Array<BadgeClassIssuer>;
    /** Get mapped badge classes for learning products */
    badgeClassesByLearningProducts?: Maybe<Array<BadgeClass>>;
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
    /** Get a paginated list of supply gap opportunities by filters */
    deprecatedSupplyGapOpportunities?: Maybe<DeprecatedSupplyGapOpportunitiesResponse>;
    /** Get a supply gap opportunity by id */
    deprecatedSupplyGapOpportunity?: Maybe<DeprecatedSupplyGapOpportunity>;
    /** Returns assigned feature variants */
    featureVariantAssignmentsByCodeAndAttributes: Array<FeatureVariantAssignment>;
    /** Return featured reviews for a given set of topics */
    featuredReviewsByTopic: Array<Review>;
    /** Retrieve a Lab by its ID */
    lab?: Maybe<Lab>;
    /** Retrieve a set of Labs by their IDs */
    labs: Array<Maybe<Lab>>;
    /**
     * List Learning Communities by IDs.
     * If no `ids` are provided then all the learning communities which the user is part of will be returned.
     */
    learningCommunities: Array<Maybe<LearningCommunity>>;
    /**
     * Fetch the activities for a learning community with the cursor.
     * The `limit` is used to limit the number of activities returned on the page.
     * The cursor can be used to continue fetching the next pages of activities. the cursor is part of previous results.
     */
    learningCommunityActivities?: Maybe<LearningCommunityActivitiesPaged>;
    /** Returns available learning products for the client */
    learningProductByPage: LearningProductsPaged;
    /** Retrieve a Learning Reminder by its ID */
    learningReminder?: Maybe<LearningReminder>;
    /** List Learning Reminders for a user inferred from an authentication context */
    learningReminders: LearningRemindersPaged;
    /** Get license pools */
    licensePools: Array<LicensePool>;
    /** Fetch occupation groups */
    occupationGroups: Array<Maybe<OccupationGroup>>;
    /** Search occupations */
    occupationSearch: OccupationPaged;
    /** Fetch occupations by ID */
    occupations: Array<Maybe<Occupation>>;
    /** Get the current licenses assigned to the User calling this Query in their org, filtered by type and if it is active or not */
    organizationUserLicensesAssignedByTypeAndStatus?: Maybe<Array<OrganizationUserLicense>>;
    /** Gets a list of all popular topics */
    popularTopics: Array<Maybe<PopularTopic>>;
    /** Get Pro learning paths by topic */
    proLearningPathsByTopic: Array<ProLearningPath>;
    /** Search for autocomplete */
    searchAutocomplete: Array<Maybe<SearchAutocompleteSuggestion>>;
    /** Search for BadgeClasses */
    searchBadgeClasses?: Maybe<BadgeClassSearchResponse>;
    /** Search for courses */
    searchCourses?: Maybe<CourseSearchResponse>;
    /** Search for labs */
    searchLabs?: Maybe<LabSearchResponse>;
    /** Searches lectures */
    searchLectures?: Maybe<LectureSearchResponse>;
    /** Get current lecture consumption streak data for a request's user. */
    streakUserLectureConsumptionWeekly: StreakUserLectureConsumptionWeekly;
    /** Returns available subscription plans for a given user */
    subscriptionPlans: Array<SubscriptionPlan>;
    /** Returns list of available plans based on the subscription plan product type */
    subscriptionPlansByProductType: Array<SubscriptionPlan>;
    /** Returns a topic by ID */
    topic?: Maybe<Topic>;
    /** Returns a list of topic groups by ID */
    topicGroups: Array<TopicGroup>;
    /** Fetch topics user has expressed interest in */
    topicInterests: Array<Topic>;
    /** Search topics */
    topicSearch: Array<Topic>;
    /** Returns the details of current user occupation */
    userOccupationInfo: UserOccupationInfo;
};

/** Root query from which every query schema extends */
export type QueryApiClientArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeAssertionArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeAssertionsArgs = {
    ids: Array<Scalars['ID']['input']>;
};

/** Root query from which every query schema extends */
export type QueryBadgeAssertionsByUserArgs = {
    page?: Scalars['Int']['input'];
    size?: Scalars['Int']['input'];
    userId: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeAssertionsImportedArgs = {
    page?: Scalars['Int']['input'];
    size?: Scalars['Int']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeClassArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeClassEnrollmentsByBadgeClassIdArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryBadgeClassesByLearningProductsArgs = {
    learningProducts: Array<LearningProductInput>;
};

/** Root query from which every query schema extends */
export type QueryBadgeClassesByTopicArgs = {
    topicId: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryCodingExerciseTemplateByLanguageVersionNameArgs = {
    language: CodingExerciseLanguageOption;
    name: Scalars['String']['input'];
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
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryCourseCatalogByPageArgs = {
    cursor?: InputMaybe<Scalars['String']['input']>;
    pageSize?: InputMaybe<Scalars['MaxResultsPerPage']['input']>;
    syncToken?: InputMaybe<Scalars['String']['input']>;
};

/** Root query from which every query schema extends */
export type QueryCourseCategoryArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryCoursesArgs = {
    ids: Array<Scalars['ID']['input']>;
};

/** Root query from which every query schema extends */
export type QueryDeprecatedSupplyGapOpportunitiesArgs = {
    filters?: InputMaybe<DeprecatedSupplyGapOpportunityFilters>;
    page?: Scalars['Int']['input'];
    size?: Scalars['Int']['input'];
};

/** Root query from which every query schema extends */
export type QueryDeprecatedSupplyGapOpportunityArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryFeatureVariantAssignmentsByCodeAndAttributesArgs = {
    featureCodes: Array<Scalars['String']['input']>;
    realtimeAttributes?: InputMaybe<Array<FeatureRequestAttributeInput>>;
};

/** Root query from which every query schema extends */
export type QueryFeaturedReviewsByTopicArgs = {
    topicIds: Array<Scalars['ID']['input']>;
};

/** Root query from which every query schema extends */
export type QueryLabArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryLabsArgs = {
    ids: Array<Scalars['ID']['input']>;
};

/** Root query from which every query schema extends */
export type QueryLearningCommunitiesArgs = {
    ids?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

/** Root query from which every query schema extends */
export type QueryLearningCommunityActivitiesArgs = {
    cursor?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['UUID']['input'];
    limit: Scalars['Int']['input'];
};

/** Root query from which every query schema extends */
export type QueryLearningProductByPageArgs = {
    page?: InputMaybe<Scalars['Int']['input']>;
    size?: InputMaybe<Scalars['MaxResultsPerPage']['input']>;
};

/** Root query from which every query schema extends */
export type QueryLearningReminderArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryLearningRemindersArgs = {
    page?: InputMaybe<Scalars['Int']['input']>;
    size?: InputMaybe<Scalars['MaxResultsPerPage']['input']>;
};

/** Root query from which every query schema extends */
export type QueryOccupationGroupsArgs = {
    ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Root query from which every query schema extends */
export type QueryOccupationSearchArgs = {
    groupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    page: Scalars['Int']['input'];
    pageSize: Scalars['Int']['input'];
    search?: InputMaybe<Scalars['String']['input']>;
};

/** Root query from which every query schema extends */
export type QueryOccupationsArgs = {
    ids: Array<Scalars['ID']['input']>;
};

/** Root query from which every query schema extends */
export type QueryOrganizationUserLicensesAssignedByTypeAndStatusArgs = {
    status?: InputMaybe<OrganizationUserLicenseStatus>;
    type?: InputMaybe<OrganizationUserLicenseType>;
};

/** Root query from which every query schema extends */
export type QueryPopularTopicsArgs = {
    categoryId: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryProLearningPathsByTopicArgs = {
    topicId: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QuerySearchAutocompleteArgs = {
    request: SearchAutocompleteRequestInput;
};

/** Root query from which every query schema extends */
export type QuerySearchBadgeClassesArgs = {
    certificationAreaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    issuerId?: InputMaybe<Array<Scalars['ID']['input']>>;
    page?: Scalars['Int']['input'];
    query?: InputMaybe<Scalars['String']['input']>;
    size?: Scalars['Int']['input'];
};

/** Root query from which every query schema extends */
export type QuerySearchCoursesArgs = {
    filters?: InputMaybe<CourseSearchFilters>;
    page?: InputMaybe<Scalars['NonNegativeInt']['input']>;
    query: Scalars['String']['input'];
    sortOrder?: InputMaybe<CourseSearchSortType>;
};

/** Root query from which every query schema extends */
export type QuerySearchLabsArgs = {
    filters?: InputMaybe<Array<SearchAggregationInputOption>>;
    query: Scalars['String']['input'];
};

/** Root query from which every query schema extends */
export type QuerySearchLecturesArgs = {
    query: Scalars['String']['input'];
};

/** Root query from which every query schema extends */
export type QuerySubscriptionPlansByProductTypeArgs = {
    productType?: InputMaybe<SubscriptionPlanProductType>;
};

/** Root query from which every query schema extends */
export type QueryTopicArgs = {
    id: Scalars['ID']['input'];
};

/** Root query from which every query schema extends */
export type QueryTopicGroupsArgs = {
    ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Root query from which every query schema extends */
export type QueryTopicSearchArgs = {
    filters?: InputMaybe<TopicFilters>;
    limit: Scalars['PositiveInt']['input'];
    query?: InputMaybe<Scalars['String']['input']>;
};

/** Quiz with simple questions and multiple choice answers */
export type Quiz = {
    __typename?: 'Quiz';
    /** An optional description */
    description?: Maybe<Scalars['String']['output']>;
    /** The Id of the quiz */
    id: Scalars['ID']['output'];
    /** The title of the quiz */
    title: Scalars['String']['output'];
    /** Landing page to view this Quiz */
    urlLanding: Scalars['URL']['output'];
};

/** A review of a learning product */
export type Review = {
    __typename?: 'Review';
    /** The type of learning product being reviewed */
    learningProductType: LearningProductType;
    /** The review text */
    text: Scalars['String']['output'];
    /** The URL of the reviewed learning product */
    urlLearningProduct: Scalars['URL']['output'];
};

/** Identifies available search filter facets. */
export type SearchAggregation = {
    __typename?: 'SearchAggregation';
    /** Available values for this aggregation. */
    buckets: Array<SearchAggregationOption>;
    /** Key argument that can be passed to query to filter by this option. */
    key: Scalars['String']['output'];
    /** Label for this type/group of aggregation; e.g. 'Topic'. */
    label: Scalars['String']['output'];
};

/** Options for search aggregates */
export type SearchAggregationInputOption = {
    /** Key of search aggregation to apply */
    key: Scalars['String']['input'];
    /** Value of search aggregation to apply */
    value: Scalars['String']['input'];
};

/** One of the available options within a search facet type */
export type SearchAggregationOption = {
    __typename?: 'SearchAggregationOption';
    /** Number of results if this filter option were to be applied. */
    countWithFilterApplied: Scalars['Int']['output'];
    /** Human-readable label for this filter option. */
    label: Scalars['String']['output'];
    /** Value argument that can be passed to query to filter by this option. */
    value: Scalars['String']['output'];
};

/** A simple auto-complete item can be search log, course or instructor */
export type SearchAutocompleteItem = Course | CourseInstructor | SearchAutocompleteLogItem;

/** Search Log suggestion for autocomplete */
export type SearchAutocompleteLogItem = {
    __typename?: 'SearchAutocompleteLogItem';
    /** Phrase that will be shows as a suggestion */
    title: Scalars['String']['output'];
};

/** Search param for autocomplete */
export type SearchAutocompleteRequestInput = {
    /** Indicates either free courses will be shown or not */
    freeCourseSuppression?: InputMaybe<Scalars['Boolean']['input']>;
    /** Size of the response */
    responseSize?: Scalars['Int']['input'];
    /** Searched Phrase for the requests */
    searchedPhrase: Scalars['String']['input'];
};

/** A simple autocomplete item with the tracking metadata */
export type SearchAutocompleteSuggestion = {
    __typename?: 'SearchAutocompleteSuggestion';
    /** Search Autocomplete suggestion for autocomplete */
    item?: Maybe<SearchAutocompleteItem>;
    /** Search analytics tracking id; for uniquely identifying whole result set; for this request */
    resultTrackingId: Scalars['String']['output'];
    /** Search analytics tracking id; for uniquely identifying this item */
    trackingId: Scalars['String']['output'];
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
    goalMinutesThisWeek?: Maybe<Scalars['Int']['output']>;
    /** Lecture consumption so far this week, in minutes. */
    minutesThisWeek?: Maybe<Scalars['Int']['output']>;
    /** Current status of the streak. */
    streakStatus: StreakStatus;
    /** Date to display to user for when the week ended. */
    weekEndTime: Scalars['DateTime']['output'];
    /** Date to display to user for when the week started. */
    weekStartTime: Scalars['DateTime']['output'];
    /** Serialized WeeklyStreak object. */
    weeklyStreak: WeeklyStreak;
};

/** SubCategory that is part of CourseCategory */
export type SubCategory = {
    /** ID of the subcategory */
    id: Scalars['ID']['output'];
    /** Name of the subcategory */
    name: Scalars['String']['output'];
};

/** Subscription plan that the subscriber is subscribed to */
export type SubscribedPlan = {
    __typename?: 'SubscribedPlan';
    /** Content collections that are included in the subscription plan */
    contentCollections: Array<ContentCollection>;
    /** Description of the subscription plan */
    description?: Maybe<Scalars['String']['output']>;
    /** Id of the subscription plan */
    id: Scalars['ID']['output'];
    /** The types of learning products included in the subscription plan */
    learningProductTypes: Array<LearningProductType>;
    /** Type of the subscription product in the plan */
    productType: SubscriptionPlanProductType;
    /** Title of the subscription plan */
    title: Scalars['String']['output'];
    /** URL for the learn more page of the subscription plan */
    urlLearnMore: Scalars['URL']['output'];
};

/** Subscriber of the subscription */
export type Subscriber = Organization | User;

/** Billing details of a subscription */
export type SubscriptionBilling = {
    __typename?: 'SubscriptionBilling';
    /** Total recurring amount for the subscription including tax */
    chargePrice: Money;
    /** End date of the current billing period */
    currentPeriodEndDate: Scalars['DateTime']['output'];
    /** Start date of the current billing period */
    currentPeriodStartDate: Scalars['DateTime']['output'];
    /** Payment method used for the subscription */
    paymentMethod: SubscriptionPaymentMethod;
    /** Tax amount for the subscription */
    taxPrice: Money;
};

/** Credit card used for the subscription */
export type SubscriptionCreditCard = {
    __typename?: 'SubscriptionCreditCard';
    /** Last 4 digits of the card number */
    last4Digits: Scalars['String']['output'];
    /** Card provider (visa, mc, amex, etc.) */
    provider: Scalars['String']['output'];
};

/** Subscription object that represents consumer and UB subscriptions */
export type SubscriptionEnrollment = {
    __typename?: 'SubscriptionEnrollment';
    /** Billing information for the subscription with recurring payment support */
    billing?: Maybe<SubscriptionBilling>;
    /** Date when the subscription was canceled */
    cancelDate?: Maybe<Scalars['DateTime']['output']>;
    /** Reference key to Recurring Billing System */
    checkoutReference?: Maybe<Scalars['String']['output']>;
    /** End date of the subscription */
    endDate?: Maybe<Scalars['DateTime']['output']>;
    /** Id of the subscription */
    id: Scalars['ID']['output'];
    /** Max number of licenses (seats) for the subscription */
    licenseCount: Scalars['Int']['output'];
    /** Renewal period of the subscription */
    renewalInterval: DateInterval;
    /** Start date of the subscription */
    startDate: Scalars['DateTime']['output'];
    /** Status of the subscription */
    status: SubscriptionStatus;
    /** Subscription plan that the subscriber is subscribed to */
    subscribedPlan: SubscribedPlan;
    /** User or Organization that has the subscription */
    subscriber: Subscriber;
    /** Trial period of the subscription */
    trialInterval?: Maybe<DateInterval>;
    /** Number of licenses (seats) in use */
    usedLicenseCount: Scalars['Int']['output'];
};

/** Payment method of the subscription */
export type SubscriptionPaymentMethod = SubscriptionCreditCard;

/** An offer for a consumer subscription plan to access a catalog of Udemy content */
export type SubscriptionPlan = {
    __typename?: 'SubscriptionPlan';
    /** List of content groups included in a given plan */
    contentCollections: Array<ContentCollection>;
    /** ID of the subscription plan: */
    id: Scalars['ID']['output'];
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
    urlExpressCheckout: Scalars['URL']['output'];
    /** Learn more url for a given plan */
    urlLearnMore: Scalars['URL']['output'];
    /** Terms and Conditions url for a given plan */
    urlTermsOfUse: Scalars['URL']['output'];
};

/** An offer for a consumer subscription plan to access a catalog of Udemy content */
export type SubscriptionPlanPriceOptionsArgs = {
    licenseCount?: InputMaybe<Scalars['Int']['input']>;
};

/** Contains information about the license context for a given subscription plan price option */
export type SubscriptionPlanLicenseContext = {
    __typename?: 'SubscriptionPlanLicenseContext';
    /** Default license count to be offered for purchase for given subscription plan option */
    defaultLicenseCount: Scalars['Int']['output'];
    /** License count for the subscription plan option */
    licenseCount: Scalars['Int']['output'];
    /** Maximum license count for purchase for given subscription plan option */
    maximumLicenseCount: Scalars['Int']['output'];
    /** Minimum license count for purchase for given subscription plan option */
    minimumLicenseCount: Scalars['Int']['output'];
    /** The unit price of the subscription price plan option based on provided requested count from request */
    unitPrice: Money;
};

/** Union of possible plan pricing options */
export type SubscriptionPlanPricingOptionItem =
    | AnnualSubscriptionPlanPricingOption
    | DailySubscriptionPlanPricingOption
    | MonthlySubscriptionPlanPricingOption
    | WeeklySubscriptionPlanPricingOption;

/** The type of subscription plan being offered */
export enum SubscriptionPlanProductType {
    /** Consumer subscription (previously Spadefish) */
    Consumersubscription = 'CONSUMERSUBSCRIPTION',
    /** Enterprise Plan */
    Enterprise = 'ENTERPRISE',
    /** Enterprise PRO Plan */
    Enterprisepro = 'ENTERPRISEPRO',
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
    /** Topic groups this topic belongs to */
    groups: Array<TopicGroup>;
    /** ID of topic */
    id: Scalars['ID']['output'];
    /** Title of topic (Python, Programming Languages) */
    name: Scalars['String']['output'];
    /** A collection of question and answer pairs with optional link for additional context */
    questionsAndAnswers: Array<TopicQuestionAndAnswer>;
    /** Web url of the topic page */
    url: Scalars['URL']['output'];
};

/** Topic Filters for searching topics. All filters are ANDed together. */
export type TopicFilters = {
    /** Include topics associated with these topic ids */
    associatedWithTopicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    /** Exclude topic group IDs */
    excludeTopicGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    /** Include topic group IDs */
    includeTopicGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    /** Include topics related to occupation group IDs */
    occupationGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
    /** Include topics related to occupation IDs */
    occupationIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Topic Group */
export type TopicGroup = {
    __typename?: 'TopicGroup';
    /** ID of topic group */
    id: Scalars['ID']['output'];
    /** Name of topic group */
    name: Scalars['String']['output'];
};

/** Types of popularity for Topics */
export enum TopicPopularityTypes {
    /** Popular popularity type */
    Popular = 'POPULAR',
    /** Trending popularity type */
    Trending = 'TRENDING',
}

/** A question and answer pair with optional link for additional context */
export type TopicQuestionAndAnswer = {
    __typename?: 'TopicQuestionAndAnswer';
    /** The answer text */
    answer: Scalars['String']['output'];
    /** ID of the question and answer */
    id: Scalars['ID']['output'];
    /** Text to display for the link to additional information about the question and answer */
    linkText?: Maybe<Scalars['String']['output']>;
    /** The question text */
    question: Scalars['String']['output'];
    /** The URL for additional information about the question and answer */
    urlReadMore?: Maybe<Scalars['URL']['output']>;
};

/** A Udemy user */
export type User = {
    __typename?: 'User';
    /** Id of the user */
    id: Scalars['ID']['output'];
    /**
     * Personally identifiable information of the User
     * scopes required: udemy:application
     */
    profile: UserProfile;
};

/** Shows details of the user's occupation */
export type UserOccupationInfo = {
    __typename?: 'UserOccupationInfo';
    /** User's canonical occupation, may be null if user provided raw occupation. */
    canonical?: Maybe<Occupation>;
    /** Occupation group of the occupation */
    group?: Maybe<OccupationGroup>;
    /** Shows if the user is manager */
    isManager?: Maybe<Scalars['Boolean']['output']>;
    /** User's raw input occupation */
    raw?: Maybe<Occupation>;
};

/** Represents the basic information of a user */
export type UserProfile = {
    __typename?: 'UserProfile';
    /** Email of the user */
    email: Scalars['EmailAddress']['output'];
    /** User avatar in different sizes */
    images: UserProfileImages;
    /** Name of the user */
    name: Scalars['String']['output'];
    /** Surname of the user */
    surname: Scalars['String']['output'];
};

/** Represents different sizes of the same image */
export type UserProfileImages = {
    __typename?: 'UserProfileImages';
    /** User profile image size 125h */
    height125: Scalars['URL']['output'];
    /** User profile image size 200h */
    height200: Scalars['URL']['output'];
    /** User profile image size 50x50 */
    px50x50: Scalars['URL']['output'];
    /** User profile image size 75x75 */
    px75x75: Scalars['URL']['output'];
    /** User profile image size 100x100 */
    px100x100: Scalars['URL']['output'];
};

/** Video lecture */
export type VideoLecture = Lecture & {
    __typename?: 'VideoLecture';
    /** Total duration of the lecture's content in seconds */
    durationInSeconds: Scalars['DurationInSeconds']['output'];
    /** Id of the video lecture */
    id: Scalars['ID']['output'];
    /** Images by their dimensions */
    images: LectureImages;
    /** The URL of the lecture thumbnail */
    thumbnail?: Maybe<Scalars['URL']['output']>;
    /** Lecture title */
    title: Scalars['String']['output'];
    /** The URL to access the lecture on the auto-enroll page */
    urlAutoEnroll: Scalars['URL']['output'];
    /** Landing page to view this Lecture */
    urlLanding: Scalars['URL']['output'];
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
    /** Total duration of the lecture's content in seconds */
    durationInSeconds: Scalars['DurationInSeconds']['output'];
    /** Id of the lecture */
    id: Scalars['ID']['output'];
    /** Images by their dimensions */
    images: LectureImages;
    /** The URL of the lecture thumbnail */
    thumbnail?: Maybe<Scalars['URL']['output']>;
    /** Lecture title */
    title: Scalars['String']['output'];
    /** The URL to access the lecture on the auto-enroll page */
    urlAutoEnroll: Scalars['URL']['output'];
    /** Landing page to view this Lecture */
    urlLanding: Scalars['URL']['output'];
};

/** Contains metadata about any retention streak */
export type WeeklyStreak = {
    __typename?: 'WeeklyStreak';
    /** Have they achieved their goal this week? */
    achievedThisWeek: Scalars['Boolean']['output'];
    /** ID of the streak. */
    id: Scalars['ID']['output'];
    /** Start date of the first week of this streak chain. */
    startDate?: Maybe<Scalars['DateTime']['output']>;
    /** Current number of weeks achieved. */
    streakLength: Scalars['Int']['output'];
    /** User who this streak belongs to. */
    userId: Scalars['ID']['output'];
};

/** Price option for computed price plan. Will be returned for weekly plans */
export type WeeklySubscriptionPlanPricingOption = {
    __typename?: 'WeeklySubscriptionPlanPricingOption';
    /** ID of the price option: */
    id: Scalars['ID']['output'];
    /** Contains information about the license context for a given subscription plan price option */
    licenseContext?: Maybe<SubscriptionPlanLicenseContext>;
    /** The list price of the subscription price plan based on provided requested count from request */
    listPrice: Money;
    /** Interval for renewing the subscription plan ie the length of the subscription plan */
    renewalInterval: DateInterval;
    /** Field containing details about the trial subscription offer for a given user. Null indicates no trial is available */
    trial?: Maybe<SubscriptionTrial>;
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
    nameInput: Scalars['String']['input'];
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
    id: Scalars['ID']['input'];
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

export type LearningCommunitiesQueryVariables = Exact<{
    ids: Array<Scalars['UUID']['input']> | Scalars['UUID']['input'];
}>;

export type LearningCommunitiesQuery = {
    __typename?: 'Query';
    learningCommunities: Array<{
        __typename?: 'LearningCommunity';
        id: any;
        title: string;
        description?: string | null;
        numberOfMembers: number;
        reason: {
            __typename?: 'LearningCommunityCreateReason';
            type: LearningCommunityCreateReasonType;
            text?: string | null;
        };
        owner: {
            __typename?: 'User';
            id: string;
            profile: {__typename?: 'UserProfile'; name: string; surname: string};
        };
        members: Array<{
            __typename?: 'User';
            id: string;
            profile: {
                __typename?: 'UserProfile';
                name: string;
                surname: string;
                email: any;
                images: {__typename?: 'UserProfileImages'; px50x50: any};
            };
        }>;
        topics: Array<{__typename?: 'Topic'; id: string; url: any; title: string}>;
    } | null>;
};

export type GetLearningCommunityActivitiesQueryVariables = Exact<{
    id: Scalars['UUID']['input'];
    limit: Scalars['Int']['input'];
    cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetLearningCommunityActivitiesQuery = {
    __typename?: 'Query';
    learningCommunityActivities?: {
        __typename?: 'LearningCommunityActivitiesPaged';
        cursor?: string | null;
        items: Array<{
            __typename?: 'LearningCommunityActivity';
            by: {
                __typename?: 'User';
                id: string;
                profile: {
                    __typename?: 'UserProfile';
                    name: string;
                    surname: string;
                    images: {__typename?: 'UserProfileImages'; px75x75: any};
                };
            };
            event:
                | {
                      __typename: 'LearningCommunityCurriculumItemEvent';
                      dateTime: any;
                      curriculumItemEventType: LearningCommunityCurriculumItemEventType;
                      course: {
                          __typename?: 'Course';
                          id: string;
                          title?: string | null;
                          urlCourseLanding?: any | null;
                          topics?: Array<{__typename?: 'Topic'; id: string; title: string}> | null;
                          categories: Array<{
                              __typename?: 'CourseCategory';
                              id: string;
                              title: string;
                          }>;
                      };
                      item:
                          | {
                                __typename: 'ArticleLecture';
                                id: string;
                                title: string;
                                urlLanding: any;
                                durationInSeconds: any;
                                urlAutoEnroll: any;
                                images: {
                                    __typename?: 'LectureImages';
                                    height50?: string | null;
                                    height100?: string | null;
                                    height480?: string | null;
                                };
                            }
                          | {__typename: 'CodingExercise'}
                          | {__typename: 'PracticeAssignment'}
                          | {__typename: 'PracticeTest'}
                          | {__typename: 'Quiz'}
                          | {
                                __typename: 'VideoLecture';
                                id: string;
                                title: string;
                                urlLanding: any;
                                durationInSeconds: any;
                                urlAutoEnroll: any;
                                images: {
                                    __typename?: 'LectureImages';
                                    height50?: string | null;
                                    height100?: string | null;
                                    height480?: string | null;
                                };
                            }
                          | {
                                __typename: 'VideoMashupLecture';
                                id: string;
                                title: string;
                                urlLanding: any;
                                durationInSeconds: any;
                                urlAutoEnroll: any;
                                images: {
                                    __typename?: 'LectureImages';
                                    height50?: string | null;
                                    height100?: string | null;
                                    height480?: string | null;
                                };
                            };
                  }
                | {
                      __typename: 'LearningProductEvent';
                      dateTime: any;
                      productEventType: LearningProductEventType;
                      product:
                          | {__typename: 'Assessment'; id: string}
                          | {
                                __typename: 'Course';
                                title?: string | null;
                                headline?: string | null;
                                duration?: any | null;
                                durationInSeconds?: any | null;
                                locale: any;
                                level?: DifficultyLevel | null;
                                urlCourseLanding?: any | null;
                                id: string;
                                rating: {
                                    __typename?: 'CourseRating';
                                    count: number;
                                    average?: any | null;
                                };
                                topics?: Array<{
                                    __typename?: 'Topic';
                                    id: string;
                                    title: string;
                                }> | null;
                                categories: Array<{
                                    __typename?: 'CourseCategory';
                                    id: string;
                                    title: string;
                                }>;
                                instructors: Array<{
                                    __typename?: 'CourseInstructor';
                                    id: string;
                                    name: string;
                                }>;
                                images: {
                                    __typename?: 'CourseImages';
                                    px50x50?: string | null;
                                    px100x100?: string | null;
                                    px240x135?: string | null;
                                    px480x270?: string | null;
                                };
                            }
                          | {__typename: 'Lab'; id: string}
                          | {__typename: 'ProLearningPath'; id: string};
                  };
        }>;
    } | null;
};

export type LearningCommunityAddMembersMutationVariables = Exact<{
    id: Scalars['UUID']['input'];
    userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
    invitation: LearningCommunityInviteInput;
}>;

export type LearningCommunityAddMembersMutation = {
    __typename?: 'Mutation';
    learningCommunityAddMembers?: boolean | null;
};

export type LearningCommunityCreateMutationVariables = Exact<{
    learningCommunity: LearningCommunityInput;
}>;

export type LearningCommunityCreateMutation = {
    __typename?: 'Mutation';
    learningCommunityCreate?: {
        __typename?: 'LearningCommunity';
        id: any;
        organizationId: string;
        title: string;
        description?: string | null;
        numberOfMembers: number;
        reason: {
            __typename?: 'LearningCommunityCreateReason';
            type: LearningCommunityCreateReasonType;
            text?: string | null;
        };
        owner: {__typename?: 'User'; id: string};
        members: Array<{__typename?: 'User'; id: string}>;
        topics: Array<{__typename?: 'Topic'; id: string; url: any; title: string}>;
    } | null;
};

export type LearningCommunityDeleteMutationVariables = Exact<{
    id: Scalars['UUID']['input'];
}>;

export type LearningCommunityDeleteMutation = {
    __typename?: 'Mutation';
    learningCommunityDelete?: boolean | null;
};

export type LearningCommunityRemoveMembersMutationVariables = Exact<{
    id: Scalars['UUID']['input'];
    userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;

export type LearningCommunityRemoveMembersMutation = {
    __typename?: 'Mutation';
    learningCommunityRemoveMembers?: boolean | null;
};

export type MyLearningCommunitiesQueryVariables = Exact<{[key: string]: never}>;

export type MyLearningCommunitiesQuery = {
    __typename?: 'Query';
    learningCommunities: Array<{
        __typename?: 'LearningCommunity';
        id: any;
        title: string;
        description?: string | null;
        numberOfMembers: number;
        reason: {
            __typename?: 'LearningCommunityCreateReason';
            type: LearningCommunityCreateReasonType;
        };
        owner: {
            __typename?: 'User';
            id: string;
            profile: {__typename?: 'UserProfile'; name: string; surname: string};
        };
        topics: Array<{__typename?: 'Topic'; id: string; title: string}>;
    } | null>;
};

export type ProLearningPathsByTopicQueryVariables = Exact<{
    topicId: Scalars['ID']['input'];
}>;

export type ProLearningPathsByTopicQuery = {
    __typename?: 'Query';
    proLearningPathsByTopic: Array<{
        __typename?: 'ProLearningPath';
        id: string;
        title: string;
        description?: string | null;
        itemCount: number;
        numberOfEnrollments: number;
    }>;
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

export type BadgeClassQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type BadgeClassQuery = {
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
        topic?: {__typename?: 'Topic'; id: string} | null;
        assertions: Array<{
            __typename?: 'BadgeAssertion';
            id: string;
            issuedOn: any;
            expires?: any | null;
            externalUrl: any;
        }>;
    } | null;
};

export type SearchBadgeClassesQueryVariables = Exact<{
    query: Scalars['String']['input'];
    issuerIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
    certificationAreaIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
    page?: Scalars['Int']['input'];
    size: Scalars['Int']['input'];
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
    topicId: Scalars['ID']['input'];
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

export type ActiveBadgeClassesQueryVariables = Exact<{[key: string]: never}>;

export type ActiveBadgeClassesQuery = {
    __typename?: 'Query';
    activeBadgeClasses: Array<{
        __typename?: 'BadgeClass';
        id: string;
        name: string;
        image: {__typename?: 'BadgeClassImage'; id: string};
        issuer: {__typename?: 'BadgeClassIssuer'; name: string};
    }>;
};

export type BadgeClassEnrollmentsByBadgeClassIdQueryVariables = Exact<{
    badgeClassId: Scalars['ID']['input'];
}>;

export type BadgeClassEnrollmentsByBadgeClassIdQuery = {
    __typename?: 'Query';
    badgeClassEnrollmentsByBadgeClassId: Array<{
        __typename?: 'BadgeClassEnrollment';
        completionPercentage: any;
        learningProduct:
            | {__typename: 'Assessment'}
            | {
                  __typename: 'Course';
                  id: string;
                  title?: string | null;
                  urlCourseLanding?: any | null;
                  enrollable: boolean;
                  images: {
                      __typename?: 'CourseImages';
                      px480x270?: string | null;
                      px240x135?: string | null;
                      px100x100?: string | null;
                      px75x75?: string | null;
                      px50x50?: string | null;
                  };
                  instructors: Array<{__typename?: 'CourseInstructor'; name: string}>;
              }
            | {__typename: 'Lab'}
            | {
                  __typename: 'ProLearningPath';
                  id: string;
                  description?: string | null;
                  itemCount: number;
                  learningPathTitle: string;
              };
    }>;
};

export type BadgeClassesByLearningProductsQueryVariables = Exact<{
    learningProducts: Array<LearningProductInput> | LearningProductInput;
}>;

export type BadgeClassesByLearningProductsQuery = {
    __typename?: 'Query';
    badgeClassesByLearningProducts?: Array<{
        __typename?: 'BadgeClass';
        id: string;
        name: string;
        image: {__typename?: 'BadgeClassImage'; id: string};
        issuer: {__typename?: 'BadgeClassIssuer'; name: string};
    }> | null;
};

export type StoreAssertionByUrlMutationVariables = Exact<{
    externalUrl: Scalars['URL']['input'];
}>;

export type StoreAssertionByUrlMutation = {
    __typename?: 'Mutation';
    badgeAssertionStoreByUrl?: {
        __typename?: 'BadgeAssertion';
        id: string;
        issuedOn: any;
        expires?: any | null;
        externalUrl: any;
        badgeClass: {
            __typename?: 'BadgeClass';
            id: string;
            name: string;
            image: {__typename?: 'BadgeClassImage'; id: string};
            issuer: {__typename?: 'BadgeClassIssuer'; name: string};
        };
    } | null;
};

export type BadgeAssertionsImportedQueryVariables = Exact<{
    page?: Scalars['Int']['input'];
    size?: Scalars['Int']['input'];
}>;

export type BadgeAssertionsImportedQuery = {
    __typename?: 'Query';
    badgeAssertionsImported?: {
        __typename?: 'BadgeAssertionPaged';
        page: number;
        pageCount: number;
        items: Array<{
            __typename?: 'BadgeAssertion';
            id: string;
            issuedOn: any;
            expires?: any | null;
            badgeClass: {
                __typename?: 'BadgeClass';
                id: string;
                name: string;
                image: {__typename?: 'BadgeClassImage'; id: string};
                issuer: {__typename?: 'BadgeClassIssuer'; name: string};
            };
            user: {__typename?: 'User'; id: string};
        }>;
    } | null;
};

export type BadgeAssertionsByUserQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
    page?: Scalars['Int']['input'];
    size?: Scalars['Int']['input'];
}>;

export type BadgeAssertionsByUserQuery = {
    __typename?: 'Query';
    badgeAssertionsByUser?: {
        __typename?: 'BadgeAssertionPaged';
        page: number;
        pageCount: number;
        items: Array<{
            __typename?: 'BadgeAssertion';
            id: string;
            issuedOn: any;
            expires?: any | null;
            badgeClass: {
                __typename?: 'BadgeClass';
                id: string;
                name: string;
                image: {__typename?: 'BadgeClassImage'; id: string};
                issuer: {__typename?: 'BadgeClassIssuer'; name: string};
            };
            user: {__typename?: 'User'; id: string};
        }>;
    } | null;
};

export type FetchLicensePoolsQueryVariables = Exact<{[key: string]: never}>;

export type FetchLicensePoolsQuery = {
    __typename?: 'Query';
    licensePools: Array<{
        __typename?: 'LicensePool';
        id: string;
        name: string;
        isDefault: boolean;
        organization: {__typename?: 'Organization'; id: string};
        licenseCounts: Array<{
            __typename?: 'LicensePoolProductTypeCount';
            productType: SubscriptionPlanProductType;
            maxLicenseCount: number;
            usedLicenseCount: number;
        }>;
    }>;
};

export type UserOccupationInfoQueryVariables = Exact<{[key: string]: never}>;

export type UserOccupationInfoQuery = {
    __typename?: 'Query';
    userOccupationInfo: {
        __typename?: 'UserOccupationInfo';
        isManager?: boolean | null;
        group?: {__typename?: 'OccupationGroup'; id: string; name: string} | null;
        canonical?: {__typename?: 'Occupation'; id: string; name: string} | null;
        raw?: {__typename?: 'Occupation'; id: string; name: string} | null;
    };
};

export type OccupationGroupsQueryVariables = Exact<{
    ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;

export type OccupationGroupsQuery = {
    __typename?: 'Query';
    occupationGroups: Array<{__typename?: 'OccupationGroup'; id: string; name: string} | null>;
};

export type OccupationSearchQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']['input']>;
    groupIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
    page: Scalars['Int']['input'];
    pageSize: Scalars['Int']['input'];
}>;

export type OccupationSearchQuery = {
    __typename?: 'Query';
    occupationSearch: {
        __typename?: 'OccupationPaged';
        page: number;
        pageCount: number;
        items: Array<{
            __typename?: 'Occupation';
            id: string;
            name: string;
            representativeTopic?: {
                __typename?: 'Topic';
                id: string;
                name: string;
                url: any;
                groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
            } | null;
        }>;
    };
};

export type OccupationsQueryVariables = Exact<{
    ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;

export type OccupationsQuery = {
    __typename?: 'Query';
    occupations: Array<{
        __typename?: 'Occupation';
        id: string;
        name: string;
        urlLandingPage?: any | null;
        representativeTopic?: {
            __typename?: 'Topic';
            id: string;
            name: string;
            url: any;
            groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
        } | null;
    } | null>;
};

export type OccupationManagerAssignMutationVariables = Exact<{
    isManager: Scalars['Boolean']['input'];
}>;

export type OccupationManagerAssignMutation = {
    __typename?: 'Mutation';
    occupationManagerAssign: {
        __typename?: 'UserOccupationInfo';
        isManager?: boolean | null;
        group?: {__typename?: 'OccupationGroup'; id: string; name: string} | null;
        canonical?: {__typename?: 'Occupation'; id: string; name: string} | null;
        raw?: {__typename?: 'Occupation'; id: string; name: string} | null;
    };
};

export type OccupationGroupAssignMutationVariables = Exact<{
    requestGroupOccupationAssignment?: InputMaybe<OccupationGroupAssignmentInput>;
}>;

export type OccupationGroupAssignMutation = {
    __typename?: 'Mutation';
    occupationGroupAssign: {
        __typename?: 'UserOccupationInfo';
        isManager?: boolean | null;
        group?: {__typename?: 'OccupationGroup'; id: string; name: string} | null;
        canonical?: {__typename?: 'Occupation'; id: string; name: string} | null;
        raw?: {__typename?: 'Occupation'; id: string; name: string} | null;
    };
};

export type OccupationAssignMutationVariables = Exact<{
    requestOccupationAssignment?: InputMaybe<OccupationAssignmentInput>;
}>;

export type OccupationAssignMutation = {
    __typename?: 'Mutation';
    occupationAssign: {
        __typename?: 'UserOccupationInfo';
        isManager?: boolean | null;
        group?: {__typename?: 'OccupationGroup'; id: string; name: string} | null;
        canonical?: {__typename?: 'Occupation'; id: string; name: string} | null;
        raw?: {__typename?: 'Occupation'; id: string; name: string} | null;
    };
};

export type OccupationRawAssignMutationVariables = Exact<{
    requestOccupationAssignment?: InputMaybe<OccupationRawAssignmentInput>;
}>;

export type OccupationRawAssignMutation = {
    __typename?: 'Mutation';
    occupationRawAssign: {
        __typename?: 'UserOccupationInfo';
        isManager?: boolean | null;
        group?: {__typename?: 'OccupationGroup'; id: string; name: string} | null;
        canonical?: {__typename?: 'Occupation'; id: string; name: string} | null;
        raw?: {__typename?: 'Occupation'; id: string; name: string} | null;
    };
};

export type TopicSearchQueryVariables = Exact<{
    filters?: InputMaybe<TopicFilters>;
    query?: InputMaybe<Scalars['String']['input']>;
    limit: Scalars['PositiveInt']['input'];
}>;

export type TopicSearchQuery = {
    __typename?: 'Query';
    topicSearch: Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        url: any;
        groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
    }>;
};

export type TopicGroupsQueryVariables = Exact<{
    ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;

export type TopicGroupsQuery = {
    __typename?: 'Query';
    topicGroups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
};

export type TopicInterestsQueryVariables = Exact<{[key: string]: never}>;

export type TopicInterestsQuery = {
    __typename?: 'Query';
    topicInterests: Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        url: any;
        groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
    }>;
};

export type TopicQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type TopicQuery = {
    __typename?: 'Query';
    topic?: {
        __typename?: 'Topic';
        id: string;
        name: string;
        url: any;
        groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
    } | null;
};

export type TopicInterestAssignMutationVariables = Exact<{
    topicIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;

export type TopicInterestAssignMutation = {
    __typename?: 'Mutation';
    topicInterestAssign: Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        url: any;
        groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
    }>;
};

export type TopicInterestUnassignMutationVariables = Exact<{
    topicIds?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;

export type TopicInterestUnassignMutation = {
    __typename?: 'Mutation';
    topicInterestUnassign: Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        url: any;
        groups: Array<{__typename?: 'TopicGroup'; id: string; name: string}>;
    }>;
};

export type LabSearchResponseQueryVariables = Exact<{
    query: Scalars['String']['input'];
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

export type SearchLecturesQueryVariables = Exact<{
    query: Scalars['String']['input'];
}>;

export type SearchLecturesQuery = {
    __typename?: 'Query';
    searchLectures?: {
        __typename?: 'LectureSearchResponse';
        lectures: Array<{
            __typename?: 'LectureSearchResult';
            trackingId?: string | null;
            lecture:
                | {
                      __typename?: 'ArticleLecture';
                      durationInSeconds: any;
                      id: string;
                      thumbnail?: any | null;
                      title: string;
                      urlAutoEnroll: any;
                      urlLanding: any;
                      images: {__typename?: 'LectureImages'; height480?: string | null};
                  }
                | {
                      __typename?: 'VideoLecture';
                      durationInSeconds: any;
                      id: string;
                      thumbnail?: any | null;
                      title: string;
                      urlAutoEnroll: any;
                      urlLanding: any;
                      images: {__typename?: 'LectureImages'; height480?: string | null};
                  }
                | {
                      __typename?: 'VideoMashupLecture';
                      durationInSeconds: any;
                      id: string;
                      thumbnail?: any | null;
                      title: string;
                      urlAutoEnroll: any;
                      urlLanding: any;
                      images: {__typename?: 'LectureImages'; height480?: string | null};
                  };
            course: {
                __typename?: 'Course';
                id: string;
                title?: string | null;
                images: {__typename?: 'CourseImages'; px480x270?: string | null};
                instructors: Array<{
                    __typename?: 'CourseInstructor';
                    url?: any | null;
                    images: {__typename?: 'InstructorImages'; px50x50?: string | null};
                }>;
                primaryTopic?: {__typename?: 'Topic'; name: string} | null;
            };
        }>;
        metadata?: {
            __typename?: 'LectureSearchResponseMetadata';
            lectureExperimentVariant: string;
            showLabUnit: boolean;
            showLectureDiscoveryUnit: boolean;
            trackingId: string;
        } | null;
    } | null;
};

export type SubscriptionPlansByProductTypeQueryVariables = Exact<{
    productType?: InputMaybe<SubscriptionPlanProductType>;
    licenseCount?: InputMaybe<Scalars['Int']['input']>;
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
                  __typename?: 'DailySubscriptionPlanPricingOption';
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
            | {
                  __typename?: 'WeeklySubscriptionPlanPricingOption';
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
        cancelDate?: any | null;
        status: SubscriptionStatus;
        licenseCount: number;
        usedLicenseCount: number;
        subscriber: {__typename: 'Organization'; id: string} | {__typename: 'User'; id: string};
        trialInterval?: {__typename?: 'DateInterval'; type: DateIntervalType; count: number} | null;
        billing?: {
            __typename?: 'SubscriptionBilling';
            currentPeriodStartDate: any;
            currentPeriodEndDate: any;
            chargePrice: {
                __typename?: 'Money';
                amount?: any | null;
                currency?: CurrencyCode | null;
            };
            taxPrice: {__typename?: 'Money'; amount?: any | null; currency?: CurrencyCode | null};
        } | null;
    } | null;
};

export type CancelSubscriptionEnrollmentMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type CancelSubscriptionEnrollmentMutation = {
    __typename?: 'Mutation';
    subscriptionEnrollmentCancel?: {
        __typename?: 'SubscriptionEnrollment';
        id: string;
        status: SubscriptionStatus;
        cancelDate?: any | null;
        billing?: {__typename?: 'SubscriptionBilling'; currentPeriodEndDate: any} | null;
    } | null;
};

export type ReactivateSubscriptionEnrollmentMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ReactivateSubscriptionEnrollmentMutation = {
    __typename?: 'Mutation';
    subscriptionEnrollmentReactivate?: {
        __typename?: 'SubscriptionEnrollment';
        id: string;
        status: SubscriptionStatus;
        cancelDate?: any | null;
        billing?: {__typename?: 'SubscriptionBilling'; currentPeriodEndDate: any} | null;
    } | null;
};

export type StreakUserLectureConsumptionWeeklyQueryVariables = Exact<{[key: string]: never}>;

export type StreakUserLectureConsumptionWeeklyQuery = {
    __typename?: 'Query';
    streakUserLectureConsumptionWeekly: {
        __typename?: 'StreakUserLectureConsumptionWeekly';
        minutesThisWeek?: number | null;
        goalMinutesThisWeek?: number | null;
        streakStatus: StreakStatus;
        weekStartTime: any;
        weekEndTime: any;
        weeklyStreak: {
            __typename?: 'WeeklyStreak';
            id: string;
            userId: string;
            streakLength: number;
            achievedThisWeek: boolean;
            startDate?: any | null;
        };
    };
};

export type FeatureVariantAssignmentsQueryVariables = Exact<{
    featureCodes: Array<Scalars['String']['input']> | Scalars['String']['input'];
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
    TError = unknown
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
    TError = unknown
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
    TError = unknown
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
    TError = unknown
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
export const LearningCommunitiesDocument = `
    query learningCommunities($ids: [UUID!]!) {
  learningCommunities(ids: $ids) {
    id
    title
    description
    reason: creationReason {
      type
      text
    }
    owner {
      id
      profile {
        name
        surname
      }
    }
    members {
      id
      profile {
        name
        surname
        email
        images {
          px50x50
        }
      }
    }
    numberOfMembers
    topics {
      id
      title: name
      url
    }
  }
}
    `;
export const useLearningCommunitiesQuery = <TData = LearningCommunitiesQuery, TError = unknown>(
    variables: LearningCommunitiesQueryVariables,
    options?: UseQueryOptions<LearningCommunitiesQuery, TError, TData>,
) =>
    useQuery<LearningCommunitiesQuery, TError, TData>(
        ['learningCommunities', variables],
        fetchData<LearningCommunitiesQuery, LearningCommunitiesQueryVariables>(
            LearningCommunitiesDocument,
            variables,
        ),
        options,
    );

useLearningCommunitiesQuery.getKey = (variables: LearningCommunitiesQueryVariables) => [
    'learningCommunities',
    variables,
];
useLearningCommunitiesQuery.fetcher = (
    variables: LearningCommunitiesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<LearningCommunitiesQuery, LearningCommunitiesQueryVariables>(
        LearningCommunitiesDocument,
        variables,
        options,
    );
export const GetLearningCommunityActivitiesDocument = `
    query getLearningCommunityActivities($id: UUID!, $limit: Int!, $cursor: String) {
  learningCommunityActivities(id: $id, limit: $limit, cursor: $cursor) {
    cursor
    items {
      by {
        id
        profile {
          name
          surname
          images {
            px75x75
          }
        }
      }
      event {
        __typename
        ... on LearningProductEvent {
          productEventType: eventType
          dateTime
          product {
            __typename
            id
            ... on Course {
              title
              headline
              duration
              durationInSeconds
              locale
              level
              duration
              rating {
                count
                average
              }
              urlCourseLanding
              topics {
                id
                title: name
              }
              categories {
                id
                title: name
              }
              instructors {
                id
                name
              }
              images {
                px50x50
                px100x100
                px240x135
                px480x270
              }
            }
          }
        }
        ... on LearningCommunityCurriculumItemEvent {
          dateTime
          curriculumItemEventType: eventType
          course {
            id
            title
            urlCourseLanding
            topics {
              id
              title: name
            }
            categories {
              id
              title: name
            }
          }
          item {
            __typename
            ... on Lecture {
              id
              title
              urlLanding
              durationInSeconds
              urlAutoEnroll
              images {
                height50
                height100
                height480
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const useGetLearningCommunityActivitiesQuery = <
    TData = GetLearningCommunityActivitiesQuery,
    TError = unknown
>(
    variables: GetLearningCommunityActivitiesQueryVariables,
    options?: UseQueryOptions<GetLearningCommunityActivitiesQuery, TError, TData>,
) =>
    useQuery<GetLearningCommunityActivitiesQuery, TError, TData>(
        ['getLearningCommunityActivities', variables],
        fetchData<
            GetLearningCommunityActivitiesQuery,
            GetLearningCommunityActivitiesQueryVariables
        >(GetLearningCommunityActivitiesDocument, variables),
        options,
    );

useGetLearningCommunityActivitiesQuery.getKey = (
    variables: GetLearningCommunityActivitiesQueryVariables,
) => ['getLearningCommunityActivities', variables];
useGetLearningCommunityActivitiesQuery.fetcher = (
    variables: GetLearningCommunityActivitiesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<GetLearningCommunityActivitiesQuery, GetLearningCommunityActivitiesQueryVariables>(
        GetLearningCommunityActivitiesDocument,
        variables,
        options,
    );
export const LearningCommunityAddMembersDocument = `
    mutation learningCommunityAddMembers($id: UUID!, $userIds: [ID!]!, $invitation: LearningCommunityInviteInput!) {
  learningCommunityAddMembers(
    id: $id
    input: {userIds: $userIds, invitation: $invitation}
  )
}
    `;
export const useLearningCommunityAddMembersMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        LearningCommunityAddMembersMutation,
        TError,
        LearningCommunityAddMembersMutationVariables,
        TContext
    >,
) =>
    useMutation<
        LearningCommunityAddMembersMutation,
        TError,
        LearningCommunityAddMembersMutationVariables,
        TContext
    >(
        ['learningCommunityAddMembers'],
        (variables?: LearningCommunityAddMembersMutationVariables) =>
            fetchData<
                LearningCommunityAddMembersMutation,
                LearningCommunityAddMembersMutationVariables
            >(LearningCommunityAddMembersDocument, variables)(),
        options,
    );
useLearningCommunityAddMembersMutation.getKey = () => ['learningCommunityAddMembers'];

useLearningCommunityAddMembersMutation.fetcher = (
    variables: LearningCommunityAddMembersMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<LearningCommunityAddMembersMutation, LearningCommunityAddMembersMutationVariables>(
        LearningCommunityAddMembersDocument,
        variables,
        options,
    );
export const LearningCommunityCreateDocument = `
    mutation learningCommunityCreate($learningCommunity: LearningCommunityInput!) {
  learningCommunityCreate(learningCommunity: $learningCommunity) {
    id
    organizationId
    title
    description
    reason: creationReason {
      type
      text
    }
    owner {
      id
    }
    members {
      id
    }
    numberOfMembers
    topics {
      id
      title: name
      url
    }
  }
}
    `;
export const useLearningCommunityCreateMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        LearningCommunityCreateMutation,
        TError,
        LearningCommunityCreateMutationVariables,
        TContext
    >,
) =>
    useMutation<
        LearningCommunityCreateMutation,
        TError,
        LearningCommunityCreateMutationVariables,
        TContext
    >(
        ['learningCommunityCreate'],
        (variables?: LearningCommunityCreateMutationVariables) =>
            fetchData<LearningCommunityCreateMutation, LearningCommunityCreateMutationVariables>(
                LearningCommunityCreateDocument,
                variables,
            )(),
        options,
    );
useLearningCommunityCreateMutation.getKey = () => ['learningCommunityCreate'];

useLearningCommunityCreateMutation.fetcher = (
    variables: LearningCommunityCreateMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<LearningCommunityCreateMutation, LearningCommunityCreateMutationVariables>(
        LearningCommunityCreateDocument,
        variables,
        options,
    );
export const LearningCommunityDeleteDocument = `
    mutation learningCommunityDelete($id: UUID!) {
  learningCommunityDelete(id: $id)
}
    `;
export const useLearningCommunityDeleteMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        LearningCommunityDeleteMutation,
        TError,
        LearningCommunityDeleteMutationVariables,
        TContext
    >,
) =>
    useMutation<
        LearningCommunityDeleteMutation,
        TError,
        LearningCommunityDeleteMutationVariables,
        TContext
    >(
        ['learningCommunityDelete'],
        (variables?: LearningCommunityDeleteMutationVariables) =>
            fetchData<LearningCommunityDeleteMutation, LearningCommunityDeleteMutationVariables>(
                LearningCommunityDeleteDocument,
                variables,
            )(),
        options,
    );
useLearningCommunityDeleteMutation.getKey = () => ['learningCommunityDelete'];

useLearningCommunityDeleteMutation.fetcher = (
    variables: LearningCommunityDeleteMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<LearningCommunityDeleteMutation, LearningCommunityDeleteMutationVariables>(
        LearningCommunityDeleteDocument,
        variables,
        options,
    );
export const LearningCommunityRemoveMembersDocument = `
    mutation learningCommunityRemoveMembers($id: UUID!, $userIds: [ID!]!) {
  learningCommunityRemoveMembers(id: $id, input: {userIds: $userIds})
}
    `;
export const useLearningCommunityRemoveMembersMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        LearningCommunityRemoveMembersMutation,
        TError,
        LearningCommunityRemoveMembersMutationVariables,
        TContext
    >,
) =>
    useMutation<
        LearningCommunityRemoveMembersMutation,
        TError,
        LearningCommunityRemoveMembersMutationVariables,
        TContext
    >(
        ['learningCommunityRemoveMembers'],
        (variables?: LearningCommunityRemoveMembersMutationVariables) =>
            fetchData<
                LearningCommunityRemoveMembersMutation,
                LearningCommunityRemoveMembersMutationVariables
            >(LearningCommunityRemoveMembersDocument, variables)(),
        options,
    );
useLearningCommunityRemoveMembersMutation.getKey = () => ['learningCommunityRemoveMembers'];

useLearningCommunityRemoveMembersMutation.fetcher = (
    variables: LearningCommunityRemoveMembersMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        LearningCommunityRemoveMembersMutation,
        LearningCommunityRemoveMembersMutationVariables
    >(LearningCommunityRemoveMembersDocument, variables, options);
export const MyLearningCommunitiesDocument = `
    query myLearningCommunities {
  learningCommunities {
    id
    title
    description
    reason: creationReason {
      type
    }
    owner {
      id
      profile {
        name
        surname
      }
    }
    numberOfMembers
    topics {
      id
      title: name
    }
  }
}
    `;
export const useMyLearningCommunitiesQuery = <TData = MyLearningCommunitiesQuery, TError = unknown>(
    variables?: MyLearningCommunitiesQueryVariables,
    options?: UseQueryOptions<MyLearningCommunitiesQuery, TError, TData>,
) =>
    useQuery<MyLearningCommunitiesQuery, TError, TData>(
        variables === undefined ? ['myLearningCommunities'] : ['myLearningCommunities', variables],
        fetchData<MyLearningCommunitiesQuery, MyLearningCommunitiesQueryVariables>(
            MyLearningCommunitiesDocument,
            variables,
        ),
        options,
    );

useMyLearningCommunitiesQuery.getKey = (variables?: MyLearningCommunitiesQueryVariables) =>
    variables === undefined ? ['myLearningCommunities'] : ['myLearningCommunities', variables];
useMyLearningCommunitiesQuery.fetcher = (
    variables?: MyLearningCommunitiesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<MyLearningCommunitiesQuery, MyLearningCommunitiesQueryVariables>(
        MyLearningCommunitiesDocument,
        variables,
        options,
    );
export const ProLearningPathsByTopicDocument = `
    query proLearningPathsByTopic($topicId: ID!) {
  proLearningPathsByTopic(topicId: $topicId) {
    id
    title
    description
    itemCount
    numberOfEnrollments
  }
}
    `;
export const useProLearningPathsByTopicQuery = <
    TData = ProLearningPathsByTopicQuery,
    TError = unknown
>(
    variables: ProLearningPathsByTopicQueryVariables,
    options?: UseQueryOptions<ProLearningPathsByTopicQuery, TError, TData>,
) =>
    useQuery<ProLearningPathsByTopicQuery, TError, TData>(
        ['proLearningPathsByTopic', variables],
        fetchData<ProLearningPathsByTopicQuery, ProLearningPathsByTopicQueryVariables>(
            ProLearningPathsByTopicDocument,
            variables,
        ),
        options,
    );

useProLearningPathsByTopicQuery.getKey = (variables: ProLearningPathsByTopicQueryVariables) => [
    'proLearningPathsByTopic',
    variables,
];
useProLearningPathsByTopicQuery.fetcher = (
    variables: ProLearningPathsByTopicQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<ProLearningPathsByTopicQuery, ProLearningPathsByTopicQueryVariables>(
        ProLearningPathsByTopicDocument,
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
    TError = unknown
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
export const BadgeClassDocument = `
    query badgeClass($id: ID!) {
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
    assertions {
      id
      issuedOn
      expires
      externalUrl
    }
  }
}
    `;
export const useBadgeClassQuery = <TData = BadgeClassQuery, TError = unknown>(
    variables: BadgeClassQueryVariables,
    options?: UseQueryOptions<BadgeClassQuery, TError, TData>,
) =>
    useQuery<BadgeClassQuery, TError, TData>(
        ['badgeClass', variables],
        fetchData<BadgeClassQuery, BadgeClassQueryVariables>(BadgeClassDocument, variables),
        options,
    );

useBadgeClassQuery.getKey = (variables: BadgeClassQueryVariables) => ['badgeClass', variables];
useBadgeClassQuery.fetcher = (
    variables: BadgeClassQueryVariables,
    options?: RequestInit['headers'],
) => fetchData<BadgeClassQuery, BadgeClassQueryVariables>(BadgeClassDocument, variables, options);
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
export const ActiveBadgeClassesDocument = `
    query activeBadgeClasses {
  activeBadgeClasses {
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
export const useActiveBadgeClassesQuery = <TData = ActiveBadgeClassesQuery, TError = unknown>(
    variables?: ActiveBadgeClassesQueryVariables,
    options?: UseQueryOptions<ActiveBadgeClassesQuery, TError, TData>,
) =>
    useQuery<ActiveBadgeClassesQuery, TError, TData>(
        variables === undefined ? ['activeBadgeClasses'] : ['activeBadgeClasses', variables],
        fetchData<ActiveBadgeClassesQuery, ActiveBadgeClassesQueryVariables>(
            ActiveBadgeClassesDocument,
            variables,
        ),
        options,
    );

useActiveBadgeClassesQuery.getKey = (variables?: ActiveBadgeClassesQueryVariables) =>
    variables === undefined ? ['activeBadgeClasses'] : ['activeBadgeClasses', variables];
useActiveBadgeClassesQuery.fetcher = (
    variables?: ActiveBadgeClassesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<ActiveBadgeClassesQuery, ActiveBadgeClassesQueryVariables>(
        ActiveBadgeClassesDocument,
        variables,
        options,
    );
export const BadgeClassEnrollmentsByBadgeClassIdDocument = `
    query badgeClassEnrollmentsByBadgeClassId($badgeClassId: ID!) {
  badgeClassEnrollmentsByBadgeClassId(id: $badgeClassId) {
    learningProduct {
      __typename
      ... on Course {
        id
        title
        images {
          px480x270
          px240x135
          px100x100
          px75x75
          px50x50
        }
        instructors {
          name
        }
        urlCourseLanding
        enrollable
      }
      ... on LearningPath {
        id
        learningPathTitle: title
        description
        itemCount
      }
    }
    completionPercentage
  }
}
    `;
export const useBadgeClassEnrollmentsByBadgeClassIdQuery = <
    TData = BadgeClassEnrollmentsByBadgeClassIdQuery,
    TError = unknown
>(
    variables: BadgeClassEnrollmentsByBadgeClassIdQueryVariables,
    options?: UseQueryOptions<BadgeClassEnrollmentsByBadgeClassIdQuery, TError, TData>,
) =>
    useQuery<BadgeClassEnrollmentsByBadgeClassIdQuery, TError, TData>(
        ['badgeClassEnrollmentsByBadgeClassId', variables],
        fetchData<
            BadgeClassEnrollmentsByBadgeClassIdQuery,
            BadgeClassEnrollmentsByBadgeClassIdQueryVariables
        >(BadgeClassEnrollmentsByBadgeClassIdDocument, variables),
        options,
    );

useBadgeClassEnrollmentsByBadgeClassIdQuery.getKey = (
    variables: BadgeClassEnrollmentsByBadgeClassIdQueryVariables,
) => ['badgeClassEnrollmentsByBadgeClassId', variables];
useBadgeClassEnrollmentsByBadgeClassIdQuery.fetcher = (
    variables: BadgeClassEnrollmentsByBadgeClassIdQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        BadgeClassEnrollmentsByBadgeClassIdQuery,
        BadgeClassEnrollmentsByBadgeClassIdQueryVariables
    >(BadgeClassEnrollmentsByBadgeClassIdDocument, variables, options);
export const BadgeClassesByLearningProductsDocument = `
    query badgeClassesByLearningProducts($learningProducts: [LearningProductInput!]!) {
  badgeClassesByLearningProducts(learningProducts: $learningProducts) {
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
export const useBadgeClassesByLearningProductsQuery = <
    TData = BadgeClassesByLearningProductsQuery,
    TError = unknown
>(
    variables: BadgeClassesByLearningProductsQueryVariables,
    options?: UseQueryOptions<BadgeClassesByLearningProductsQuery, TError, TData>,
) =>
    useQuery<BadgeClassesByLearningProductsQuery, TError, TData>(
        ['badgeClassesByLearningProducts', variables],
        fetchData<
            BadgeClassesByLearningProductsQuery,
            BadgeClassesByLearningProductsQueryVariables
        >(BadgeClassesByLearningProductsDocument, variables),
        options,
    );

useBadgeClassesByLearningProductsQuery.getKey = (
    variables: BadgeClassesByLearningProductsQueryVariables,
) => ['badgeClassesByLearningProducts', variables];
useBadgeClassesByLearningProductsQuery.fetcher = (
    variables: BadgeClassesByLearningProductsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeClassesByLearningProductsQuery, BadgeClassesByLearningProductsQueryVariables>(
        BadgeClassesByLearningProductsDocument,
        variables,
        options,
    );
export const StoreAssertionByUrlDocument = `
    mutation storeAssertionByUrl($externalUrl: URL!) {
  badgeAssertionStoreByUrl(externalUrl: $externalUrl) {
    id
    issuedOn
    expires
    externalUrl
    badgeClass {
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
}
    `;
export const useStoreAssertionByUrlMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        StoreAssertionByUrlMutation,
        TError,
        StoreAssertionByUrlMutationVariables,
        TContext
    >,
) =>
    useMutation<
        StoreAssertionByUrlMutation,
        TError,
        StoreAssertionByUrlMutationVariables,
        TContext
    >(
        ['storeAssertionByUrl'],
        (variables?: StoreAssertionByUrlMutationVariables) =>
            fetchData<StoreAssertionByUrlMutation, StoreAssertionByUrlMutationVariables>(
                StoreAssertionByUrlDocument,
                variables,
            )(),
        options,
    );
useStoreAssertionByUrlMutation.getKey = () => ['storeAssertionByUrl'];

useStoreAssertionByUrlMutation.fetcher = (
    variables: StoreAssertionByUrlMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<StoreAssertionByUrlMutation, StoreAssertionByUrlMutationVariables>(
        StoreAssertionByUrlDocument,
        variables,
        options,
    );
export const BadgeAssertionsImportedDocument = `
    query badgeAssertionsImported($page: Int! = 0, $size: Int! = 12) {
  badgeAssertionsImported(page: $page, size: $size) {
    page
    pageCount
    items {
      id
      issuedOn
      expires
      badgeClass {
        id
        name
        image {
          id
        }
        issuer {
          name
        }
      }
      user {
        id
      }
    }
  }
}
    `;
export const useBadgeAssertionsImportedQuery = <
    TData = BadgeAssertionsImportedQuery,
    TError = unknown
>(
    variables?: BadgeAssertionsImportedQueryVariables,
    options?: UseQueryOptions<BadgeAssertionsImportedQuery, TError, TData>,
) =>
    useQuery<BadgeAssertionsImportedQuery, TError, TData>(
        variables === undefined
            ? ['badgeAssertionsImported']
            : ['badgeAssertionsImported', variables],
        fetchData<BadgeAssertionsImportedQuery, BadgeAssertionsImportedQueryVariables>(
            BadgeAssertionsImportedDocument,
            variables,
        ),
        options,
    );

useBadgeAssertionsImportedQuery.getKey = (variables?: BadgeAssertionsImportedQueryVariables) =>
    variables === undefined ? ['badgeAssertionsImported'] : ['badgeAssertionsImported', variables];
useBadgeAssertionsImportedQuery.fetcher = (
    variables?: BadgeAssertionsImportedQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeAssertionsImportedQuery, BadgeAssertionsImportedQueryVariables>(
        BadgeAssertionsImportedDocument,
        variables,
        options,
    );
export const BadgeAssertionsByUserDocument = `
    query badgeAssertionsByUser($userId: ID!, $page: Int! = 0, $size: Int! = 12) {
  badgeAssertionsByUser(userId: $userId, page: $page, size: $size) {
    page
    pageCount
    items {
      id
      issuedOn
      expires
      badgeClass {
        id
        name
        image {
          id
        }
        issuer {
          name
        }
      }
      user {
        id
      }
    }
  }
}
    `;
export const useBadgeAssertionsByUserQuery = <TData = BadgeAssertionsByUserQuery, TError = unknown>(
    variables: BadgeAssertionsByUserQueryVariables,
    options?: UseQueryOptions<BadgeAssertionsByUserQuery, TError, TData>,
) =>
    useQuery<BadgeAssertionsByUserQuery, TError, TData>(
        ['badgeAssertionsByUser', variables],
        fetchData<BadgeAssertionsByUserQuery, BadgeAssertionsByUserQueryVariables>(
            BadgeAssertionsByUserDocument,
            variables,
        ),
        options,
    );

useBadgeAssertionsByUserQuery.getKey = (variables: BadgeAssertionsByUserQueryVariables) => [
    'badgeAssertionsByUser',
    variables,
];
useBadgeAssertionsByUserQuery.fetcher = (
    variables: BadgeAssertionsByUserQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<BadgeAssertionsByUserQuery, BadgeAssertionsByUserQueryVariables>(
        BadgeAssertionsByUserDocument,
        variables,
        options,
    );

export const FetchLicensePoolsDocument = `
    query FetchLicensePools {
  licensePools {
    id
    name
    isDefault
    organization {
      id
    }
    licenseCounts {
      productType
      maxLicenseCount
      usedLicenseCount
    }
  }
}
    `;

export const useFetchLicensePoolsQuery = <TData = FetchLicensePoolsQuery, TError = unknown>(
    variables?: FetchLicensePoolsQueryVariables,
    options?: UseQueryOptions<FetchLicensePoolsQuery, TError, TData>,
) => {
    return useQuery<FetchLicensePoolsQuery, TError, TData>(
        variables === undefined ? ['FetchLicensePools'] : ['FetchLicensePools', variables],
        fetchData<FetchLicensePoolsQuery, FetchLicensePoolsQueryVariables>(
            FetchLicensePoolsDocument,
            variables,
        ),
        options,
    );
};

useFetchLicensePoolsQuery.getKey = (variables?: FetchLicensePoolsQueryVariables) =>
    variables === undefined ? ['FetchLicensePools'] : ['FetchLicensePools', variables];

useFetchLicensePoolsQuery.fetcher = (
    variables?: FetchLicensePoolsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<FetchLicensePoolsQuery, FetchLicensePoolsQueryVariables>(
        FetchLicensePoolsDocument,
        variables,
        options,
    );

export const UserOccupationInfoDocument = `
    query UserOccupationInfo {
  userOccupationInfo {
    group {
      id
      name
    }
    canonical {
      id
      name
    }
    raw {
      id
      name
    }
    isManager
  }
}
    `;
export const useUserOccupationInfoQuery = <TData = UserOccupationInfoQuery, TError = unknown>(
    variables?: UserOccupationInfoQueryVariables,
    options?: UseQueryOptions<UserOccupationInfoQuery, TError, TData>,
) =>
    useQuery<UserOccupationInfoQuery, TError, TData>(
        variables === undefined ? ['UserOccupationInfo'] : ['UserOccupationInfo', variables],
        fetchData<UserOccupationInfoQuery, UserOccupationInfoQueryVariables>(
            UserOccupationInfoDocument,
            variables,
        ),
        options,
    );

useUserOccupationInfoQuery.getKey = (variables?: UserOccupationInfoQueryVariables) =>
    variables === undefined ? ['UserOccupationInfo'] : ['UserOccupationInfo', variables];
useUserOccupationInfoQuery.fetcher = (
    variables?: UserOccupationInfoQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<UserOccupationInfoQuery, UserOccupationInfoQueryVariables>(
        UserOccupationInfoDocument,
        variables,
        options,
    );
export const OccupationGroupsDocument = `
    query OccupationGroups($ids: [ID!]) {
  occupationGroups(ids: $ids) {
    id
    name
  }
}
    `;
export const useOccupationGroupsQuery = <TData = OccupationGroupsQuery, TError = unknown>(
    variables?: OccupationGroupsQueryVariables,
    options?: UseQueryOptions<OccupationGroupsQuery, TError, TData>,
) =>
    useQuery<OccupationGroupsQuery, TError, TData>(
        variables === undefined ? ['OccupationGroups'] : ['OccupationGroups', variables],
        fetchData<OccupationGroupsQuery, OccupationGroupsQueryVariables>(
            OccupationGroupsDocument,
            variables,
        ),
        options,
    );

useOccupationGroupsQuery.getKey = (variables?: OccupationGroupsQueryVariables) =>
    variables === undefined ? ['OccupationGroups'] : ['OccupationGroups', variables];
useOccupationGroupsQuery.fetcher = (
    variables?: OccupationGroupsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationGroupsQuery, OccupationGroupsQueryVariables>(
        OccupationGroupsDocument,
        variables,
        options,
    );
export const OccupationSearchDocument = `
    query OccupationSearch($search: String, $groupIds: [ID!], $page: Int!, $pageSize: Int!) {
  occupationSearch(
    search: $search
    groupIds: $groupIds
    page: $page
    pageSize: $pageSize
  ) {
    page
    pageCount
    items {
      id
      name
      representativeTopic {
        id
        name
        url
        groups {
          id
          name
        }
      }
    }
  }
}
    `;
export const useOccupationSearchQuery = <TData = OccupationSearchQuery, TError = unknown>(
    variables: OccupationSearchQueryVariables,
    options?: UseQueryOptions<OccupationSearchQuery, TError, TData>,
) =>
    useQuery<OccupationSearchQuery, TError, TData>(
        ['OccupationSearch', variables],
        fetchData<OccupationSearchQuery, OccupationSearchQueryVariables>(
            OccupationSearchDocument,
            variables,
        ),
        options,
    );

useOccupationSearchQuery.getKey = (variables: OccupationSearchQueryVariables) => [
    'OccupationSearch',
    variables,
];
useOccupationSearchQuery.fetcher = (
    variables: OccupationSearchQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationSearchQuery, OccupationSearchQueryVariables>(
        OccupationSearchDocument,
        variables,
        options,
    );
export const OccupationsDocument = `
    query Occupations($ids: [ID!]!) {
  occupations(ids: $ids) {
    id
    name
    urlLandingPage
    representativeTopic {
      id
      name
      url
      groups {
        id
        name
      }
    }
  }
}
    `;
export const useOccupationsQuery = <TData = OccupationsQuery, TError = unknown>(
    variables: OccupationsQueryVariables,
    options?: UseQueryOptions<OccupationsQuery, TError, TData>,
) =>
    useQuery<OccupationsQuery, TError, TData>(
        ['Occupations', variables],
        fetchData<OccupationsQuery, OccupationsQueryVariables>(OccupationsDocument, variables),
        options,
    );

useOccupationsQuery.getKey = (variables: OccupationsQueryVariables) => ['Occupations', variables];
useOccupationsQuery.fetcher = (
    variables: OccupationsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationsQuery, OccupationsQueryVariables>(OccupationsDocument, variables, options);
export const OccupationManagerAssignDocument = `
    mutation OccupationManagerAssign($isManager: Boolean!) {
  occupationManagerAssign(isManager: $isManager) {
    group {
      id
      name
    }
    canonical {
      id
      name
    }
    raw {
      id
      name
    }
    isManager
  }
}
    `;
export const useOccupationManagerAssignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        OccupationManagerAssignMutation,
        TError,
        OccupationManagerAssignMutationVariables,
        TContext
    >,
) =>
    useMutation<
        OccupationManagerAssignMutation,
        TError,
        OccupationManagerAssignMutationVariables,
        TContext
    >(
        ['OccupationManagerAssign'],
        (variables?: OccupationManagerAssignMutationVariables) =>
            fetchData<OccupationManagerAssignMutation, OccupationManagerAssignMutationVariables>(
                OccupationManagerAssignDocument,
                variables,
            )(),
        options,
    );
useOccupationManagerAssignMutation.getKey = () => ['OccupationManagerAssign'];

useOccupationManagerAssignMutation.fetcher = (
    variables: OccupationManagerAssignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationManagerAssignMutation, OccupationManagerAssignMutationVariables>(
        OccupationManagerAssignDocument,
        variables,
        options,
    );
export const OccupationGroupAssignDocument = `
    mutation OccupationGroupAssign($requestGroupOccupationAssignment: OccupationGroupAssignmentInput) {
  occupationGroupAssign(
    requestGroupOccupationAssignment: $requestGroupOccupationAssignment
  ) {
    group {
      id
      name
    }
    canonical {
      id
      name
    }
    raw {
      id
      name
    }
    isManager
  }
}
    `;
export const useOccupationGroupAssignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        OccupationGroupAssignMutation,
        TError,
        OccupationGroupAssignMutationVariables,
        TContext
    >,
) =>
    useMutation<
        OccupationGroupAssignMutation,
        TError,
        OccupationGroupAssignMutationVariables,
        TContext
    >(
        ['OccupationGroupAssign'],
        (variables?: OccupationGroupAssignMutationVariables) =>
            fetchData<OccupationGroupAssignMutation, OccupationGroupAssignMutationVariables>(
                OccupationGroupAssignDocument,
                variables,
            )(),
        options,
    );
useOccupationGroupAssignMutation.getKey = () => ['OccupationGroupAssign'];

useOccupationGroupAssignMutation.fetcher = (
    variables?: OccupationGroupAssignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationGroupAssignMutation, OccupationGroupAssignMutationVariables>(
        OccupationGroupAssignDocument,
        variables,
        options,
    );
export const OccupationAssignDocument = `
    mutation occupationAssign($requestOccupationAssignment: OccupationAssignmentInput) {
  occupationAssign(requestOccupationAssignment: $requestOccupationAssignment) {
    group {
      id
      name
    }
    canonical {
      id
      name
    }
    raw {
      id
      name
    }
    isManager
  }
}
    `;
export const useOccupationAssignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        OccupationAssignMutation,
        TError,
        OccupationAssignMutationVariables,
        TContext
    >,
) =>
    useMutation<OccupationAssignMutation, TError, OccupationAssignMutationVariables, TContext>(
        ['occupationAssign'],
        (variables?: OccupationAssignMutationVariables) =>
            fetchData<OccupationAssignMutation, OccupationAssignMutationVariables>(
                OccupationAssignDocument,
                variables,
            )(),
        options,
    );
useOccupationAssignMutation.getKey = () => ['occupationAssign'];

useOccupationAssignMutation.fetcher = (
    variables?: OccupationAssignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationAssignMutation, OccupationAssignMutationVariables>(
        OccupationAssignDocument,
        variables,
        options,
    );
export const OccupationRawAssignDocument = `
    mutation occupationRawAssign($requestOccupationAssignment: OccupationRawAssignmentInput) {
  occupationRawAssign(requestOccupationAssignment: $requestOccupationAssignment) {
    group {
      id
      name
    }
    canonical {
      id
      name
    }
    raw {
      id
      name
    }
    isManager
  }
}
    `;
export const useOccupationRawAssignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        OccupationRawAssignMutation,
        TError,
        OccupationRawAssignMutationVariables,
        TContext
    >,
) =>
    useMutation<
        OccupationRawAssignMutation,
        TError,
        OccupationRawAssignMutationVariables,
        TContext
    >(
        ['occupationRawAssign'],
        (variables?: OccupationRawAssignMutationVariables) =>
            fetchData<OccupationRawAssignMutation, OccupationRawAssignMutationVariables>(
                OccupationRawAssignDocument,
                variables,
            )(),
        options,
    );
useOccupationRawAssignMutation.getKey = () => ['occupationRawAssign'];

useOccupationRawAssignMutation.fetcher = (
    variables?: OccupationRawAssignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<OccupationRawAssignMutation, OccupationRawAssignMutationVariables>(
        OccupationRawAssignDocument,
        variables,
        options,
    );
export const TopicSearchDocument = `
    query topicSearch($filters: TopicFilters, $query: String, $limit: PositiveInt!) {
  topicSearch(filters: $filters, query: $query, limit: $limit) {
    id
    name
    url
    groups {
      id
      name
    }
  }
}
    `;
export const useTopicSearchQuery = <TData = TopicSearchQuery, TError = unknown>(
    variables: TopicSearchQueryVariables,
    options?: UseQueryOptions<TopicSearchQuery, TError, TData>,
) =>
    useQuery<TopicSearchQuery, TError, TData>(
        ['topicSearch', variables],
        fetchData<TopicSearchQuery, TopicSearchQueryVariables>(TopicSearchDocument, variables),
        options,
    );

useTopicSearchQuery.getKey = (variables: TopicSearchQueryVariables) => ['topicSearch', variables];
useTopicSearchQuery.fetcher = (
    variables: TopicSearchQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<TopicSearchQuery, TopicSearchQueryVariables>(TopicSearchDocument, variables, options);
export const TopicGroupsDocument = `
    query topicGroups($ids: [ID!]) {
  topicGroups(ids: $ids) {
    id
    name
  }
}
    `;
export const useTopicGroupsQuery = <TData = TopicGroupsQuery, TError = unknown>(
    variables?: TopicGroupsQueryVariables,
    options?: UseQueryOptions<TopicGroupsQuery, TError, TData>,
) =>
    useQuery<TopicGroupsQuery, TError, TData>(
        variables === undefined ? ['topicGroups'] : ['topicGroups', variables],
        fetchData<TopicGroupsQuery, TopicGroupsQueryVariables>(TopicGroupsDocument, variables),
        options,
    );

useTopicGroupsQuery.getKey = (variables?: TopicGroupsQueryVariables) =>
    variables === undefined ? ['topicGroups'] : ['topicGroups', variables];
useTopicGroupsQuery.fetcher = (
    variables?: TopicGroupsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<TopicGroupsQuery, TopicGroupsQueryVariables>(TopicGroupsDocument, variables, options);
export const TopicInterestsDocument = `
    query topicInterests {
  topicInterests {
    id
    name
    url
    groups {
      id
      name
    }
  }
}
    `;
export const useTopicInterestsQuery = <TData = TopicInterestsQuery, TError = unknown>(
    variables?: TopicInterestsQueryVariables,
    options?: UseQueryOptions<TopicInterestsQuery, TError, TData>,
) =>
    useQuery<TopicInterestsQuery, TError, TData>(
        variables === undefined ? ['topicInterests'] : ['topicInterests', variables],
        fetchData<TopicInterestsQuery, TopicInterestsQueryVariables>(
            TopicInterestsDocument,
            variables,
        ),
        options,
    );

useTopicInterestsQuery.getKey = (variables?: TopicInterestsQueryVariables) =>
    variables === undefined ? ['topicInterests'] : ['topicInterests', variables];
useTopicInterestsQuery.fetcher = (
    variables?: TopicInterestsQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<TopicInterestsQuery, TopicInterestsQueryVariables>(
        TopicInterestsDocument,
        variables,
        options,
    );
export const TopicDocument = `
    query topic($id: ID!) {
  topic(id: $id) {
    id
    name
    url
    groups {
      id
      name
    }
  }
}
    `;
export const useTopicQuery = <TData = TopicQuery, TError = unknown>(
    variables: TopicQueryVariables,
    options?: UseQueryOptions<TopicQuery, TError, TData>,
) =>
    useQuery<TopicQuery, TError, TData>(
        ['topic', variables],
        fetchData<TopicQuery, TopicQueryVariables>(TopicDocument, variables),
        options,
    );

useTopicQuery.getKey = (variables: TopicQueryVariables) => ['topic', variables];
useTopicQuery.fetcher = (variables: TopicQueryVariables, options?: RequestInit['headers']) =>
    fetchData<TopicQuery, TopicQueryVariables>(TopicDocument, variables, options);
export const TopicInterestAssignDocument = `
    mutation topicInterestAssign($topicIds: [ID!]) {
  topicInterestAssign(topicIds: $topicIds) {
    id
    name
    url
    groups {
      id
      name
    }
  }
}
    `;
export const useTopicInterestAssignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        TopicInterestAssignMutation,
        TError,
        TopicInterestAssignMutationVariables,
        TContext
    >,
) =>
    useMutation<
        TopicInterestAssignMutation,
        TError,
        TopicInterestAssignMutationVariables,
        TContext
    >(
        ['topicInterestAssign'],
        (variables?: TopicInterestAssignMutationVariables) =>
            fetchData<TopicInterestAssignMutation, TopicInterestAssignMutationVariables>(
                TopicInterestAssignDocument,
                variables,
            )(),
        options,
    );
useTopicInterestAssignMutation.getKey = () => ['topicInterestAssign'];

useTopicInterestAssignMutation.fetcher = (
    variables?: TopicInterestAssignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<TopicInterestAssignMutation, TopicInterestAssignMutationVariables>(
        TopicInterestAssignDocument,
        variables,
        options,
    );
export const TopicInterestUnassignDocument = `
    mutation topicInterestUnassign($topicIds: [ID!]) {
  topicInterestUnassign(topicIds: $topicIds) {
    id
    name
    url
    groups {
      id
      name
    }
  }
}
    `;
export const useTopicInterestUnassignMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<
        TopicInterestUnassignMutation,
        TError,
        TopicInterestUnassignMutationVariables,
        TContext
    >,
) =>
    useMutation<
        TopicInterestUnassignMutation,
        TError,
        TopicInterestUnassignMutationVariables,
        TContext
    >(
        ['topicInterestUnassign'],
        (variables?: TopicInterestUnassignMutationVariables) =>
            fetchData<TopicInterestUnassignMutation, TopicInterestUnassignMutationVariables>(
                TopicInterestUnassignDocument,
                variables,
            )(),
        options,
    );
useTopicInterestUnassignMutation.getKey = () => ['topicInterestUnassign'];

useTopicInterestUnassignMutation.fetcher = (
    variables?: TopicInterestUnassignMutationVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<TopicInterestUnassignMutation, TopicInterestUnassignMutationVariables>(
        TopicInterestUnassignDocument,
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
export const SearchLecturesDocument = `
    query searchLectures($query: String!) {
  searchLectures(query: $query) {
    lectures {
      lecture {
        durationInSeconds
        id
        images {
          height480
        }
        thumbnail
        title
        urlAutoEnroll
        urlLanding
      }
      course {
        id
        images {
          px480x270
        }
        instructors {
          url
          images {
            px50x50
          }
        }
        primaryTopic {
          name
        }
        title
      }
      trackingId
    }
    metadata {
      lectureExperimentVariant
      showLabUnit
      showLectureDiscoveryUnit
      trackingId
    }
  }
}
    `;
export const useSearchLecturesQuery = <TData = SearchLecturesQuery, TError = unknown>(
    variables: SearchLecturesQueryVariables,
    options?: UseQueryOptions<SearchLecturesQuery, TError, TData>,
) =>
    useQuery<SearchLecturesQuery, TError, TData>(
        ['searchLectures', variables],
        fetchData<SearchLecturesQuery, SearchLecturesQueryVariables>(
            SearchLecturesDocument,
            variables,
        ),
        options,
    );

useSearchLecturesQuery.getKey = (variables: SearchLecturesQueryVariables) => [
    'searchLectures',
    variables,
];
useSearchLecturesQuery.fetcher = (
    variables: SearchLecturesQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<SearchLecturesQuery, SearchLecturesQueryVariables>(
        SearchLecturesDocument,
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
      ... on WeeklySubscriptionPlanPricingOption {
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
      ... on DailySubscriptionPlanPricingOption {
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
    }
  }
}
    `;
export const useSubscriptionPlansByProductTypeQuery = <
    TData = SubscriptionPlansByProductTypeQuery,
    TError = unknown
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
    cancelDate
    status
    licenseCount
    usedLicenseCount
    billing {
      chargePrice {
        amount
        currency
      }
      taxPrice {
        amount
        currency
      }
      currentPeriodStartDate
      currentPeriodEndDate
    }
  }
}
    `;
export const useFetchCurrentSubscriptionEnrollmentQuery = <
    TData = FetchCurrentSubscriptionEnrollmentQuery,
    TError = unknown
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
    billing {
      currentPeriodEndDate
    }
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
    billing {
      currentPeriodEndDate
    }
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
export const StreakUserLectureConsumptionWeeklyDocument = `
    query StreakUserLectureConsumptionWeekly {
  streakUserLectureConsumptionWeekly {
    weeklyStreak {
      id
      userId
      streakLength
      achievedThisWeek
      startDate
    }
    minutesThisWeek
    goalMinutesThisWeek
    streakStatus
    weekStartTime
    weekEndTime
  }
}
    `;
export const useStreakUserLectureConsumptionWeeklyQuery = <
    TData = StreakUserLectureConsumptionWeeklyQuery,
    TError = unknown
>(
    variables?: StreakUserLectureConsumptionWeeklyQueryVariables,
    options?: UseQueryOptions<StreakUserLectureConsumptionWeeklyQuery, TError, TData>,
) =>
    useQuery<StreakUserLectureConsumptionWeeklyQuery, TError, TData>(
        variables === undefined
            ? ['StreakUserLectureConsumptionWeekly']
            : ['StreakUserLectureConsumptionWeekly', variables],
        fetchData<
            StreakUserLectureConsumptionWeeklyQuery,
            StreakUserLectureConsumptionWeeklyQueryVariables
        >(StreakUserLectureConsumptionWeeklyDocument, variables),
        options,
    );

useStreakUserLectureConsumptionWeeklyQuery.getKey = (
    variables?: StreakUserLectureConsumptionWeeklyQueryVariables,
) =>
    variables === undefined
        ? ['StreakUserLectureConsumptionWeekly']
        : ['StreakUserLectureConsumptionWeekly', variables];
useStreakUserLectureConsumptionWeeklyQuery.fetcher = (
    variables?: StreakUserLectureConsumptionWeeklyQueryVariables,
    options?: RequestInit['headers'],
) =>
    fetchData<
        StreakUserLectureConsumptionWeeklyQuery,
        StreakUserLectureConsumptionWeeklyQueryVariables
    >(StreakUserLectureConsumptionWeeklyDocument, variables, options);
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
    TError = unknown
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
