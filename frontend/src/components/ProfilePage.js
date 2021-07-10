import React from "react";
import Navbar from "./Navbar";
import axios from "axios";
import PostModal from "../modals/PostModal";
import FollowersModal from "../modals/FollowersModal";
import FollowingModal from "../modals/FollowingModal";
import { navigate, Redirect } from "@reach/router";
import { connect } from "react-redux";
import {
  updateArrays,
  getCurrentPage,
  getLoggedInUserPosts,
  getPostInfo,
  updateToggleFollowersArray,
  updateToggleFollowingArray,
  resetUser,
  resetPosts,
} from "../redux";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      caption: "",
      display: "none",
      imageDisplay: "none",
      videoDisplay: "none",
      processingDisplay: "none",
      labelTextDisplay: "block",
      labelText: "Add image or video",
      posts: [],
      loggedInUserPosts: [],
      file: {},
      disabled: false,
      followersModalIsOpen: false,
      followingModalIsOpen: false,
      postModalIsOpen: false,
      isUpdated: false,
      isFollowingUpdated: false,
    };

    this.imageRef = React.createRef();
    this.videoRef = React.createRef();
  }

  componentDidMount = async () => {
    // Get all posts
    await axios.get("posts").then((res) => {
      this.setState({
        posts: res.data.reverse(),
      });
    });

    // Filter out logged in user posts
    const loggedInUserPosts = this.state.posts.filter(
      (post) => post.username === this.props.loggedInUserUsername
    );

    // Update logged in user posts in redux store
    this.props.getLoggedInUserPosts(loggedInUserPosts);

    // Update the current page in redux store
    this.props.getCurrentPage("profile-page");
  };

  componentDidUpdate = async () => {
    if (this.state.isUpdated === true) {
      // Get all posts
      await axios.get("posts").then((res) => {
        this.setState({
          posts: res.data.reverse(),
        });
      });

      // Filter out logged in user posts
      const loggedInUserPosts = this.state.posts.filter(
        (post) => post.username === this.props.loggedInUserUsername
      );

      // Update logged in user posts in redux store
      this.props.getLoggedInUserPosts(loggedInUserPosts);

      this.setState({
        loggedInUserPosts,
        disabled: false,
        isUpdated: false,
      });
    }

    if (this.state.isFollowingUpdated === true) {
      // Update logged in user followers and following arrays
      await this.props.updateArrays();

      this.setState({
        isFollowingUpdated: false,
      });
    }
  };

  openDeleteModal = () => {
    this.setState({
      deleteModalIsOpen: true,
    });
  };

  closeDeleteModal = () => {
    this.setState({
      deleteModalIsOpen: false,
    });
  };

  openFollowersModal = async () => {
    // update logged in user following and followers arrays
    await this.props.updateArrays();

    // get usernames in logged in user following array
    const usernamesOfFollowingArray = this.props.loggedInUserFollowingArray.map(
      (user) => user.username
    );

    // Map through followers array and give user extra properties
    const toggleFollowersArray = this.props.loggedInUserFollowersArray.map(
      (user) => {
        if (usernamesOfFollowingArray.includes(user.username)) {
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
      }
    );

    // Update toggle followers array in redux store
    this.props.updateToggleFollowersArray(toggleFollowersArray);

    this.setState({
      followersModalIsOpen: true,
    });
  };

  closeFollowersModal = () => {
    this.setState({
      followersModalIsOpen: false,
      isFollowingUpdated: true,
    });
  };

  openFollowingModal = async () => {
    // update logged in user following and followers arrays
    await this.props.updateArrays();

    // Map through following array and give user extra properties
    const toggleFollowingArray = this.props.loggedInUserFollowingArray.map(
      (user) => {
        user.display = "inline";
        user.buttonText = "Following";
        user.buttonBackgroundColor = "white";
        user.buttonTextColor = "black";

        return user;
      }
    );

    // Update toggle following array in redux store
    this.props.updateToggleFollowingArray(toggleFollowingArray);

    this.setState({
      followingModalIsOpen: true,
    });
  };

  closeFollowingModal = () => {
    this.setState({
      followingModalIsOpen: false,
      isFollowingUpdated: true,
    });
  };

  openPostModal = async (postId) => {
    // Get post information by passing in id
    await this.props.getPostInfo(postId);

    this.setState({
      postModalIsOpen: true,
    });
  };

  closePostModal = () => {
    this.setState({
      postModalIsOpen: false,
      isFollowingUpdated: true,
    });
  };

  logout = () => {
    // reset user reducer to initial state
    this.props.resetUser();

    // reset posts reducer to initial state
    this.props.resetPosts();

    localStorage.clear();

    navigate("/");
  };

  changeFile = (e) => {
    this.setState({
      file: e.target.files[0],
    });

    const image = this.imageRef.current;
    const video = this.videoRef.current;

    // If the correct image type
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      // To preview image
      image.src = URL.createObjectURL(e.target.files[0]);

      this.setState({
        display: "inline",
        imageDisplay: "inline",
        videoDisplay: "none",
        labelText: "Change image",
      });

      // set file input value to empty string
      e.target.value = "";

      // Else if the correct video type
    } else if (e.target.files[0].type === "video/mp4") {
      // To preview video
      video.src = URL.createObjectURL(e.target.files[0]);

      this.setState({
        display: "inline",
        imageDisplay: "none",
        videoDisplay: "inline",
        labelText: "Change video",
      });

      // set file input value to empty string
      e.target.value = "";
    }
  };

  updateProfilePage = () => {
    this.setState({
      postModalIsOpen: false,
      isUpdated: true,
    });
  };

  onChange = (e) => {
    this.setState({
      caption: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      disabled: true,
    });

    const formData = new FormData();
    formData.append("file", this.state.file);

    // If correct image type, then post image to cloudinary
    if (
      this.state.file.type === "image/jpeg" ||
      this.state.file.type === "image/png"
    ) {
      this.setState({
        display: "none",
        imageDisplay: "none",
        labelTextDisplay: "none",
        processingDisplay: "block",
      });

      // Post image to cloudinary
      await axios
        .post("upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Submit post
          axios.post("posts/submit_post", {
            userId: this.props.loggedInUserId,
            profilePic: this.props.loggedInUserProfilePic,
            username: this.props.loggedInUserUsername,
            url: res.data.url,
            caption: this.state.caption,
            type: res.data.resource_type,
            publicId: res.data.public_id,
          });
        });
      // Else if correct video type, then post video to cloudinary
    } else if (this.state.file.type === "video/mp4") {
      this.setState({
        display: "none",
        videoDisplay: "none",
        labelTextDisplay: "none",
        processingDisplay: "block",
      });

      // Post video to cloudinary
      await axios
        .post("upload/video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Submit post
          axios.post("posts/submit_post", {
            userId: this.props.loggedInUserId,
            profilePic: this.props.loggedInUserProfilePic,
            username: this.props.loggedInUserUsername,
            url: res.data.url,
            caption: this.state.caption,
            type: res.data.resource_type,
            publicId: res.data.public_id,
          });
        });
    }

    this.setState({
      processingDisplay: "none",
      labelTextDisplay: "block",
      labelText: "Add image or video",
      isUpdated: true,
    });
  };

  render() {
    if (this.props.token === "") return <Redirect from="" to="/" noThrow />;

    const loggedInUserPosts = this.props.loggedInUserPosts.map(
      (post, index) => {
        return (
          <div key={index}>
            {post.type === "image" ? (
              <img
                className="profile-page-post-image"
                src={post.url}
                alt=""
                onClick={this.openPostModal.bind(this, post._id)}
              />
            ) : (
              post.type === "video" && (
                <video
                  className="profile-page-post-video"
                  src={post.url}
                  onClick={this.openPostModal.bind(this, post._id)}
                />
              )
            )}
          </div>
        );
      }
    );

    return (
      <div>
        <Navbar />
        <div className="profile-page-container">
          <div className="profile-page-top">
            <div>
              <img
                className="profile-page-profile-pic"
                src={this.props.loggedInUserProfilePic}
                alt=""
              ></img>
            </div>
            <div>
              <div className="profile-page-username-and-button-div">
                <div>
                  <p className="profile-page-username">
                    {this.props.loggedInUserUsername}
                  </p>
                </div>
                <div className="profile-page-button-div">
                  <button
                    className="profile-page-edit-button"
                    onClick={() => navigate("/edit")}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="profile-page-logout-button"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="profile-page-posts-followers-and-following-div">
                <p className="profile-page-posts">
                  <span className="profile-page-posts-span">
                    {this.props.loggedInUserPosts.length}
                  </span>{" "}
                  posts
                </p>
                <p
                  className="profile-page-followers"
                  onClick={this.openFollowersModal}
                >
                  <span className="profile-page-followers-span">
                    {this.props.loggedInUserFollowersArray.length}
                  </span>{" "}
                  followers
                </p>
                <p
                  className="profile-page-following"
                  onClick={this.openFollowingModal}
                >
                  <span className="profile-page-following-span">
                    {this.props.loggedInUserFollowingArray.length}
                  </span>{" "}
                  following
                </p>
              </div>
              <div className="profile-page-full-name-div">
                <p className="profile-page-full-name">
                  {this.props.loggedInUserFullName}
                </p>
              </div>
              <div className="profile-page-bio-div">
                <p className="profile-page-bio">{this.props.loggedInUserBio}</p>
              </div>
            </div>
          </div>
          <div className="profile-page-middle">
            <div
              className="profile-page-file-upload-div"
              style={{ display: this.state.labelTextDisplay }}
            >
              <input
                id="file"
                type="file"
                name="file"
                onChange={this.changeFile}
              ></input>
              <label className="profile-page-label" htmlFor="file">
                <i className="fa fa-plus-square"></i> {this.state.labelText}
              </label>
            </div>
            <form className="profile-page-form" onSubmit={this.handleSubmit}>
              <div>
                <img
                  className="profile-page-preview-image"
                  src=""
                  alt=""
                  ref={this.imageRef}
                  style={{ display: this.state.imageDisplay }}
                />
                <video
                  className="profile-page-preview-video"
                  src=""
                  ref={this.videoRef}
                  style={{ display: this.state.videoDisplay }}
                />
              </div>
              <div>
                <textarea
                  className="profile-page-textarea"
                  type="text"
                  value={this.state.caption}
                  onChange={this.onChange}
                  style={{ display: this.state.display }}
                />
              </div>
              <div>
                <button
                  className="profile-page-share-button"
                  type="submit"
                  disabled={this.state.disabled}
                  style={{ display: this.state.display }}
                >
                  Share
                </button>
              </div>
            </form>
            <div
              className="profile-page-processing-div"
              style={{
                display: this.state.processingDisplay,
              }}
            >
              <div>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
              </div>
              <div className="profile-page-processing">Processing</div>
              <div className="profile-page-please-wait">Please wait...</div>
            </div>
          </div>
          <div className="profile-page-posts-div">{loggedInUserPosts}</div>
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
          updateProfilePage={this.updateProfilePage}
        />
      </div>
    );
  }
}

ProfilePage.defaultProps = {
  loggedInUserFollowersArray: [],
  loggedInUserFollowingArray: [],
  loggedInUserPosts: [],
};

const mapStateToProps = (state) => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    loggedInUserUsername: state.user.loggedInUserUsername,
    loggedInUserFullName: state.user.loggedInUserFullName,
    loggedInUserBio: state.user.loggedInUserBio,
    loggedInUserFollowersArray: state.user.loggedInUserFollowersArray,
    loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
    token: state.user.token,
    loggedInUserPosts: state.posts.loggedInUserPosts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateArrays: () => dispatch(updateArrays()),
    getCurrentPage: (page) => dispatch(getCurrentPage(page)),
    getLoggedInUserPosts: (posts) => dispatch(getLoggedInUserPosts(posts)),
    getPostInfo: (postId) => dispatch(getPostInfo(postId)),
    updateToggleFollowingArray: (arr) =>
      dispatch(updateToggleFollowingArray(arr)),
    updateToggleFollowersArray: (arr) =>
      dispatch(updateToggleFollowersArray(arr)),
    resetUser: () => dispatch(resetUser()),
    resetPosts: () => dispatch(resetPosts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
