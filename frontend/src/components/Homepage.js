import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { navigate, Redirect } from "@reach/router";
import { LayoutOfPost } from "./Layouts";
import Suggestions from "./Suggestions";
import PostModal from "../modals/PostModal";
import LikesModal from "../modals/LikesModal";
import { connect } from "react-redux";
import {
  getUserId,
  getCurrentPage,
  getHomepagePosts,
  getProfileUserPosts,
  getPostInfo,
  updateArrays,
  updateToggleLikesArray,
} from "../redux";

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: "",
      inputValues: {},
      posts: [],
      homepagePosts: [],
      isUpdated: false,
    };
  }

  componentDidMount = async () => {
    // Get all posts
    await axios.get("posts").then((res) => {
      this.setState({
        posts: res.data.reverse(),
      });
    });

    // Get usernames of following array
    const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(
      (user) => user.username
    );

    // Filter posts to get homepage posts
    const homepagePosts = this.state.posts.filter(
      (post) =>
        post.username === this.props.loggedInUserUsername ||
        usernamesOfFollowingArray.includes(post.username)
    );

    // Give each post an unique input value
    homepagePosts.forEach((post, index) => {
      this.setState((prevState) => ({
        inputValues: { ...prevState.inputValues, [index]: "" },
      }));
    });

    // update homepage posts in redux store
    this.props.getHomepagePosts(homepagePosts);

    // update the page in redux store
    this.props.getCurrentPage("homepage");
  };

  componentDidUpdate = async () => {
    // Get all posts
    if (this.state.isUpdated === true) {
      await axios.get("posts").then((res) => {
        this.setState({
          posts: res.data.reverse(),
        });
      });

      // Get usernames in the following array
      const usernamesOfFollowingArray =
        this.props.loggedInUserFollowingArray.map((user) => user.username);

      // Filter the posts to get homepage posts
      const homepagePosts = this.state.posts.filter(
        (post) =>
          post.username === this.props.loggedInUserUsername ||
          usernamesOfFollowingArray.includes(post.username)
      );

      // Update homepage posts in redux store
      this.props.getHomepagePosts(homepagePosts);

      this.setState({
        isUpdated: false,
      });
    }
  };

  openLikesModal = async (postId) => {
    // Get post information by passing in id
    await this.props.getPostInfo(postId);

    // update the logged in user followers and following arrays
    await this.props.updateArrays();

    // Get usernames of following array
    const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(
      (user) => user.username
    );

    // Map through followers array and give user extra properties
    const toggleLikesArray = this.props.postLikes.map((user) => {
      if (user.username === this.props.loggedInUserUsername) {
        user.display = "none";

        return user;
      } else if (usernamesOfFollowingArray.includes(user.username)) {
        user.display = "inline";
        user.buttonText = "Following";
        user.buttonBackgroundColor = "white";
        user.buttonTextColor = "black";

        return user;
      } else {
        user.display = "inline";
        user.buttonText = "Follow";
        user.buttonBackgroundColor = "rgb(36, 160, 237)";
        user.buttonTextColor = "white";

        return user;
      }
    });

    // update the toggle likes array
    this.props.updateToggleLikesArray(toggleLikesArray);

    this.setState({
      likesModalIsOpen: true,
    });
  };

  closeLikesModal = () => {
    this.setState({
      likesModalIsOpen: false,
    });
  };

  openPostModal = (postId) => {
    // Get post information by passing in id
    this.props.getPostInfo(postId);

    this.setState({
      postModalIsOpen: true,
    });
  };

  closePostModal = () => {
    this.setState({
      postModalIsOpen: false,
      isUpdated: true,
    });
  };

  navigateToUserPage = async (id) => {
    // If the id passed in, is the logged in user id
    if (id === this.props.loggedInUserId) {
      navigate("/profile-page");

      // Else if not the logged in user id
    } else {
      // update user id in redux store
      await this.props.getUserId(id);

      // Get all posts
      await axios.get("posts").then((res) => {
        this.setState({
          posts: res.data.reverse(),
        });
      });

      // Get profile user posts
      const profileUserPosts = this.state.posts.filter(
        (post) => post.username === this.props.profileUserUsername
      );

      // Update profile user posts in redux store
      this.props.getProfileUserPosts(profileUserPosts);

      navigate("/user-profile-page");
    }
  };

  changeLikes = (postId, likes) => {
    // Usernames of people who liked the post
    const usernamesOfPostLikes = likes.map((user) => {
      return user.username;
    });

    // If logged in user is in likes array, then delete user
    if (usernamesOfPostLikes.includes(this.props.loggedInUserUsername)) {
      axios.put("posts/delete_like/" + postId, {
        id: this.props.loggedInUserId,
      });

      // Else add logged in user to likes array
    } else {
      axios.put("posts/add_like/" + postId, {
        id: this.props.loggedInUserId,
        profilePic: this.props.loggedInUserProfilePic,
        username: this.props.loggedInUserUsername,
      });
    }

    this.setState({
      isUpdated: true,
    });
  };

  onChange = (index, e) => {
    this.setState((prevState) => ({
      inputValues: { ...prevState.inputValues, [index]: e.target.value },
    }));
  };

  handleSubmit = (postId, index, e) => {
    e.preventDefault();

    // If the input value is not empty, then post comment
    if (this.state.inputValues[index] !== "") {
      axios.put("posts/comments/" + postId, {
        id: this.props.loggedInUserId,
        comment: this.state.inputValues[index],
        profilePic: this.props.loggedInUserProfilePic,
        username: this.props.loggedInUserUsername,
      });

      // Set input value back to empty string
      this.setState((prevState) => ({
        inputValues: { ...prevState.inputValues, [index]: "" },
        isUpdated: true,
      }));
    }
  };

  render() {
    if (this.props.token === "") return <Redirect from="" to="/" noThrow />;

    const homepagePosts = this.props.homepagePosts.map((post, index) => {
      return (
        <div key={index}>
          <LayoutOfPost
            post={post}
            index={index}
            usernamesOfPostLikes={post.likes.map((like) => like.username)}
            inputValue={this.state.inputValues[index] || ""}
            loggedInUserUsername={this.props.loggedInUserUsername}
            navigateToUserPage={this.navigateToUserPage}
            changeLikes={this.changeLikes}
            onChange={this.onChange}
            handleSubmit={this.handleSubmit}
            openLikesModal={this.openLikesModal}
            openPostModal={this.openPostModal}
          />
        </div>
      );
    });

    return (
      <div>
        <Navbar />
        <div className="homepage-container">
          <div>{homepagePosts}</div>
          <Suggestions />
        </div>
        <LikesModal
          likesModalIsOpen={this.state.likesModalIsOpen}
          closeLikesModal={this.closeLikesModal}
          clickedPost={this.state.clickedPost}
        />
        <PostModal
          postModalIsOpen={this.state.postModalIsOpen}
          closePostModal={this.closePostModal}
        />
      </div>
    );
  }
}

Homepage.defaultProps = {
  loggedInUserFollowingArray: [],
  homepagePosts: [],
};

const mapStateToProps = (state) => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    loggedInUserUsername: state.user.loggedInUserUsername,
    loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
    usernamesOfFollowingArray: state.user.usernamesOfFollowingArray,
    token: state.user.token,
    homepagePosts: state.posts.homepagePosts,
    postLikes: state.posts.postLikes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserId: (id) => dispatch(getUserId(id)),
    getCurrentPage: (page) => dispatch(getCurrentPage(page)),
    getHomepagePosts: (posts) => dispatch(getHomepagePosts(posts)),
    getProfileUserPosts: (posts) => dispatch(getProfileUserPosts(posts)),
    getPostInfo: (postId) => dispatch(getPostInfo(postId)),
    updateArrays: () => dispatch(updateArrays()),
    updateToggleLikesArray: (arr) => dispatch(updateToggleLikesArray(arr)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
