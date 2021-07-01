import React from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import PostModal from '../modals/PostModal';
import FollowersModal from '../modals/FollowersModal';
import FollowingModal from '../modals/FollowingModal';
import { navigate, Redirect } from '@reach/router';
import { connect } from 'react-redux';
import {
    getCurrentPage,
    getProfileUserPosts,
    getPostInfo,
    updateArrays,
    updateProfileUserArrays,
    updateToggleFollowersArray,
    updateToggleFollowingArray,
    setNavbarUserSelectedToFalse,
    setProfileUserChangedToFalse,
} from '../redux';

class UserProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonText: 'Loading',
            buttonBackgroundColor: 'white',
            buttonTextColor: 'black',
            isUpdated: false
        }
    };

    componentDidMount = async () => {
        // Update logged in user followers and following arrays
        await this.props.updateArrays();

        // Get usernames of following array
        const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(user => user.username);

        // If logged in user is following profile user
        if (usernamesOfFollowingArray.includes(this.props.profileUserUsername)) {
            this.setState({
                buttonText: 'Following',
                buttonBackgroundColor: 'white',
                buttonTextColor: 'black'
            })

        // Else if not following
        } else {
            this.setState({
                buttonText: 'Follow',
                buttonBackgroundColor: 'rgb(36, 160, 237)',
                buttonTextColor: 'white'
            })
        };

        // Update current page in redux store
        this.props.getCurrentPage('user-profile-page');
    };

    componentDidUpdate = async () => {

        // if user in navbar was selected
        if (this.props.navbarUserSelected === true || this.state.isUpdated === true) {
            // Update logged in user followers and following arrays
            await this.props.updateArrays();

            // Update profile user followers and following arrays
            await this.props.updateProfileUserArrays();

            // Get usernames of following array
            const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(user => user.username);

            // if logged in user is following profile user
            if (usernamesOfFollowingArray.includes(this.props.profileUserUsername)) {
                this.setState({
                    buttonText: 'Following',
                    buttonBackgroundColor: 'white',
                    buttonTextColor: 'black'
                })

            // Else if not following
            } else {
                this.setState({
                    buttonText: 'Follow',
                    buttonBackgroundColor: 'rgb(36, 160, 237)',
                    buttonTextColor: 'white'
                })
            };

            // change navbar user selected in redux store
            this.props.setNavbarUserSelectedToFalse();
        };
    };

    openFollowersModal = async () => {
        // update logged in user followers and following arrays
        await this.props.updateArrays();

        // update profile user followers and following arrays
        await this.props.updateProfileUserArrays();

        // Get usernames of following array
        const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(user => user.username);

        // Map through followers array and give each user properties
        const toggleFollowersArray = this.props.profileUserFollowersArray.map(user => {
            if (this.props.loggedInUserUsername === user.username) {
                user.display = 'none';

                return user;
            } else if (usernamesOfFollowingArray.includes(user.username)) {
                user.display = 'inline';
                user.buttonText = 'Following';
                user.buttonBackgroundColor = 'white';
                user.buttonTextColor = 'black';

                return user;
            } else {
                user.display = 'inline';
                user.buttonText = 'Follow';
                user.buttonBackgroundColor = 'rgb(36, 160, 237)';
                user.buttonTextColor = 'white';

                return user;
            }
        });

        // Update toggle followers array in redux store
        this.props.updateToggleFollowersArray(toggleFollowersArray);

        this.setState({
            followersModalIsOpen: true
        })
    };

    closeFollowersModal = () => {
        this.setState({
            followersModalIsOpen: false
        })
    };

    openFollowingModal = async () => {
        // update logged in user followers and following arrays
        await this.props.updateArrays();

        // Get usernames of following array
        const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(user => user.username);

        // Map through following array and give user extra properties
        const toggleFollowingArray = this.props.profileUserFollowingArray.map(user => {
            if (this.props.loggedInUserUsername === user.username) {
                user.display = 'none';

                return user;
            } else if (usernamesOfFollowingArray.includes(user.username)) {
                user.display = 'inline';
                user.buttonText = 'Following';
                user.buttonBackgroundColor = 'white';
                user.buttonTextColor = 'black';

                return user;
            } else {
                user.display = 'inline';
                user.buttonText = 'Follow';
                user.buttonBackgroundColor = 'rgb(36, 160, 237)';
                user.buttonTextColor = 'white';

                return user;
            }
        });

        // Update toggle following array in redux store
        this.props.updateToggleFollowingArray(toggleFollowingArray);

        this.setState({
            followingModalIsOpen: true
        })
    };

    closeFollowingModal = () => {
        this.setState({
            followingModalIsOpen: false
        })
    };

    openPostModal = async (postId) => {

        // Get post information from passed in id
        await this.props.getPostInfo(postId);

        this.setState({
            postModalIsOpen: true
        })
    };

    closePostModal = () => {
        this.setState({
            postModalIsOpen: false,
            isUpdated: true
        })
    };

    toggle = () => {
        // Delete logged in user and profile user from respective arrays
        if (this.state.buttonText === 'Following') {
            axios.put('user/following/delete/' + this.props.loggedInUserId, {
                id: this.props.profileUserId
            });

            axios.put('user/followers/delete/' + this.props.profileUserId, {
                id: this.props.loggedInUserId
            });

            this.setState({
                isUpdated: true
            })

        // Else add logged in user and profile user in respective arrays
        } else {
            axios.put('user/following/' + this.props.loggedInUserId, {
                id: this.props.profileUserId,
                username: this.props.profileUserUsername,
                fullName: this.props.profileUserFullName,
                profilePic: this.props.profileUserProfilePic
            });

            axios.put('user/followers/' + this.props.profileUserId, {
                id: this.props.loggedInUserId,
                username: this.props.loggedInUserUsername,
                fullName: this.props.loggedInUserFullName,
                profilePic: this.props.loggedInUserProfilePic
            });

            this.setState({
                isUpdated: true
            })
        }
    };

    render() {

        if (this.props.token === '') return <Redirect from='' to='/' noThrow />

        const profileUserPosts = this.props.profileUserPosts.map((post, index) => {
            return (
                <div key={index}>
                    {
                        post.type === 'image' ?
                            <img className='user-profile-page-post-image' src={post.url} alt='' onClick={this.openPostModal.bind(this, post._id)} /> :
                            post.type === 'video' &&
                            <video className='user-profile-page-post-video' src={post.url} onClick={this.openPostModal.bind(this, post._id)} />
                    }
                </div>
            )
        })
        return (
            <div>
                <Navbar />
                <div className='user-profile-page-container'>
                    <div className='user-profile-page-top'>
                        <div>
                            <img className='user-profile-page-profile-pic' src={this.props.profileUserProfilePic} alt='' />
                        </div>
                        <div>
                            <div className='user-profile-page-username-and-button-div'>
                                <div>
                                    <p className='user-profile-page-username'>{this.props.profileUserUsername}</p>
                                </div>
                                <div className='user-profile-page-button-div'>
                                    <button className='user-profile-page-message-button' onClick={() => navigate('/messages')}>Message</button>
                                    <button className='user-profile-page-toggle-button' onClick={this.toggle} style={{ backgroundColor: this.state.buttonBackgroundColor, color: this.state.buttonTextColor }}>{this.state.buttonText}</button>
                                </div>
                            </div>
                            <div className='user-profile-page-posts-followers-and-following-div'>
                                <p className='user-profile-page-posts'><span className='user-profile-page-posts-span'>{this.props.profileUserPosts.length}</span> posts</p>
                                <p className='user-profile-page-followers' onClick={this.openFollowersModal}><span className='user-profile-page-followers-span'>{this.props.profileUserFollowersArray.length}</span> followers</p>
                                <p className='user-profile-page-following' onClick={this.openFollowingModal}><span className='user-profile-page-following-span'>{this.props.profileUserFollowingArray.length}</span> following</p>
                            </div>
                            <div className='user-profile-page-full-name-div'>
                                <p className='user-profile-page-full-name'>{this.props.profileUserFullName}</p>
                            </div>
                            <div className='user-profile-page-bio-div'>
                                <p className='user-profile-page-bio'>{this.props.profileUserBio}</p>
                            </div>
                        </div>
                    </div>
                    <div className='user-profile-page-posts-div'>
                        {profileUserPosts}
                    </div>
                </div>
                <FollowersModal
                    followersModalIsOpen={this.state.followersModalIsOpen}
                    closeFollowersModal={this.closeFollowersModal}
                />
                <FollowingModal
                    followingModalIsOpen={this.state.followingModalIsOpen}
                    closeFollowingModal={this.closeFollowingModal}
                />
                <PostModal
                    postModalIsOpen={this.state.postModalIsOpen}
                    closePostModal={this.closePostModal}
                />
            </div>
        )
    }
};

