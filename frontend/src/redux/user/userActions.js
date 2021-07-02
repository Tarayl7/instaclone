import axios from "axios";
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
  RESET_USER,
} from "./userTypes";

export const authorizeUser = (user) => {
  return {
    type: LOGIN_SUCCESSFUL,
    payload: {
      id: user.id,
      profilePic: user.profilePic,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicId: user.publicId,
      token: user.token,
    },
  };
};

export const getUserId = (id) => async (dispatch, getState) => {
  const token = getState().user.token;

  // Get user information
  await axios
    .get("user/" + id, {
      headers: {
        "x-auth-token": token,
      },
    })
    .then((res) => {
      dispatch({
        type: GET_USER_ID,
        payload: {
          id: res.data._id,
          profilePic: res.data.profilePic,
          username: res.data.username,
          fullName: res.data.fullName,
          bio: res.data.bio,
          followersArray: res.data.followers,
          followingArray: res.data.following,
        },
      });
    });
};

export const getCurrentPage = (page) => {
  return {
    type: GET_CURRENT_PAGE,
    payload: page,
  };
};

export const updateArrays = () => async (dispatch, getState) => {
  const loggedInUserId = getState().user.loggedInUserId;
  const token = getState().user.token;

  // Get logged in user's followers and following arrays
  await axios
    .get("user/" + loggedInUserId, {
      headers: {
        "x-auth-token": token,
      },
    })
    .then((res) => {
      dispatch({
        type: UPDATE_ARRAYS,
        payload: {
          followers: res.data.followers,
          following: res.data.following,
        },
      });
    });
};

export const updateProfileUserArrays = () => async (dispatch, getState) => {
  const profileUserId = getState().user.profileUserId;
  const token = getState().user.token;

  // Get profile user's followers and following arrays
  await axios
    .get("user/" + profileUserId, {
      headers: {
        "x-auth-token": token,
      },
    })
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE_USER_ARRAYS,
        payload: {
          followers: res.data.followers,
          following: res.data.following,
        },
      });
    });
};

export const updateToggleFollowersArray = (arr) => {
  return {
    type: UPDATE_TOGGLE_FOLLOWERS_ARRAY,
    payload: arr,
  };
};

export const updateToggleFollowingArray = (arr) => {
  return {
    type: UPDATE_TOGGLE_FOLLOWING_ARRAY,
    payload: arr,
  };
};

export const updateToggleLikesArray = (arr) => {
  return {
    type: UPDATE_TOGGLE_LIKES_ARRAY,
    payload: arr,
  };
};

export const updateProfilePicAndPublicId = (pic, publicId) => {
  return {
    type: UPDATE_PROFILE_PIC_AND_PUBLIC_ID,
    payload: {
      pic,
      publicId,
    },
  };
};

export const updateProfilePic = (pic) => {
  return {
    type: UPDATE_PROFILE_PIC,
    payload: pic,
  };
};

export const updateUsernameFullNameAndBio = (username, fullName, bio) => {
  return {
    type: UPDATE_USERNAME_FULL_NAME_AND_BIO,
    payload: {
      username,
      fullName,
      bio,
    },
  };
};

export const setNavbarUserSelectedToTrue = () => {
  return {
    type: SET_NAVBAR_USER_SELECTED_TO_TRUE,
  };
};

export const setNavbarUserSelectedToFalse = () => {
  return {
    type: SET_NAVBAR_USER_SELECTED_TO_FALSE,
  };
};

export const setProfileUserChangedToFalse = () => {
  return {
    type: SET_PROFILE_USER_CHANGED_TO_FALSE,
  };
};

export const resetUser = () => {
  return {
    type: RESET_USER,
  };
};
