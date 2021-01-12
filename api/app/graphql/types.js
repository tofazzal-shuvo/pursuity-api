import { gql } from "apollo-server";

export const typeDefs = gql`
  directive @isAdmin on FIELD_DEFINITION
  directive @isStudent on FIELD_DEFINITION
  directive @isTutor on FIELD_DEFINITION
  directive @isAuthenticated on FIELD_DEFINITION

  ################# GENERIC #####################
  type DefaultResponse {
    code: String
    success: Boolean
    message: String
  }
  type SingleFile {
    filename: String
    filesize: String
    mimetype: String
    success: Boolean
    imageLink: String
  }
  ###################### ADMIN TYPES ######################
  # input AdminProfileUpdateInput {
  #   firstname: String
  #   lastname: String
  #   avater: String
  # }
  # type AddUserByAdminResponse {
  #   code: String
  #   success: Boolean
  #   message: String
  #   id: String
  # }
  ###################### USER TYPES ######################
  enum TutorLavelEnum {
    Any
    Elementary
    Middle_School
    High_School
    College
    Adult
  }
  enum Days {
    Sunday
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
  }
  enum Time {
    am8
    am9
    am10
    am11
    pm12
    pm1
    pm2
    pm3
    pm4
    pm5
    pm6
    pm7
    pm8
  }
  enum UserRole {
    Student
    Tutor
  }
  enum GenderEnum {
    Male
    Female
    Others
  }
  enum UserStatus {
    Active
    Blocked
  }
  enum TutorOfferStatus {
    Active
    Paused
  }
  type Student {
    _id: ID
    schoolName: String
    subject: String
    user: User
  }
  type Availability {
    day: Days
    time: [Time]
  }
  input AvailabilityUpdateInput {
    day: Days
    time: [Time]
  }
  input TutorOfferInput {
    title: String
    description: String
    hourlyRate: Float
    subject: ID
    image: String
    status: TutorOfferStatus
  }
  type TutorOffer {
    _id: ID
    title: String
    description: String
    image: String
    hourlyRate: Float
    subject: Subcategory
    tutor: Tutor
  }
  type Tutor {
    _id: ID
    bio: String
    title: String
    graduateInstituteName: String
    graduateSubject: String
    postInstituteName: String
    postSubject: String
    hourlyRate: Float
    rateAverage: Float
    rateCount: Int
    sucessTutoring: Int
    tutorLevel: TutorLavelEnum
    subjectsForTutor: [Subcategory]
    availability: [Availability]
    isFlaxible: Boolean
    offers: [TutorOffer]
    user: User
  }
  type User {
    _id: ID
    firstname: String
    lastname: String
    avater: String
    email: String
    role: String
    status: UserStatus
    phone: String
    zipCode: String
    age: Int
    gender: GenderEnum
    timeZone: String
    isScocialPrivider: Boolean
    isEmailVarified: Boolean
    student: Student
    tutor: Tutor
  }
  input UserProfileUpdateInput {
    #common
    firstname: String
    lastname: String
    avater: String
    phone: String
    zipCode: String
    age: Int
    gender: GenderEnum
    timeZone: String
    # tutor
    bio: String
    title: String
    hourlyRate: Float
    graduateInstituteName: String
    graduateSubject: String
    postInstituteName: String
    postSubject: String
    tutorLevel: TutorLavelEnum
    subjectsForTutor: [ID]
    #studen
    schoolName: String
    subject: String
  }
  input RegistrationInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    zipCode: String!
    role: UserRole!
  }
  type FetchCurrentUserResponse {
    code: String
    user: User
    message: String
    success: Boolean
  }
  type UserLoginResponse {
    code: String
    success: Boolean
    message: String
    user: User
    token: String
  }
  ################# ADMIN ###############
  enum AdminRole {
    SuperAdmin
    Admin
  }
  type Admin {
    firstname: String
    lastname: String
    email: String
    role: AdminRole
  }
  input AdminRegistrationInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    role: AdminRole
  }
  type AdminLoginResponse {
    code: String
    success: Boolean
    message: String
    user: Admin
    token: String
  }
  type Subcategory {
    _id: ID
    name: String
    category: Category
  }
  type Category {
    _id: ID
    name: String
    subcategory: [Subcategory]
  }
  type FetchSubjectsResponse {
    code: String
    count: Int
    message: String
    success: Boolean
    result: [Category]
  }
  input TutorFilterInput {
    tutorLevel: TutorLavelEnum
    gender: GenderEnum
    day: [Days]
    maxAge: Int
    minAge: Int
    maxHourlyRate: Int
    minHourlyRate: Int
    subject: String
  }
  type FetchTutorResponse {
    code: String
    count: Int
    message: String
    success: Boolean
    result: [Tutor]
  }

  type FetchTutorLessonResponse {
    code: String
    count: Int
    message: String
    success: Boolean
    result: [TutorOffer]
  }

  # type Subscription {
  ###################### Subscription
  # NewPaymentReq(shopperId: ID): Order
  # }
  type Query {
    ##################### USER QUERY
    FetchUserById(id: ID): FetchCurrentUserResponse @isAuthenticated
    FetchTutor(
      filter: TutorFilterInput
      limit: Int
      offset: Int
    ): FetchTutorResponse @isAuthenticated
    FetchTutorLesson: FetchTutorLessonResponse @isTutor
    ##################### CATEGORY & SUBCATEGORY QUERY
    FetchSubjectsForAdmin(limit: Int, offset: Int): FetchSubjectsResponse
      @isAdmin
    FetchSubjectsForUser(limit: Int, offset: Int): FetchSubjectsResponse
      @isAuthenticated
      # bochachoda
  }
  type Mutation {
    ###################### GENERIC MUTATION
    SingleUpload(file: Upload!): SingleFile!
    ###################### USER MUTATION
    GoogleSignIn(token: String, role: UserRole): UserLoginResponse
    FacebookSignIn(token: String, role: UserRole): UserLoginResponse
    Login(email: String!, password: String!): UserLoginResponse
    Register(userInput: RegistrationInput): DefaultResponse
    ForgetPassword(email: String!): DefaultResponse
    ResendVerifyEmail(email: String!): DefaultResponse
    ResetPassowrd(securityCode: String!, newPassword: String!): DefaultResponse
    VerifyEmail(securityCode: String!): DefaultResponse
    PassowrdUpdate(oldPassword: String!, newPassword: String!): DefaultResponse
      @isAuthenticated
    ProfileUpdate(profileData: UserProfileUpdateInput): DefaultResponse
      @isAuthenticated
    AvailabilityUpdate(
      availability: [AvailabilityUpdateInput]
      isFlaxible: Boolean
    ): DefaultResponse @isTutor
    ChangeEmail(newEmail: String, password: String): DefaultResponse
      @isAuthenticated
    ConfirmChangeEmail(securityCode: String!): DefaultResponse
    ###################### ADMIN MUTATION
    AdminLogin(email: String!, password: String!): AdminLoginResponse
    AdminRegister(userInput: AdminRegistrationInput): DefaultResponse
    AdminForgetPassword(email: String!): DefaultResponse
    AdminResetPassowrd(
      securityCode: String!
      newPassword: String!
    ): DefaultResponse
    # AdminResendVerifyEmail(email: String!): DefaultResponse
    # AdminVerifyEmail(securityCode: String!): DefaultResponse
    # AdminPassowrdUpdate(
    #   oldPassword: String!
    #   newPassword: String!
    # ): DefaultResponse @isAdmin
    # AdminProfileUpdate(profileData: AdminProfileUpdateInput): DefaultResponse
    #   @isAdmin
    ##############  CATEGORY MUTATION
    AddCategory(name: String!): DefaultResponse @isAdmin
    EditCategory(categoryId: ID!, name: String!): DefaultResponse @isAdmin
    DeleteCategory(categoryId: ID!): DefaultResponse @isAdmin
    ##############  SUBCATEGORY MUTATION
    AddSubcategory(categoryId: ID!, name: String!): DefaultResponse @isAdmin
    EditSubcategory(subcategoryId: ID!, name: String!): DefaultResponse @isAdmin
    DeleteSubcategory(subcategoryId: ID!): DefaultResponse @isAdmin
    DeleteSubcategoryFromUser(subcategoryId: ID!): DefaultResponse @isTutor
    ##############  SUBCATEGORY MUTATION
    AddOffers(offer: TutorOfferInput): DefaultResponse @isTutor
    EditTutorOffer(id: ID, payload: TutorOfferInput): DefaultResponse @isTutor
    DeleteOffer(id: ID): DefaultResponse @isTutor
  }
`;
