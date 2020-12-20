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
    Instructor
  }
  enum UserStatus {
    Active
    Blocked
  }
  type Student {
    _id: ID
  }
  type Instructor {
    _id: ID
  }
  type User {
    _id: ID
    firstname: String
    lastname: String
    student: Student
    instructor: Instructor
  }
  # input AdminRegistrationInput {
  #   firstname: String!
  #   lastname: String!
  #   email: String!
  #   password: String!
  # }
  input RegistrationInput {
    firstname: String!
    lastname: String!
    mobile: String
    email: String!
    password: String!
    role: UserRole!
  }
  # type AdminLoginResponse {
  #   code: String
  #   success: Boolean
  #   message: String
  #   user: User
  #   token: String
  #   settings: Settings
  # }
  type UserLoginResponse {
    code: String
    success: Boolean
    message: String
    user: User
    token: String
  }
  type FetchUsersOrCustomerResponse {
    code: String
    message: String
    count: Int
    hasNext: Boolean
    result: [User]
  }
  # type Subscription {
  ###################### Subscription ######################
  # NewPaymentReq(shopperId: ID): Order
  # }
  type Query {
    ##################### USER QUERY ######################
    FetchUsers(
      limit: Int
      offset: Int
      role: UserRole
    ): FetchUsersOrCustomerResponse @isAdmin
  }
  type Mutation {
    ###################### GENERIC MUTATION ######################
    SingleUpload(file: Upload!): SingleFile!

    ###################### USER MUTATION ######################
    Login(
      email: String!
      password: String!
      isBusiness: Boolean
      vcard: Boolean
    ): UserLoginResponse
    # Register(userInput: RegistrationInput): DefaultResponse
    # ForgetPassword(email: String!): DefaultResponse
    # ResendVerifyEmail(email: String!): DefaultResponse
    # ResetPassowrd(securityCode: String!, newPassword: String!): DefaultResponse
    # VerifyEmail(securityCode: String!): DefaultResponse
    # PassowrdUpdate(oldPassword: String!, newPassword: String!): DefaultResponse
    #   @isAuthenticated
    # ProfileUpdate(profileData: UserProfileUpdateInput): DefaultResponse
    #   @isAuthenticated

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