UserProfilePage.defaultProps = {
    loggedInUserFollowingArray: [],
    profileUserFollowersArray: [],
    profileUserFollowingArray: [],
    profileUserPosts: []
}

const mapStateToProps = state => {
    return {
        loggedInUserId: state.user.loggedInUserId,
        loggedInUserProfilePic: state.user.loggedInUserProfilePic,
        loggedInUserUsername: state.user.loggedInUserUsername,
        loggedInUserFullName: state.user.loggedInUserFullName,
        loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
        profileUserId: state.user.profileUserId,
        profileUserProfilePic: state.user.profileUserProfilePic,
        profileUserUsername: state.user.profileUserUsername,
        profileUserFullName: state.user.profileUserFullName,
        profileUserBio: state.user.profileUserBio,
        profileUserFollowersArray: state.user.profileUserFollowersArray,
        profileUserFollowingArray: state.user.profileUserFollowingArray,
        profileUserChanged: state.user.profileUserChanged,
        usernamesOfFollowingArray: state.user.usernamesOfFollowingArray,
        navbarUserSelected: state.user.navbarUserSelected,
        token: state.user.token,
        profileUserPosts: state.posts.profileUserPosts
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateToggleFollowersArray: arr => dispatch(updateToggleFollowersArray(arr)),
        updateToggleFollowingArray: arr => dispatch(updateToggleFollowingArray(arr)),
        getCurrentPage: page => dispatch(getCurrentPage(page)),
        getProfileUserPosts: posts => dispatch(getProfileUserPosts(posts)),
        getPostInfo: postId => dispatch(getPostInfo(postId)),
        updateArrays: () => dispatch(updateArrays()),
        updateProfileUserArrays: () => dispatch(updateProfileUserArrays()),
        setNavbarUserSelectedToFalse: () => dispatch(setNavbarUserSelectedToFalse()),
        setProfileUserChangedToFalse: () => dispatch(setProfileUserChangedToFalse())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfilePage);