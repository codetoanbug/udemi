/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from 'src/lib/gql-fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  DurationInMinutes: any;
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
  RRuleString: any;
  RoutingNumber: any;
  SafeInt: any;
  Time: any;
  TimeStamp: any;
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

/** An API client */
export type ApiClient = {
  /** The API Client expiration date */
  expiration?: Maybe<Scalars['Date']>;
  /** The API Client ID as UUID */
  id: Scalars['ID'];
  /** The API Client name */
  name: Scalars['String'];
  /** The scopes this API client has access to */
  scopes: Array<Scalars['String']>;
};

/** An API client for an Organization */
export type ApiClientForOrganization = ApiClient & {
  __typename?: 'ApiClientForOrganization';
  /** The API Client expiration date */
  expiration?: Maybe<Scalars['Date']>;
  /** The API Client ID */
  id: Scalars['ID'];
  /** The API Client name */
  name: Scalars['String'];
  /** The organization this API client is for */
  organization: Organization;
  /** The scopes this API client has access to */
  scopes: Array<Scalars['String']>;
};

/** An API client for a Partner */
export type ApiClientForPartner = ApiClient & {
  __typename?: 'ApiClientForPartner';
  /** The API Client expiration date */
  expiration?: Maybe<Scalars['Date']>;
  /** The API Client ID */
  id: Scalars['ID'];
  /** The API Client name */
  name: Scalars['String'];
  /** The partner this API client is for */
  partner: Partner;
  /** The scopes this API client has access to */
  scopes: Array<Scalars['String']>;
};

/** Article lecture */
export type ArticleLecture = Lecture & {
  __typename?: 'ArticleLecture';
  /** Id of the lecture */
  id: Scalars['ID'];
  /** Lecture title */
  title: Scalars['String'];
  /** The URL to access the lecture on the auto-enroll page */
  urlAutoEnroll: Scalars['URL'];
  /** Landing page to view this Lecture */
  urlLanding: Scalars['URL'];
};

/** The Assessment object. */
export type Assessment = LearningProduct & {
  __typename?: 'Assessment';
  /** ID of the assessment. */
  id: Scalars['ID'];
};

/** Issued Badge of a user (Assertion in OpenBadge specification) */
export type BadgeAssertion = {
  __typename?: 'BadgeAssertion';
  /** The BadgeClass object that this Assertion is issued for */
  badgeClass: BadgeClass;
  /** The date this assertion expires */
  expires?: Maybe<Scalars['Date']>;
  /** IRI of the Assertion. IRI of OpenBadge specification */
  externalUrl: Scalars['URL'];
  /** ID of the Assertion. */
  id: Scalars['ID'];
  /** The date this assertion is issued */
  issuedOn: Scalars['Date'];
  /** Owner of the assertion */
  user: User;
};

