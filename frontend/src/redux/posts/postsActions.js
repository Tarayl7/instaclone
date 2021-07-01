import axios from 'axios';
import { 
    GET_HOMEPAGE_POSTS,
    GET_LOGGED_IN_USER_POSTS,
    GET_PROFILE_USER_POSTS,
    GET_POST_INFO,
    RESET_POSTS
} from './postsTypes';

export const getHomepagePosts = (posts) => {
    return {
        type: GET_HOMEPAGE_POSTS,
        payload: posts
    }
};

export const getLoggedInUserPosts = (posts) => {
    return {
        type: GET_LOGGED_IN_USER_POSTS,
        payload: posts
    }
};

export const getProfileUserPosts = (posts) => {
    return {
        type: GET_PROFILE_USER_POSTS,
        payload: posts
    }
};

export const getPostInfo = (postId) => async (dispatch) => {
    // Get post information
    await axios.get('posts/' + postId)
            .then(res => { 
                dispatch({
                    type: GET_POST_INFO,
                    payload: {
                        id: res.data._id,
                        userId: res.data.userId,
                        profilePic: res.data.profilePic,
                        username: res.data.username,
                        url: res.data.url,
                        type: res.data.type,
                        publicId: res.data.publicId,
                        likes: res.data.likes,
                        comments: res.data.comments
                    }
                })
        })
};

export const resetPosts = () => {
    return {
        type: RESET_POSTS
    }
};