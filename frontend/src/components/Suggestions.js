import React from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import { getUserId, getProfileUserPosts, updateArrays } from '../redux';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstUsername: '',
      secondUsername: '',
      thirdUsername: '',
      firstProfilePic: '',
      secondProfilePic: '',
      thirdProfilePic: '',
      firstId: '',
      secondId: '',
      thirdId: '',
      firstFullName: '',
      secondFullName: '',
      thirdFullName: '',
      firstDisplay: 'inline',
      secondDisplay: 'inline',
      thirdDisplay: 'inline',
      users: [],
      filteredArray: [],
      posts: []
    };
  };

  componentDidMount = async() => {
    // Get all users
    await axios.get('user', {
      headers: {
        'x-auth-token': this.props.token
      }
    })
      .then(res => {
        this.setState({
          users: res.data
        })
      })
      .catch(e => console.log(e.response.data))

    // Update logged in user followers and following arrays
    await this.props.updateArrays();

    // Get usernames of following array
    let usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(user => { return user.username });

    // Return users that the logged in user does not follow
    let filteredArray = this.state.users.filter(user => user.username !== this.props.loggedInUserUsername && !usernamesOfFollowingArray.includes(user.username));

      // If filtered array includes 3 or more users
      if (filteredArray.length >= 3) {
        this.setState({
          firstUsername: filteredArray[filteredArray.length - 1].username,
          secondUsername: filteredArray[filteredArray.length - 2].username,
          thirdUsername: filteredArray[filteredArray.length - 3].username,
          firstProfilePic: filteredArray[filteredArray.length - 1].profilePic,
          secondProfilePic: filteredArray[filteredArray.length - 2].profilePic,
          thirdProfilePic: filteredArray[filteredArray.length - 3].profilePic,
          firstId: filteredArray[filteredArray.length - 1]._id,
          secondId: filteredArray[filteredArray.length - 2]._id,
          thirdId: filteredArray[filteredArray.length - 3]._id,
          firstFullName: filteredArray[filteredArray.length - 1].fullName,
          secondFullName: filteredArray[filteredArray.length - 2].fullName,
          thirdFullName: filteredArray[filteredArray.length - 3].fullName
        })
        // Else if filtered array includes 2 users
      } else if (filteredArray.length === 2) {
        this.setState({
          firstUsername: filteredArray[filteredArray.length - 1].username,
          secondUsername: filteredArray[filteredArray.length - 2].username,
          firstProfilePic: filteredArray[filteredArray.length - 1].profilePic,
          secondProfilePic: filteredArray[filteredArray.length - 2].profilePic,
          firstId: filteredArray[filteredArray.length - 1]._id,
          secondId: filteredArray[filteredArray.length - 2]._id,
          firstFullName: filteredArray[filteredArray.length - 1].fullName,
          secondFullName: filteredArray[filteredArray.length - 2].fullName
        })
        // Else if filtered array includes 1 user
      } else if (filteredArray.length === 1) {
          this.setState({
            firstUsername: filteredArray[filteredArray.length - 1].username,
            firstProfilePic: filteredArray[filteredArray.length - 1].profilePic,
            firstId: filteredArray[filteredArray.length - 1]._id,
            firstFullName: filteredArray[filteredArray.length - 1].fullName
          })
        }
  };

  followUser = (display, id, username, fullName, profilePic) => {
    // Add user to logged in user following array
    axios.put('user/following/' + this.props.loggedInUserId, {
      id,
      username,
      fullName,
      profilePic
    });

    // Add logged in user to the user's followers array
    axios.put('user/followers/' + id, {
      id: this.props.loggedInUserId,
      username: this.props.loggedInUserUsername,
      fullName: this.props.loggedInUserFullName,
      profilePic: this.props.loggedInUserProfilePic
    });

    this.setState({
      [display]: 'none'
    });

    // Update logged in user's followers and following arrays
    this.props.updateArrays();
    
  };

  navigateToUserPage = async (id) => {
    // Put user id in redux store
    await this.props.getUserId(id);

    // Get all posts
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

    navigate('/user-profile-page');
  };

  render() {
    const firstDisplay = 'firstDisplay';
    const secondDisplay = 'secondDisplay';
    const thirdDisplay = 'thirdDisplay';

      return(
        <div className='suggestions-container'>
            <div className='suggestions-top-box'>
                <div>
                    <img className='suggestions-profile-pic' src={this.props.loggedInUserProfilePic} alt='' onClick={() => navigate('profile-page')} />
                </div>
                <div className='suggestions-logged-in-user-name-div'>
                    <p className='suggestions-logged-in-user-username' onClick={() => navigate('profile-page')}>{this.props.loggedInUserUsername}</p>
                    <p className='suggestions-logged-in-user-full-name'>{this.props.loggedInUserFullName}</p>
                </div>
            </div>
            <div className='suggestions-bottom-box'>
                <div>
                    <p className='suggestions-for-you'>Suggestions for you</p>
                </div>
                {
                  this.state.firstId !== '' && 
                  <div className='suggestions-user'>
                    <div>
                      <img className='suggestions-user-profile-pic' src={this.state.firstProfilePic} alt='' onClick={this.navigateToUserPage.bind(this, this.state.firstId)} />
                    </div>
                    <div>
                      <p className='suggestions-user-username' onClick={this.navigateToUserPage.bind(this, this.state.firstId)}>{this.state.firstUsername}</p>
                      <p className='suggestions-user-full-name'>{this.state.firstFullName}</p>
                    </div>
                    <div>
                      <p className='suggestions-follow' onClick={this.followUser.bind(this, firstDisplay, this.state.firstId, this.state.firstUsername, this.state.firstFullName, this.state.firstProfilePic)} style={{ display: this.state.firstDisplay }}>Follow</p>
                    </div>
                </div>
                }
                {
                  this.state.secondId !== '' &&
                  <div className='suggestions-user'>
                    <div>
                      <img className='suggestions-user-profile-pic' src={this.state.secondProfilePic} alt='' onClick={this.navigateToUserPage.bind(this, this.state.secondId)} />
                    </div>
                    <div>
                      <p className='suggestions-user-username' onClick={this.navigateToUserPage.bind(this, this.state.secondId)}>{this.state.secondUsername}</p>
                      <p className='suggestions-user-full-name'>{this.state.secondFullName}</p>
                    </div>
                    <div>
                      <p className='suggestions-follow' onClick={this.followUser.bind(this, secondDisplay, this.state.secondId, this.state.secondUsername, this.state.secondFullName, this.state.secondProfilePic)} style={{ display: this.state.secondDisplay }}>Follow</p>
                    </div>
                </div>
                }
                {
                  this.state.thirdId !== '' &&
                  <div className='suggestions-user'>
                    <div>
                      <img className='suggestions-user-profile-pic' src={this.state.thirdProfilePic} alt='' onClick={this.navigateToUserPage.bind(this, this.state.thirdId)}/>
                    </div>
                    <div>
                      <p className='suggestions-user-username' onClick={this.navigateToUserPage.bind(this, this.state.thirdId)}>{this.state.thirdUsername}</p>
                      <p className='suggestions-user-full-name'>{this.state.thirdFullName}</p>
                    </div>
                    <div>
                      <p className='suggestions-follow' onClick={this.followUser.bind(this, thirdDisplay, this.state.thirdId, this.state.thirdUsername, this.state.thirdFullName, this.state.thirdProfilePic)} style={{ display: this.state.thirdDisplay }}>Follow</p>
                    </div>
                </div>
                }
            </div>
        </div>
      )
  }
};

Suggestions.defaultProps = {
  loggedInUserFollowingArray: []
}

const mapStateToProps = state => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    loggedInUserUsername: state.user.loggedInUserUsername,
    loggedInUserFullName: state.user.loggedInUserFullName,
    loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
    token: state.user.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getUserId: id => dispatch(getUserId(id)),
    getProfileUserPosts: posts => dispatch(getProfileUserPosts(posts)),
    updateArrays: () => dispatch(updateArrays())
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Suggestions);