/** Issued badges of a user (Assertion in OpenBadge specification) */
export type BadgeAssertionPaged = Paginated & {
  __typename?: 'BadgeAssertionPaged';
  /** List of BadgeAssertions */
  items: Array<BadgeAssertion>;
  /** The current page number, 0 based */
  page: Scalars['Int'];
  /** The total amount of pages. Calculated as (total result count / page size) */
  pageCount: Scalars['Int'];
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
  /** User's assertions for the badge class */
  assertions: Array<BadgeAssertion>;
  /** Criteria document describing how to earn the BadgeClass (Certification) */
  criteria: BadgeClassCriteria;
  /** A short description of BadgeClass */
  description: Scalars['String'];
  /** User's enrollments for the badge class */
  enrollments: Array<BadgeClassEnrollment>;
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
  /** Topic of badge class. Can be null for badge classes uploaded by users */
  topic?: Maybe<Topic>;
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

/** Enrolled learning products for a badge class */
export type BadgeClassEnrollment = {
  __typename?: 'BadgeClassEnrollment';
  /** Completion percentage for the learning product */
  completionPercentage: Scalars['NonNegativeFloat'];
  /** Learning Product */
  learningProduct: LearningProduct;
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
  Subtitle = 'SUBTITLE'
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
  /** The title of the coding exercise */
  title: Scalars['String'];
  /** Landing page to view this CodingExercise */
  urlLanding: Scalars['URL'];
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
  Swift_5 = 'SWIFT_5'
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
  /** Organization specific course properties, only visible if you are part of that organization */
  organizationInfo?: Maybe<CourseOrganizationInfo>;
  /** Prerequisites for taking the course */
  prerequisites: Array<Scalars['String']>;
  /** Whether the course is publicly available or not */
  private?: Maybe<Scalars['Boolean']>;
  /** Promotional video for the course. Clients need to renew it if URL expires by querying it again. */
  promoVideo?: Maybe<CoursePromoVideo>;
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
  Cpe = 'CPE'
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

/** Organization specific course properties */
export type CourseOrganizationInfo = {
  __typename?: 'CourseOrganizationInfo';
  /** True if this course was purchased separately from the marketplace */
  isMarketplaceImported?: Maybe<Scalars['Boolean']>;
  /** True if this course was created specifically for this organization */
  isOrganizationSpecific?: Maybe<Scalars['Boolean']>;
  /** If not null returns the Date this course will retire from organization's content collection */
  retireOn?: Maybe<Scalars['Date']>;
};

/** Object to store URL and expiration time for course's promo video */
export type CoursePromoVideo = {
  __typename?: 'CoursePromoVideo';
  /** Expiration time of the promo video URL. If null URL doesn't expire */
  expiration?: Maybe<Scalars['TimeStamp']>;
  /** URL for a promo video asset in mp4 format */
  url: Scalars['URL'];
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
  Time = 'TIME'
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

/** Input for creating an API client */
export type CreateApiClientRequestInput = {
  /** The API Client name */
  name: Scalars['String'];
  /** The scopes this API client has access to */
  scopes: Array<Scalars['String']>;
};

/** Response from creating an API client containing ApiClient info and client's secret */
export type CreateApiClientResponse = {
  __typename?: 'CreateApiClientResponse';
  /** The created API Client */
  apiClient: ApiClient;
  /** Client Secret for the created API Client */
  clientSecret: Scalars['String'];
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
  Zar = 'ZAR'
}

/** Curriculum part of a course */
export type Curriculum = {
  __typename?: 'Curriculum';
  /** Each course section containing the course curriculum content */
  sections: Array<CourseSection>;
};

/** All curriculum items */
export type CurriculumItem = ArticleLecture | CodingExercise | PracticeAssignment | PracticeTest | Quiz | VideoLecture | VideoMashupLecture;

/** Price option for computed price plan. Will be returned for daily plans */
export type DailySubscriptionPlanPricingOption = {
  __typename?: 'DailySubscriptionPlanPricingOption';
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
  Year = 'YEAR'
}

/** Paginated list of supply gap opportunities */
export type DeprecatedSupplyGapOpportunitiesResponse = Paginated & {
  __typename?: 'DeprecatedSupplyGapOpportunitiesResponse';
  /** List of supply gap opportunities */
  items: Array<DeprecatedSupplyGapOpportunity>;
  /** The current page number, 0 based */
  page: Scalars['Int'];
  /** The total amount of pages. Calculated as (total result count / page size) */
  pageCount: Scalars['Int'];
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
  courseLanguage: Scalars['String'];
  /**
   * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
   * The display rule for the opportunity
   */
  displayRule?: Maybe<DeprecatedSupplyGapOpportunityDisplayRule>;
  /**
   * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
   * The domain of the course for which the opportunity is being generated
   */
  domain: Scalars['String'];
  /** The unique identifier for the opportunity */
  id: Scalars['ID'];
  /** The intended audience of the opportunity */
  intendedAudience?: Maybe<Scalars['String']>;
  /** Whether the opportunity is eligible for financial incentives */
  isFinancialIncentiveEligible: Scalars['Boolean'];
  /** The key content of the opportunity */
  keyContent?: Maybe<Scalars['String']>;
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
  subject: Scalars['String'];
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
  NoLongerAPriority = 'NO_LONGER_A_PRIORITY'
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
  courseLanguages?: InputMaybe<Array<Scalars['String']>>;
  /**
   * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
   * Include opportunities for the given display rules
   */
  displayRules?: InputMaybe<Array<DeprecatedSupplyGapOpportunityDisplayRule>>;
  /**
   * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
   * Include opportunities for the given domains
   */
  domains?: InputMaybe<Array<Scalars['String']>>;
  /** Include opportunities for the given intended audiences */
  intendedAudiences?: InputMaybe<Array<Scalars['String']>>;
  /** Include opportunities that are eligible for financial incentives */
  isFinancialIncentiveEligible?: InputMaybe<Scalars['Boolean']>;
  /** Include opportunities for the given key contents */
  keyContents?: InputMaybe<Array<Scalars['String']>>;
  /**
   * Deprecated: This will be revisited after MVP is shipped. Discussion: https://github.com/udemy/api-platform-graphql/issues/901
   * Include opportunities for the given mx category references.
   * mxCategoryReferences is used to filter opportunities whose domains (UB categories)
   * are mapped to the given mx_category_references.
   * Please note that in requests, either domains or mx_category_references should be used, but not both.
   */
  mxCategoryReferences?: InputMaybe<Array<Scalars['String']>>;
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
  subjects?: InputMaybe<Array<Scalars['String']>>;
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
  Intermediate = 'INTERMEDIATE'
}

/** Priority level of the supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityPriorityLevel {
  /** High priority */
  High = 'HIGH',
  /** Low priority */
  Low = 'LOW',
  /** Medium priority */
  Medium = 'MEDIUM'
}

/** The type of supply gap opportunity */
export enum DeprecatedSupplyGapOpportunityType {
  /** First mover opportunity */
  FirstMover = 'FIRST_MOVER',
  /** Specialized opportunity */
  Specialized = 'SPECIALIZED',
  /** Trending opportunity */
  Trending = 'TRENDING'
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
  Intermediate = 'INTERMEDIATE'
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
export type Lab = LearningProduct & {
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
  Zu = 'ZU'
}

/** The Learning Community */
export type LearningCommunity = {
  __typename?: 'LearningCommunity';
  /** The reason for creating the learning community */
  creationReason: LearningCommunityCreateReason;
  /** The learning community description */
  description?: Maybe<Scalars['String']>;
  /** The learning community ID. */
  id: Scalars['UUID'];
  /** The members to the learning community, owner/creator is included here too */
  members: Array<User>;
  /** The number of members in the learning community */
  numberOfMembers: Scalars['Int'];
  /** The organization in which the learning community is created */
  organizationId: Scalars['ID'];
  /** The owner/creator of the learning community */
  owner: User;
  /** The learning community title */
  title: Scalars['String'];
  /** The topics selected for the learning community, should not be empty */
  topics: Array<Topic>;
};

/** A page of Learning Community Activities */
export type LearningCommunityActivitiesPaged = {
  __typename?: 'LearningCommunityActivitiesPaged';
  /** The cursor to the next Learning Community Activities Page */
  cursor?: Maybe<Scalars['String']>;
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
export type LearningCommunityActivityEvent = LearningProductEvent;

/** The input used for Adding new members to the learning community */
export type LearningCommunityAddMembersInput = {
  /** The invitation used to send to new members */
  invitation: LearningCommunityInviteInput;
  /** New member's ID to be added to the learning community, can not be empty */
  userIds: Array<Scalars['ID']>;
};

/** The Reason for creating a new Learning Community */
export type LearningCommunityCreateReason = {
  __typename?: 'LearningCommunityCreateReason';
  /** If type is equal to OTHER you have to provide a text for Reason */
  text?: Maybe<Scalars['String']>;
  /** The Reason for creating the learning community */
  type: LearningCommunityCreateReasonType;
};

/** The Reason for creating a new Learning Community */
export type LearningCommunityCreateReasonInput = {
  /** If type is equal to OTHER, you have to provide a text for Reason. */
  text?: InputMaybe<Scalars['String']>;
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
  StudyForACertificate = 'STUDY_FOR_A_CERTIFICATE'
}

/** The input used for creating a new Learning Community */
export type LearningCommunityInput = {
  /** The reason for creating the learning community */
  creationReason: LearningCommunityCreateReasonInput;
  /** The learning community description */
  description?: InputMaybe<Scalars['String']>;
  /** The learning community title */
  title: Scalars['String'];
  /** The topics selected for the learning community, can not be empty */
  topicIds: Array<Scalars['ID']>;
};

/** The input used for inviting new members to the learning community */
export type LearningCommunityInviteInput = {
  /** Invitation language */
  language: LanguageCode;
  /** Invitation Message */
  message: Scalars['String'];
};

/** The input used for Removing members to the learning community */
export type LearningCommunityRemoveMembersInput = {
  /** Old members ID to be removed from the learning community, can not be empty */
  userIds: Array<Scalars['ID']>;
};

/** The learning path object. */
export type LearningPath = {
  /** Description of the learning path. */
  description?: Maybe<Scalars['String']>;
  /** ID of the learning path. */
  id: Scalars['ID'];
  /** Number of items in the learning path. */
  itemCount: Scalars['Int'];
  /** Total No of enrollments for the learning path. */
  numberOfEnrollments: Scalars['Int'];
  /** Title of the learning path. */
  title: Scalars['String'];
};

/** All partner's content collection items that are available, currently just course */
export type LearningProduct = {
  /** ID of the learning product */
  id: Scalars['ID'];
};

/** An event happening to a learning product in a moment in time */
export type LearningProductEvent = {
  __typename?: 'LearningProductEvent';
  /** The moment in time which the event happened */
  dateTime: Scalars['DateTime'];
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
  Started = 'STARTED'
}

/** Input for getting badge classes by learning products */
export type LearningProductInput = {
  /** ID of the learning product */
  id: Scalars['ID'];
  /** Type of the learning product */
  type: LearningProductType;
  /** Version ID of the learning product */
  versionId?: InputMaybe<Scalars['String']>;
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
  LearningPath = 'LEARNING_PATH'
}

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

/** The LearningReminder object. */
export type LearningReminder = {
  __typename?: 'LearningReminder';
  /** Calendar Type for the learning reminder */
  calendarType?: Maybe<LearningReminderCalendarType>;
  /** Duration of the learning event. */
  durationInMinutes?: Maybe<Scalars['DurationInMinutes']>;
  /** End date of the recurring learning reminders. */
  endDate: Scalars['DateTime'];
  /** ID of the learning reminder. */
  id: Scalars['ID'];
  /** Learning product of the learning reminder. */
  learningProduct?: Maybe<LearningProduct>;
  /** The recurrence rule for the reminder */
  recurrencePattern?: Maybe<Scalars['RRuleString']>;
  /** Delivery method for the learning reminder */
  reminderMethod: LearningReminderNotificationMethod;
  /** When to show the reminder, expressed as minutes before the learning reminder start time */
  reminderMinutesBefore: Scalars['Int'];
  /** Start date of the first recurring learning reminder. */
  startDate: Scalars['DateTime'];
  /** Title of the learning reminder. */
  title: Scalars['String'];
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
  Outlook = 'OUTLOOK'
}

/** Input for creating and updating a learning reminder */
export type LearningReminderInput = {
  /** Calendar Type for the learning reminder */
  calendarType?: InputMaybe<LearningReminderCalendarType>;
  /** Duration of the learning event. */
  duration?: InputMaybe<Scalars['DurationInMinutes']>;
  /** End date of the recurring learning reminders. */
  endDate: Scalars['DateTime'];
  /** Learning product of the learning reminder. */
  learningProduct?: InputMaybe<LearningReminderLearningProductInput>;
  /** The recurrence rule for the reminder */
  recurrencePattern?: InputMaybe<Scalars['RRuleString']>;
  /** Delivery method for the learning reminder */
  reminderMethod: LearningReminderNotificationMethod;
  /** When to show the reminder, expressed as minutes before the learning reminder start time */
  reminderMinutesBefore: Scalars['Int'];
  /** Start date of the first recurring learning reminder. */
  startDate: Scalars['DateTime'];
  /** Title of the learning reminder. */
  title: Scalars['String'];
};

/** Input for learning product of the learning reminder */
export type LearningReminderLearningProductInput = {
  /** ID of the learning product. */
  id: Scalars['ID'];
  /** ID of the learning product. */
  type: Scalars['String'];
};

/** Notification method of the learning reminder */
export enum LearningReminderNotificationMethod {
  /** Email Reminder Method */
  Email = 'EMAIL',
  /** Push Reminder Method */
  Push = 'PUSH'
}

/** Paginated learning reminders of the user */
export type LearningRemindersPaged = Paginated & {
  __typename?: 'LearningRemindersPaged';
  /** Learning reminders of the user */
  items: Array<LearningReminder>;
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
  /** The URL to access the lecture on the auto-enroll page */
  urlAutoEnroll: Scalars['URL'];
  /** Landing page to view this Lecture */
  urlLanding: Scalars['URL'];
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
  lectureExperimentVariant: Scalars['String'];
  /** Indicates whether lab unit should be shown */
  showLabUnit: Scalars['Boolean'];
  /** Indicates whether lecture discovery unit is shown */
  showLectureDiscoveryUnit: Scalars['Boolean'];
  /** Search analytics tracking id; for uniquely identifying this query and result set; for this request */
  trackingId: Scalars['String'];
};

/** Identifies each result for lecture search. */
export type LectureSearchResult = {
  __typename?: 'LectureSearchResult';
  /** Containing course of the found lecture. */
  course: Course;
  /** Found lecture for lecture search request. */
  lecture: Lecture;
  /** Unique analytics ID for the found lecture. */
  trackingId?: Maybe<Scalars['String']>;
};

/** License pool */
export type LicensePool = {
  __typename?: 'LicensePool';
  /** The License pool unique identifier */
  id: Scalars['ID'];
  /** True if it is a default pool */
  isDefault: Scalars['Boolean'];
  /** Set of license counts assigned to this license pool */
  licenseCounts: Array<LicensePoolProductTypeCount>;
  /** Pool name */
  name: Scalars['String'];
  /** The organization this pool is assigned to */
  organization: Organization;
};

/** Product type license count */
export type LicensePoolProductTypeCount = {
  __typename?: 'LicensePoolProductTypeCount';
  /** The product type license count unique identifier */
  id: Scalars['ID'];
  /** The current max license count */
  maxLicenseCount: Scalars['Int'];
  /** The product type this license count is assigned to */
  productType: SubscriptionPlanProductType;
  /** The current used license count for this license count */
  usedLicenseCount: Scalars['Int'];
};

/** Money */
export type Money = {
  __typename?: 'Money';
  /** Amount */
  amount?: Maybe<Scalars['Decimal']>;
  /** Currency */
  currency?: Maybe<CurrencyCode>;
};

/** Price option for computed price plan. Will be returned for monthly plans */
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
  /** Create an API client for an organization or partner */
  apiClientCreate: CreateApiClientResponse;
  /** Delete an API client for an organization or partner, returns the deleted API Client ID */
  apiClientDelete?: Maybe<Scalars['ID']>;
  /** Delete assertion of current user with given id */
  badgeAssertionDelete?: Maybe<Scalars['ID']>;
  /** Storing assertion (which is given as external url) for current user */
  badgeAssertionStoreByUrl?: Maybe<BadgeAssertion>;
  /** Add members to a Learning Community */
  learningCommunityAddMembers?: Maybe<Scalars['Boolean']>;
  /** Create a new Learning Community. */
  learningCommunityCreate?: Maybe<LearningCommunity>;
  /** Delete an existing Learning Community by ID. */
  learningCommunityDelete?: Maybe<Scalars['Boolean']>;
  /** Remove members from a Learning Community */
  learningCommunityRemoveMembers?: Maybe<Scalars['Boolean']>;
  /** Create a learning reminder */
  learningReminderCreate: LearningReminder;
  /** Delete the learning reminder */
  learningReminderDelete: Scalars['Boolean'];
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
  clientId: Scalars['ID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationBadgeAssertionDeleteArgs = {
  id: Scalars['ID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationBadgeAssertionStoreByUrlArgs = {
  externalUrl: Scalars['URL'];
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityAddMembersArgs = {
  id: Scalars['UUID'];
  input: LearningCommunityAddMembersInput;
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityCreateArgs = {
  learningCommunity: LearningCommunityInput;
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityDeleteArgs = {
  id: Scalars['UUID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningCommunityRemoveMembersArgs = {
  id: Scalars['UUID'];
  input: LearningCommunityRemoveMembersInput;
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderCreateArgs = {
  learningReminder: LearningReminderInput;
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderDeleteArgs = {
  learningReminderId: Scalars['ID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationLearningReminderUpdateArgs = {
  learningReminder: LearningReminderInput;
  learningReminderId: Scalars['ID'];
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
  isManager: Scalars['Boolean'];
};


/** Root mutation from which every mutation schema extends */
export type MutationOccupationRawAssignArgs = {
  requestOccupationAssignment?: InputMaybe<OccupationRawAssignmentInput>;
};


/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentCancelArgs = {
  id: Scalars['ID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationSubscriptionEnrollmentReactivateArgs = {
  id: Scalars['ID'];
};


/** Root mutation from which every mutation schema extends */
export type MutationTopicInterestAssignArgs = {
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
};


/** Root mutation from which every mutation schema extends */
export type MutationTopicInterestUnassignArgs = {
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Details of Occupation */
export type Occupation = {
  __typename?: 'Occupation';
  /** UD of the occupation instance */
  id: Scalars['ID'];
  /** Name of the occupation */
  name: Scalars['String'];
  /** Representative Topic */
  representativeTopic?: Maybe<Topic>;
  /** URL of the landing page, can be null if no landing page such as OLP exists */
  urlLandingPage?: Maybe<Scalars['URL']>;
};

/** User is assigning occupation to themself */
export type OccupationAssignmentInput = {
  /** ID of the occupation */
  occupationId: Scalars['ID'];
};

/** Occupation group type */
export type OccupationGroup = {
  __typename?: 'OccupationGroup';
  /** ID of the occupation group */
  id: Scalars['ID'];
  /** Name of the occupation group */
  name: Scalars['String'];
};

/** Current user assigning existing occupation group. */
export type OccupationGroupAssignmentInput = {
  /** ID of the occupation group */
  occupationGroupId: Scalars['ID'];
};

/** Shows page search results of occupation */
export type OccupationPaged = Paginated & {
  __typename?: 'OccupationPaged';
  /** Occupation groups. Items may be less than requested size if objects become unavailable */
  items: Array<Occupation>;
  /** The current page number, 0 based */
  page: Scalars['Int'];
  /** The total amount of pages. Calculated as (total result count / page size) */
  pageCount: Scalars['Int'];
};

/** Current user assigning user provided occupation. */
export type OccupationRawAssignmentInput = {
  /** Raw user provided string to represent the current user's occupation. */
  userProvidedOccupation: Scalars['String'];
};

/** A UB organization */
export type Organization = {
  __typename?: 'Organization';
  /** The UB organization's unique identifier */
  id: Scalars['ID'];
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
  Inactive = 'INACTIVE'
}

/** Object that describes the type of license assigned to a user in an organization */
export enum OrganizationUserLicenseType {
  /** Default Enterprise and Team Plan license Type */
  Basic = 'BASIC',
  /** UB Pro license Type */
  Pro = 'PRO'
}

/** Interface for implementing paginated results */
export type Paginated = {
  /** The current page number, 0 based */
  page: Scalars['Int'];
  /** The total amount of pages. Calculated as (total result count / page size) */
  pageCount: Scalars['Int'];
};

/** A Partner */
export type Partner = {
  __typename?: 'Partner';
  /** The partner's unique identifier */
  id: Scalars['ID'];
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
  /** Landing page to view this PracticeAssignment */
  urlLanding: Scalars['URL'];
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
  /** Landing page to view this PracticeTest */
  urlLanding: Scalars['URL'];
};

/** The Pro learning path object. */
export type ProLearningPath = LearningPath & LearningProduct & {
  __typename?: 'ProLearningPath';
  /** Description of the learning path. */
  description?: Maybe<Scalars['String']>;
  /** ID of the learning path. */
  id: Scalars['ID'];
  /** Number of items in the learning path. */
  itemCount: Scalars['Int'];
  /** Total No of enrollments for the learning path. */
  numberOfEnrollments: Scalars['Int'];
  /** Title of the learning path. */
  title: Scalars['String'];
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
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryBadgeAssertionArgs = {
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryBadgeAssertionsArgs = {
  ids: Array<Scalars['ID']>;
};


/** Root query from which every query schema extends */
export type QueryBadgeAssertionsByUserArgs = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  userId: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryBadgeAssertionsImportedArgs = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
};


/** Root query from which every query schema extends */
export type QueryBadgeClassArgs = {
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryBadgeClassEnrollmentsByBadgeClassIdArgs = {
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryBadgeClassesByLearningProductsArgs = {
  learningProducts: Array<LearningProductInput>;
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
export type QueryDeprecatedSupplyGapOpportunitiesArgs = {
  filters?: InputMaybe<DeprecatedSupplyGapOpportunityFilters>;
  page?: Scalars['Int'];
  size?: Scalars['Int'];
};


/** Root query from which every query schema extends */
export type QueryDeprecatedSupplyGapOpportunityArgs = {
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryFeatureVariantAssignmentsByCodeAndAttributesArgs = {
  featureCodes: Array<Scalars['String']>;
  realtimeAttributes?: InputMaybe<Array<FeatureRequestAttributeInput>>;
};


/** Root query from which every query schema extends */
export type QueryFeaturedReviewsByTopicArgs = {
  topicIds: Array<Scalars['ID']>;
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
export type QueryLearningCommunitiesArgs = {
  ids?: InputMaybe<Array<Scalars['UUID']>>;
};


/** Root query from which every query schema extends */
export type QueryLearningCommunityActivitiesArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  limit: Scalars['Int'];
};


/** Root query from which every query schema extends */
export type QueryLearningProductByPageArgs = {
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['MaxResultsPerPage']>;
};


/** Root query from which every query schema extends */
export type QueryLearningReminderArgs = {
  id: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryLearningRemindersArgs = {
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['MaxResultsPerPage']>;
};


/** Root query from which every query schema extends */
export type QueryOccupationGroupsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


/** Root query from which every query schema extends */
export type QueryOccupationSearchArgs = {
  groupIds?: InputMaybe<Array<Scalars['ID']>>;
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
  search?: InputMaybe<Scalars['String']>;
};


/** Root query from which every query schema extends */
export type QueryOccupationsArgs = {
  ids: Array<Scalars['ID']>;
};


/** Root query from which every query schema extends */
export type QueryOrganizationUserLicensesAssignedByTypeAndStatusArgs = {
  status?: InputMaybe<OrganizationUserLicenseStatus>;
  type?: InputMaybe<OrganizationUserLicenseType>;
};


/** Root query from which every query schema extends */
export type QueryPopularTopicsArgs = {
  categoryId: Scalars['ID'];
};


/** Root query from which every query schema extends */
export type QueryProLearningPathsByTopicArgs = {
  topicId: Scalars['ID'];
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
export type QuerySearchLecturesArgs = {
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


/** Root query from which every query schema extends */
export type QueryTopicGroupsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


/** Root query from which every query schema extends */
export type QueryTopicSearchArgs = {
  filters?: InputMaybe<TopicFilters>;
  limit: Scalars['PositiveInt'];
  query?: InputMaybe<Scalars['String']>;
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
  /** Landing page to view this Quiz */
  urlLanding: Scalars['URL'];
};

/** A review of a learning product */
export type Review = {
  __typename?: 'Review';
  /** The type of learning product being reviewed */
  learningProductType: LearningProductType;
  /** The review text */
  text: Scalars['String'];
  /** The URL of the reviewed learning product */
  urlLearningProduct: Scalars['URL'];
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
  ZeroHistory = 'ZERO_HISTORY'
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

/** Billing details of a subscription */
export type SubscriptionBilling = {
  __typename?: 'SubscriptionBilling';
  /** Total recurring amount for the subscription including tax */
  chargePrice: Money;
  /** End date of the current billing period */
  currentPeriodEndDate: Scalars['DateTime'];
  /** Start date of the current billing period */
  currentPeriodStartDate: Scalars['DateTime'];
  /** Payment method used for the subscription */
  paymentMethod: SubscriptionPaymentMethod;
  /** Tax amount for the subscription */
  taxPrice: Money;
};

/** Credit card used for the subscription */
export type SubscriptionCreditCard = {
  __typename?: 'SubscriptionCreditCard';
  /** Last 4 digits of the card number */
  last4Digits: Scalars['String'];
  /** Card provider (visa, mc, amex, etc.) */
  provider: Scalars['String'];
};

/** Subscription object that represents consumer and UB subscriptions */
export type SubscriptionEnrollment = {
  __typename?: 'SubscriptionEnrollment';
  /** Billing information for the subscription with recurring payment support */
  billing?: Maybe<SubscriptionBilling>;
  /** Date when the subscription was canceled */
  cancelDate?: Maybe<Scalars['DateTime']>;
  /** Reference key to Recurring Billing System */
  checkoutReference?: Maybe<Scalars['String']>;
  /** End date of the subscription */
  endDate?: Maybe<Scalars['DateTime']>;
  /** Id of the subscription */
  id: Scalars['ID'];
  /** Max number of licenses (seats) for the subscription */
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
  /** Number of licenses (seats) in use */
  usedLicenseCount: Scalars['Int'];
};

/** Payment method of the subscription */
export type SubscriptionPaymentMethod = SubscriptionCreditCard;

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
export type SubscriptionPlanPricingOptionItem = AnnualSubscriptionPlanPricingOption | DailySubscriptionPlanPricingOption | MonthlySubscriptionPlanPricingOption | WeeklySubscriptionPlanPricingOption;

/** The type of subscription plan being offered */
export enum SubscriptionPlanProductType {
  /** Consumer subscription (previously Spadefish) */
  Consumersubscription = 'CONSUMERSUBSCRIPTION',
  /** Enterprise Plan */
  Enterprise = 'ENTERPRISE',
  /** Team Plan */
  Team = 'TEAM',
  /** Udemy Pro */
  Udemypro = 'UDEMYPRO'
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
  Trial = 'TRIAL'
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
  id: Scalars['ID'];
  /** Title of topic (Python, Programming Languages) */
  name: Scalars['String'];
  /** A collection of question and answer pairs with optional link for additional context */
  questionsAndAnswers: Array<TopicQuestionAndAnswer>;
  /** Web url of the topic page */
  url: Scalars['URL'];
};

/** Topic Filters for searching topics. All filters are ANDed together. */
export type TopicFilters = {
  /** Include topics associated with these topic ids */
  associatedWithTopicIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Exclude topic group IDs */
  excludeTopicGroupIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Include topic group IDs */
  includeTopicGroupIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Include topics related to occupation group IDs */
  occupationGroupIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Include topics related to occupation IDs */
  occupationIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Topic Group */
export type TopicGroup = {
  __typename?: 'TopicGroup';
  /** ID of topic group */
  id: Scalars['ID'];
  /** Name of topic group */
  name: Scalars['String'];
};

/** Types of popularity for Topics */
export enum TopicPopularityTypes {
  /** Popular popularity type */
  Popular = 'POPULAR',
  /** Trending popularity type */
  Trending = 'TRENDING'
}

/** A question and answer pair with optional link for additional context */
export type TopicQuestionAndAnswer = {
  __typename?: 'TopicQuestionAndAnswer';
  /** The answer text */
  answer: Scalars['String'];
  /** ID of the question and answer */
  id: Scalars['ID'];
  /** Text to display for the link to additional information about the question and answer */
  linkText?: Maybe<Scalars['String']>;
  /** The question text */
  question: Scalars['String'];
  /** The URL for additional information about the question and answer */
  urlReadMore?: Maybe<Scalars['URL']>;
};

/** A Udemy user */
export type User = {
  __typename?: 'User';
  /** Id of the user */
  id: Scalars['ID'];
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
  isManager?: Maybe<Scalars['Boolean']>;
  /** User's raw input occupation */
  raw?: Maybe<Occupation>;
};

/** Represents the basic information of a user */
export type UserProfile = {
  __typename?: 'UserProfile';
  /** Email of the user */
  email: Scalars['EmailAddress'];
  /** User avatar in different sizes */
  images: UserProfileImages;
  /** Name of the user */
  name: Scalars['String'];
  /** Surname of the user */
  surname: Scalars['String'];
};

/** Represents different sizes of the same image */
export type UserProfileImages = {
  __typename?: 'UserProfileImages';
  /** User profile image size 125h */
  height125: Scalars['URL'];
  /** User profile image size 200h */
  height200: Scalars['URL'];
  /** User profile image size 50x50 */
  px50x50: Scalars['URL'];
  /** User profile image size 75x75 */
  px75x75: Scalars['URL'];
  /** User profile image size 100x100 */
  px100x100: Scalars['URL'];
};

/** Video lecture */
export type VideoLecture = Lecture & {
  __typename?: 'VideoLecture';
  /** Id of the video lecture */
  id: Scalars['ID'];
  /** Lecture title */
  title: Scalars['String'];
  /** The URL to access the lecture on the auto-enroll page */
  urlAutoEnroll: Scalars['URL'];
  /** Landing page to view this Lecture */
  urlLanding: Scalars['URL'];
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
  Short = 'SHORT'
}

/** Mashup lecture has both video and a presentation */
export type VideoMashupLecture = Lecture & {
  __typename?: 'VideoMashupLecture';
  /** Id of the lecture */
  id: Scalars['ID'];
  /** Lecture title */
  title: Scalars['String'];
  /** The URL to access the lecture on the auto-enroll page */
  urlAutoEnroll: Scalars['URL'];
  /** Landing page to view this Lecture */
  urlLanding: Scalars['URL'];
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

/** Price option for computed price plan. Will be returned for weekly plans */
export type WeeklySubscriptionPlanPricingOption = {
  __typename?: 'WeeklySubscriptionPlanPricingOption';
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

export type FeatureVariantAssignmentsQueryVariables = Exact<{
  featureCodes: Array<Scalars['String']> | Scalars['String'];
  realtimeAttributes?: InputMaybe<Array<FeatureRequestAttributeInput> | FeatureRequestAttributeInput>;
}>;


export type FeatureVariantAssignmentsQuery = { __typename?: 'Query', featureVariantAssignmentsByCodeAndAttributes: Array<{ __typename?: 'FeatureVariantAssignment', featureCode: string, configuration?: any | null, isInExperiment?: boolean | null }> };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', courseCategory?: { __typename?: 'CourseCategory', id: string, name: string, url: any, subcategories: Array<{ __typename?: 'CourseSubCategory', id: string, name: string, url: any }> } | null };

export type GetTopicQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTopicQuery = { __typename?: 'Query', topic?: { __typename?: 'Topic', id: string, name: string, url: any } | null };


export const FeatureVariantAssignmentsDocument = `
    query FeatureVariantAssignments($featureCodes: [String!]!, $realtimeAttributes: [FeatureRequestAttributeInput!]) {
  featureVariantAssignmentsByCodeAndAttributes(
    featureCodes: $featureCodes
    realtimeAttributes: $realtimeAttributes
  ) {
    featureCode
    configuration
    isInExperiment
  }
}
    `;
export const useFeatureVariantAssignmentsQuery = <
      TData = FeatureVariantAssignmentsQuery,
      TError = unknown
    >(
      variables: FeatureVariantAssignmentsQueryVariables,
      options?: UseQueryOptions<FeatureVariantAssignmentsQuery, TError, TData>
    ) =>
    useQuery<FeatureVariantAssignmentsQuery, TError, TData>(
      ['FeatureVariantAssignments', variables],
      fetcher<FeatureVariantAssignmentsQuery, FeatureVariantAssignmentsQueryVariables>(FeatureVariantAssignmentsDocument, variables),
      options
    );

useFeatureVariantAssignmentsQuery.getKey = (variables: FeatureVariantAssignmentsQueryVariables) => ['FeatureVariantAssignments', variables];
;

useFeatureVariantAssignmentsQuery.fetcher = (variables: FeatureVariantAssignmentsQueryVariables, options?: RequestInit['headers']) => fetcher<FeatureVariantAssignmentsQuery, FeatureVariantAssignmentsQueryVariables>(FeatureVariantAssignmentsDocument, variables, options);
export const GetCategoryDocument = `
    query GetCategory($id: ID!) {
  courseCategory(id: $id) {
    id
    name
    url
    subcategories {
      id
      name
      url
    }
  }
}
    `;
export const useGetCategoryQuery = <
      TData = GetCategoryQuery,
      TError = unknown
    >(
      variables: GetCategoryQueryVariables,
      options?: UseQueryOptions<GetCategoryQuery, TError, TData>
    ) =>
    useQuery<GetCategoryQuery, TError, TData>(
      ['GetCategory', variables],
      fetcher<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, variables),
      options
    );

useGetCategoryQuery.getKey = (variables: GetCategoryQueryVariables) => ['GetCategory', variables];
;

useGetCategoryQuery.fetcher = (variables: GetCategoryQueryVariables, options?: RequestInit['headers']) => fetcher<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, variables, options);
export const GetTopicDocument = `
    query GetTopic($id: ID!) {
  topic(id: $id) {
    id
    name
    url
  }
}
    `;
export const useGetTopicQuery = <
      TData = GetTopicQuery,
      TError = unknown
    >(
      variables: GetTopicQueryVariables,
      options?: UseQueryOptions<GetTopicQuery, TError, TData>
    ) =>
    useQuery<GetTopicQuery, TError, TData>(
      ['GetTopic', variables],
      fetcher<GetTopicQuery, GetTopicQueryVariables>(GetTopicDocument, variables),
      options
    );

useGetTopicQuery.getKey = (variables: GetTopicQueryVariables) => ['GetTopic', variables];
;

useGetTopicQuery.fetcher = (variables: GetTopicQueryVariables, options?: RequestInit['headers']) => fetcher<GetTopicQuery, GetTopicQueryVariables>(GetTopicDocument, variables, options);