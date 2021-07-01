import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { navigate } from '@reach/router';
import { LayoutOfUsers } from '../components/Layouts';
import { connect } from 'react-redux';
import { 
    updateToggleFollowingArray,
    getUserId,
    getProfileUserPosts
} from '../redux';

Modal.setAppElement('#root');

class FollowingModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: []
        }
    };

    navigateToUserPage = async (id) => {
        // If the id is the logged in user's id
        if (id === this.props.loggedInUserId) {
            navigate('/profile-page')

        // Else if it's another user's id
        } else {
            // Get the user's id
            await this.props.getUserId(id);

            // Get all the posts
            await axios.get('posts')
                .then(res => {
                    this.setState({
                    posts: res.data.reverse()
                })
            });

            // Get profile user posts
            const profileUserPosts = this.state.posts.filter(post => post.username === this.props.profileUserUsername);

            // Update profile user posts in redux store
            this.props.getProfileUserPosts(profileUserPosts);

            navigate('/user-profile-page')
        }
    };


      toggle = (userId, userUsername, userFullName, userProfilePic) => {

        const toggleFollowingArray = this.props.toggleFollowingArray.map(user => {
            // If logged in user is following user, then delete users from respective arrays
            if (user.username === userUsername && user.buttonText === 'Following') {

                axios.put('user/following/delete/' + this.props.loggedInUserId, {
                    id: userId
                });

                axios.put('user/followers/delete/' + userId, {
                    id: this.props.loggedInUserId
                });

                user.buttonText = 'Follow';
                user.buttonBackgroundColor = 'rgb(36, 160, 237)';
                user.buttonTextColor = 'white';

                return user;

            // Else add users in respective arrays
            } else if (user.username === userUsername && user.buttonText === 'Follow') {

                axios.put('user/following/' + this.props.loggedInUserId, {
                    id: userId,
                    username: userUsername,
                    fullName: userFullName,
                    profilePic: userProfilePic
                });

                axios.put('user/followers/' + userId, {
                    id: this.props.loggedInUserId,
                    username: this.props.loggedInUserUsername,
                    fullName: this.props.loggedInUserFullName,
                    profilePic: this.props.loggedInUserProfilePic
                });

                user.buttonText = 'Following';
                user.buttonBackgroundColor = 'white';
                user.buttonTextColor = 'black';

                return user;
            };

            return user;
        });

        // Update toggle followers array in redux store
        this.props.updateToggleFollowingArray(toggleFollowingArray);
    }

    render() {

        const following = this.props.toggleFollowingArray.map((user, index) => {
            return(
                <div key={index}>
                    <LayoutOfUsers 
                        user={user}
                        navigateToUserPage={this.navigateToUserPage}
                        toggle ={this.toggle}
                    />
                </div>
            )
        })
        return(
            <Modal isOpen={this.props.followingModalIsOpen} onRequestClose={this.props.closeFollowingModal} style={{
                overlay: {
                    backgroundColor: 'rgba(55, 55, 55, 0.8)',
                    zIndex: '2'
                },
                content: {
                    top: '7rem',
                    width: '22rem',
                    height: '22rem',
                    margin: '0 auto',
                    borderRadius: '3%',
                    overflow: 'hidden'
                }
            }}>
                <div>
                    <div className='following-modal-top'>Following</div>
                    {following}
                </div>
            </Modal>
        )
    }
};

FollowingModal.defaultProps = {
    toggleFollowingArray: []
}

const mapStateToProps = state => {
    return {
        loggedInUserId: state.user.loggedInUserId,
        loggedInUserUsername: state.user.loggedInUserUsername,
        loggedInUserFullName: state.user.loggedInUserFullName,
        loggedInUserProfilePic: state.user.loggedInUserProfilePic,
        loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
        toggleFollowingArray: state.user.toggleFollowingArray,
        usernamesOfFollowingArray: state.user.usernamesOfFollowingArray,
        token: state.user.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateToggleFollowingArray: arr => dispatch(updateToggleFollowingArray(arr)),
        getUserId: id => dispatch(getUserId(id)),
        getProfileUserPosts: posts => dispatch(getProfileUserPosts(posts))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FollowingModal)