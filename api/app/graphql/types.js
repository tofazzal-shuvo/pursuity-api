import { gql } from "apollo-server";

export const typeDefs = gql`
  directive @isAdmin on FIELD_DEFINITION
  directive @isShopper on FIELD_DEFINITION
  directive @isBusiness on FIELD_DEFINITION
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
  type Tutor {
    _id: ID
    bio: String
    graduateInstituteName: String
    graduateSubject: String
    postInstituteName: String
    postSubject: String
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
  # input AdminRegistrationInput {
  #   firstname: String!
  #   lastname: String!
  #   email: String!
  #   password: String!
  # }
  # type AdminLoginResponse {
  #   code: String
  #   success: Boolean
  #   message: String
  #   user: User
  #   token: String
  #   settings: Settings
  # }

  # type Subscription {
  ###################### Subscription ######################
  # NewPaymentReq(shopperId: ID): Order
  # }
  type Query {
    ##################### USER QUERY ######################
    FetchUserById: FetchUserByIdResponse @isAuthenticated
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
    ChangeEmail(newEmail: String, password: String): DefaultResponse
      @isAuthenticated
    ConfirmChangeEmail(securityCode: String!): DefaultResponse

    ###################### ADMIN MUTATION ######################
    # AdminLogin(email: String!, password: String!): AdminLoginResponse
    # AdminRegister(userInput: AdminRegistrationInput): DefaultResponse
    # AdminForgetPassword(email: String!): DefaultResponse
    # AdminResendVerifyEmail(email: String!): DefaultResponse
    # AdminResetPassowrd(
    #   securityCode: String!
    #   newPassword: String!
    # ): DefaultResponse
    # AdminVerifyEmail(securityCode: String!): DefaultResponse
    # AdminPassowrdUpdate(
    #   oldPassword: String!
    #   newPassword: String!
    # ): DefaultResponse @isAdmin
    # AdminProfileUpdate(profileData: AdminProfileUpdateInput): DefaultResponse
    #   @isAdmin
  }
`;
