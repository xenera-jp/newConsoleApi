import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";
import {admin} from "../db/roles.js";
import {arcontent, mirrors, profile_videos, profiles} from "../db/tables.js";

export default async function (req, res, next) {
    try {

        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader.split(' ')[1];
        const userData = tokenService.validateTokenAccess(accessToken);

        const requiredRoles = req?.requiredRoles;

        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userData.role) && userData.role !== admin) {
            return next(ApiError.UnavaliableData())
        }

        req.user = userData;
        next();
    } catch (e) {
        console.log(e)
        return next(ApiError.UnavaliableData())
    }
}