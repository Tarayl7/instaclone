import { 
    GET_HOMEPAGE_POSTS,
    GET_LOGGED_IN_USER_POSTS,
    GET_PROFILE_USER_POSTS,
    GET_POST_INFO,
    RESET_POSTS 
} from './postsTypes';

const initialState= {
    postId: '',
    postUserId: '',
    postProfilePic: '',
    postUsername: '',
    postUrl: '',
    postType: '',
    postPublicId: '',
    postLikes: [],
    postComments: [],
    homepagePosts: [],
    loggedInUserPosts: [],
    profileUserPosts: []
}

const postsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_HOMEPAGE_POSTS:
            return {
                ...state,
                homepagePosts: action.payload
            }
        case GET_LOGGED_IN_USER_POSTS:
            return {
                ...state,
                loggedInUserPosts: action.payload
            }
        case GET_PROFILE_USER_POSTS:
            return {
                ...state,
                profileUserPosts: action.payload
            }
        case GET_POST_INFO:
            return {
                ...state,
                postId: action.payload.id,
                postUserId: action.payload.userId,
                postProfilePic: action.payload.profilePic,
                postUsername: action.payload.username,
                postUrl: action.payload.url,
                postType: action.payload.type,
                postPublicId: action.payload.publicId,
                postLikes: action.payload.likes,
                postComments: action.payload.comments
            }
        case RESET_POSTS:
            return initialState
        default: 
            return state
    }
}

export default postsReducer;