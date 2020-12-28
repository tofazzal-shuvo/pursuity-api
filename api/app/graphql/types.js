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
    Morning
    Afternoon
    Evening
  }
  enum UserRole {
    Student
    Tutor
  }
  enum UserStatus {
    Active
    Blocked
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
  type Tutor {
    _id: ID
    bio: String
    graduateInstituteName: String
    graduateSubject: String
    postInstituteName: String
    postSubject: String
    hourlyRate: Int
    rateAverage: Float
    rateCount: Int
    tutorLavel: String
    availability: [Availability]
    isFlaxible: Boolean
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
    age: String
    gender: String
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
    age: String
    gender: String
    timeZone: String
    # tutor
    bio: String
    hourlyRate: Int
    graduateInstituteName: String
    graduateSubject: String
    postInstituteName: String
    postSubject: String
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
  type FetchUserByIdResponse {
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
  }
  type Category {
    _id: ID
    name: String
    subcategory: [Subcategory]
  }
  type FetchSubjectsResponse {
    count: Int
    success: Boolean
    result: [Category]
  }

  # type Subscription {
  ###################### Subscription ######################
  # NewPaymentReq(shopperId: ID): Order
  # }
  type Query {
    ##################### USER QUERY ######################
    FetchUserById: FetchUserByIdResponse @isAuthenticated
    FetchSubjectsForAdmin(limit: Int, offset: Int): FetchSubjectsResponse
      @isAdmin
    FetchSubjectsForUser(limit: Int, offset: Int): FetchSubjectsResponse
      @isAuthenticated
  }
  type Mutation {
    ###################### GENERIC MUTATION ######################
    SingleUpload(file: Upload!): SingleFile!

    ###################### USER MUTATION ######################
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

    ###################### ADMIN MUTATION ######################
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
    AddCategory(name: String!): DefaultResponse @isAdmin
    AddSubcategory(categoryId: ID, name: String): DefaultResponse @isAdmin
  }
`;
