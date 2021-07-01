import React from 'react';
import axios from 'axios';
import { Link, navigate } from '@reach/router';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';
import { 
  getProfileUserPosts,  
  getUserId, 
  setNavbarUserSelectedToTrue 
  } from '../redux';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: [],
      posts: [],
      isUpdated: false
    }
  };

  componentDidUpdate = () => {
    if (this.state.isUpdated === true) {
      this.setState({
        selectedUsers: [],
        isUpdated: false
      })
    }
  }

  loadOptions = async (inputText, callback) => {
    // Get all users, then load the searched users
    const response = await axios.get('user', {
      headers: {
        'x-auth-token': this.props.token
      }
    })
      .then(res => res.data.map(user => ({
        label:
          <div className='navbar-load-options-container' onClick={this.navigateToUserPage.bind(this, user._id)}>
            <div>
              <img className='navbar-load-options-profilePic' src={user.profilePic} alt='' />
            </div>
            <div className='navbar-load-options-username-and-fullName-div'>
              <p className='navbar-load-options-username'>{user.username}</p>
              <p className='navbar-load-options-fullName'>{user.fullName}</p>
            </div>
          </div>,
        value: user.username
      })
      ).filter(user => user.value.toLowerCase().includes(inputText.toLowerCase())));

    callback(response);

  };

  onChange = (selectedUsers) => {
    this.setState({
      selectedUsers
    })
  };

  navigateToUserPage = async (id) => {
    // If the id passed in, is the logged in user id
    if (id === this.props.loggedInUserId) {
      navigate('/profile-page');

    // Else if it's not the logged in user id
    } else {
      this.setState({
        isUpdated: true
      })

      // Update user id in redux store
      await this.props.getUserId(id);

      // Get all the posts
      await axios.get('http://localhost:4000/posts')
        .then(res => {
          this.setState({
            posts: res.data.reverse()
          })
        });

      // Get profile user posts
      const profileUserPosts = this.state.posts.filter(post => post.username === this.props.profileUserUsername);

      // Update profile user posts in redux store
      this.props.getProfileUserPosts(profileUserPosts);

      // Update navbar user selected in redux store
      this.props.setNavbarUserSelectedToTrue();

      navigate('/user-profile-page');
    }
  };

  render() {
    return (
      <nav>
        <div>
          <Link to='/homepage' className='navbar-instaclone-link'>
            <h1 className='navbar-instaclone'>Instaclone</h1>
          </Link>
        </div>
        <div>
          <AsyncSelect
            className='navbar-async-select'
            loadOptions={this.loadOptions}
            value={this.state.selectedUsers}
            onChange={this.onChange}
          />
        </div>
        <div>
          <ul>
            <li>
              <Link to='/homepage' className='navbar-home-icon-link'>
                <i className="fa fa-home navbar-home-icon" aria-hidden="true"></i>
              </Link>
            </li>
            <li>
              <Link to='/messages' className='navbar-message-icon-link'>
                <i className="fa fa-envelope navbar-message-icon"></i>
              </Link>
            </li>
            <li>
              <Link to='/profile-page'>
                <img className='navbar-profile-pic' src={this.props.loggedInUserProfilePic} alt='' />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
};

const mapStateToProps = state => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    profileUserUsername: state.user.profileUserUsername,
    token: state.user.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getUserId: id => dispatch(getUserId(id)),
    getProfileUserPosts: (posts) => dispatch(getProfileUserPosts(posts)),
    setNavbarUserSelectedToTrue: () => dispatch(setNavbarUserSelectedToTrue())
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)