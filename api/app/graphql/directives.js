import { UserModel, SuperUserModel } from "../models";
import statusCode from "../constant/statusCode";
import { userRole, userStatus } from "../constant";

const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");

class isAuthenticated extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      // extract user from context
      const { user = {} } = args[2];

      const foundUser = await UserModel.findOne({
        _id: user._id,
      });

      if (!foundUser) {
        const isSuperUser = await SuperUserModel.findOne({
          _id: user._id,
        });

        if (!isSuperUser) {
          return {
            message: "Unauthorized",
            code: statusCode.UNAUTHORIZED,
            success: false,
          };
        }
      }
      if (foundUser?.status === "restricted") {
        return {
          message: "You are restricted. Please contact support..",
          code: statusCode.BLOCKED,
          success: false,
        };
      }
      args[2].user = foundUser;
      return resolve.apply(this, args);
    };
  }
}

class isTutor extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      // extract user from context
      const { user = {} } = args[2];
      const foundUser = await UserModel.findOne({
        _id: user._id,
        role: userRole.tutor,
      });
      if (!foundUser) {
        const isSuperUser = await SuperUserModel.findOne({
          _id: user._id,
        });
        const isStudentUser = await UserModel.findOne({
          _id: user._id,
          role: userRole.student,
        });
        if (isStudentUser || isSuperUser) {
          return {
            message: "Permission denied.",
            code: statusCode.PERMISSION_DENIED,
            success: false,
          };
        }
        return {
          message: "Login required.",
          code: statusCode.UNAUTHORIZED,
          success: false,
        };
      }
      if (foundUser.status === userStatus.blocked) {
        return {
          message: "You are restricted. Please contact support..",
          code: statusCode.BLOCKED,
          success: false,
        };
      }
      args[2].user = foundUser;
      return resolve.apply(this, args);
    };
  }
}

class isStudent extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      // extract user from context
      const { user = {} } = args[2];
      const foundUser = await UserModel.findOne({
        _id: user._id,
        role: userRole.student,
      });
      if (!foundUser) {
        const isSuperUser = await SuperUserModel.findOne({
          _id: user._id,
        });
        const isTutorUser = await UserModel.findOne({
          _id: user._id,
          role: userRole.tutor,
        });
        if (isTutorUser || isSuperUser) {
          return {
            message: "Permission denied.",
            code: statusCode.PERMISSION_DENIED,
            success: false,
          };
        }
        return {
          message: "Login required.",
          code: statusCode.UNAUTHORIZED,
          success: false,
        };
      }
      if (foundUser.status === userStatus.blocked) {
        return {
          message: "You are restricted. Please contact support..",
          code: statusCode.BLOCKED,
          success: false,
        };
      }
      args[2].user = foundUser;
      return resolve.apply(this, args);
    };
  }
}

class isAdmin extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      // extract user from context
      const { user = {} } = args[2];
      const foundUser = await SuperUserModel.findOne({
        _id: user._id,
      });
      if (!foundUser) {
        const isUser = await UserModel.findOne({
          _id: user._id,
        });
        if (isUser) {
          return {
            message: "Permission denied.",
            code: statusCode.PERMISSION_DENIED,
            success: false,
          };
        }
        return {
          message: "Login required.",
          code: statusCode.UNAUTHORIZED,
          success: false,
        };
      }
      args[2].user = foundUser;
      return resolve.apply(this, args);
    };
  }
}

export { isAuthenticated, isAdmin, isTutor, isStudent };
