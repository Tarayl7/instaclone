import {
    LOGIN_SUCCESSFUL,
    GET_USER_ID,
    GET_CURRENT_PAGE,
    UPDATE_ARRAYS,
    UPDATE_PROFILE_USER_ARRAYS,
    UPDATE_TOGGLE_FOLLOWING_ARRAY,
    UPDATE_TOGGLE_FOLLOWERS_ARRAY,
    UPDATE_TOGGLE_LIKES_ARRAY,
    UPDATE_PROFILE_PIC_AND_PUBLIC_ID,
    UPDATE_PROFILE_PIC,
    UPDATE_USERNAME_FULL_NAME_AND_BIO,
    SET_NAVBAR_USER_SELECTED_TO_TRUE,
    SET_NAVBAR_USER_SELECTED_TO_FALSE,
    SET_PROFILE_USER_CHANGED_TO_FALSE,
    RESET_USER
} from './userTypes';

const initialState = {
    loggedInUserId: '',
    loggedInUserProfilePic: '',
    loggedInUserUsername: '',
    loggedInUserFullName: '',
    loggedInUserBio: '',
    loggedInUserPublicId: '',
    loggedInUserFollowersArray: [],
    loggedInUserFollowingArray: [],
    toggleFollowersArray: [],
    toggleFollowingArray: [],
    toggleLikesArray: [],
    profileUserId: '',
    profileUserProfilePic: '',
    profileUserUsername: '',
    profileUserFullName: '',
    profileUserBio: '',
    profileUserFollowersArray: [],
    profileUserFollowingArray: [],
    token: '',
    currentPageOn: '',
    navbarUserSelected: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESSFUL:
            return {
                ...state,
                loggedInUserId: action.payload.id,
                loggedInUserProfilePic: action.payload.profilePic,
                loggedInUserUsername: action.payload.username,
                loggedInUserFullName: action.payload.fullName,
                loggedInUserBio: action.payload.bio,
                loggedInUserFollowersArray: action.payload.followers,
                loggedInUserFollowingArray: action.payload.following,
                loggedInUserPublicId: action.payload.publicId,
                token: action.payload.token
            }
        case GET_USER_ID:
            return {
                ...state,
                profileUserId: action.payload.id,
                profileUserProfilePic: action.payload.profilePic,
                profileUserUsername: action.payload.username,
                profileUserFullName: action.payload.fullName,
                profileUserBio: action.payload.bio,
                profileUserFollowersArray: action.payload.followersArray,
                profileUserFollowingArray: action.payload.followingArray
            }
        case GET_CURRENT_PAGE:
            return {
                ...state,
                currentPageOn: action.payload
            }
        case UPDATE_ARRAYS:
            return {
                ...state,
                loggedInUserFollowersArray: action.payload.followers,
                loggedInUserFollowingArray: action.payload.following
            }
        case UPDATE_PROFILE_USER_ARRAYS: {
            return {
                ...state,
                profileUserFollowersArray: action.payload.followers,
                profileUserFollowingArray: action.payload.following
            }
        }
        case UPDATE_TOGGLE_FOLLOWING_ARRAY:
            return {
                ...state,
                toggleFollowingArray: action.payload
            }
        case UPDATE_TOGGLE_FOLLOWERS_ARRAY:
            return {
                ...state,
                toggleFollowersArray: action.payload
            }
        case UPDATE_TOGGLE_LIKES_ARRAY:
            return {
                ...state,
                toggleLikesArray: action.payload
            }
        case UPDATE_PROFILE_PIC_AND_PUBLIC_ID:
            return {
                ...state,
                loggedInUserProfilePic: action.payload.pic,
                loggedInUserPublicId: action.payload.publicId
            }
        case UPDATE_PROFILE_PIC:
            return {
                ...state,
                loggedInUserProfilePic: action.payload
            }
        case UPDATE_USERNAME_FULL_NAME_AND_BIO:
            return {
                ...state,
                loggedInUserUsername: action.payload.username,
                loggedInUserFullName: action.payload.fullName,
                loggedInUserBio: action.payload.bio
            }
        case SET_NAVBAR_USER_SELECTED_TO_TRUE:
            return {
                ...state,
                navbarUserSelected: true
            }
        case SET_NAVBAR_USER_SELECTED_TO_FALSE:
            return {
                ...state,
                navbarUserSelected: false
            }
        case SET_PROFILE_USER_CHANGED_TO_FALSE:
            return {
                ...state,
                profileUserChanged: false
            }
        case RESET_USER:
            return initialState
        default:
            return state
    }
}

export default userReducer;