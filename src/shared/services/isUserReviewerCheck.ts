import { User } from "@prisma/client";


interface IUserReviewerCheck {
    foundUser: User 
}

const permissionsToApprove: Array<string> = ["admin", "reviewer"];

export const isUserReviewerCheck = ({foundUser}: IUserReviewerCheck) => {
    return foundUser && permissionsToApprove.includes(foundUser.userType) ? true : false;
};
