import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import Modal from "react-modal";
import { connect } from "react-redux";
import { LayoutOfComments } from "../components/Layouts";
import EllipsisModal from "./EllipsisModal";
import LikesModal from "./LikesModal";
import {
  getUserId,
  getPostInfo,
  getProfileUserPosts,
  updateArrays,
  updateToggleLikesArray,
} from "../redux";

Modal.setAppElement("#root");

class PostModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      posts: [],
      ellipsisModalIsOpen: false,
      likesModalIsOpen: false,
      isUpdated: false,
    };

    this.inputRef = React.createRef();
  }

  componentDidUpdate = () => {
    if (this.state.isUpdated === true) {
      // Get post information
      this.props.getPostInfo(this.props.postId);

      this.setState({
        isUpdated: false,
      });
    }
  };

  openEllipsisModal = () => {
    this.setState({
      ellipsisModalIsOpen: true,
    });
  };

  closeEllipsisModal = () => {
    this.setState({
      ellipsisModalIsOpen: false,
    });
  };

  openLikesModal = async () => {
    // Get post information
    await this.props.getPostInfo(this.props.postId);

    // Update logged in user followers and following arrays
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

    // Update toggle likes array in redux store
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

  navigateToUserPage = async (id) => {
    // If the id is the logged in user's id
    if (id === this.props.loggedInUserId) {
      navigate("/profile-page");

      // Else if it's another user's id
    } else {
      // Get the user's id
      await this.props.getUserId(id);

      // Get all the posts
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

  changeLikes = () => {
    // Usernames of people who liked the post
    const usernamesOfPostLikes = this.props.postLikes.map((user) => {
      return user.username;
    });

    // If logged in user is in likes array, then delete user
    if (usernamesOfPostLikes.includes(this.props.loggedInUserUsername)) {
      axios.put("posts/delete_like/" + this.props.postId, {
        id: this.props.loggedInUserId,
      });

      // Else add logged in user to likes array
    } else {
      axios.put("posts/add_like/" + this.props.postId, {
        id: this.props.loggedInUserId,
        profilePic: this.props.loggedInUserProfilePic,
        username: this.props.loggedInUserUsername,
      });
    }

    this.setState({
      isUpdated: true,
    });
  };

  deletePost = () => {
    // If an image, delete image from cloudinary and mongodb
    if (this.props.postType === "image") {
      axios.post("delete/image", { public_id: this.props.postPublicId });
      axios.delete("posts/post/" + this.props.postId);

      // Else if video, delete video from cloudinary and mongodb
    } else {
      axios.post("delete/video", { public_id: this.props.postPublicId });
      axios.delete("posts/post/" + this.props.postId);
    }

    this.setState({
      ellipsisModalIsOpen: false,
    });

    // Update profile page
    this.props.updateProfilePage();
  };

  onChange = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // Add comment
    axios.put("posts/comments/" + this.props.postId, {
      id: this.props.loggedInUserId,
      comment: this.state.inputValue,
      profilePic: this.props.loggedInUserProfilePic,
      username: this.props.loggedInUserUsername,
    });

    this.setState({
      inputValue: "",
      isUpdated: true,
    });
  };

  render() {
    const comments = this.props.postComments.map((comment, index) => {
      return (
        <div key={index}>
          <LayoutOfComments
            comment={comment}
            navigateToUserPage={this.navigateToUserPage}
          />
        </div>
      );
    });

    const usernamesOfPostLikes = this.props.postLikes.map(
      (like) => like.username
    );

    return (
      <Modal
        isOpen={this.props.postModalIsOpen}
        onRequestClose={this.props.closePostModal}
        style={{
          overlay: {
            backgroundColor: "rgba(55, 55, 55, 0.8)",
            zIndex: "1",
          },
          content: {
            maxWidth: "55rem",
            height: "37rem",
            margin: "0 auto",
            padding: "0",
            overflow: "hidden",
          },
        }}
      >
        <div className="post-modal-container">
          <div className="post-modal-left-box">
            {this.props.postType === "image" ? (
              <img
                className="post-modal-image"
                src={this.props.postUrl}
                alt=""
              />
            ) : (
              this.props.postType === "video" && (
                <video
                  className="post-modal-video"
                  src={this.props.postUrl}
                  controls
                />
              )
            )}
          </div>
          <div className="post-modal-right-box">
            <div className="post-modal-top-box-div">
              <div className="post-modal-profile-pic-and-usename-div">
                <img
                  className="post-modal-profile-pic"
                  src={this.props.postProfilePic}
                  alt=""
                  onClick={this.navigateToUserPage.bind(
                    this,
                    this.props.postUserId
                  )}
                />
                <p
                  className="post-modal-username"
                  onClick={this.navigateToUserPage.bind(
                    this,
                    this.props.postUserId
                  )}
                >
                  {this.props.postUsername}
                </p>
              </div>
              <div>
                <i
                  className="fa fa-ellipsis-h post-modal-ellipsis-icon"
                  onClick={this.openEllipsisModal}
                ></i>
              </div>
            </div>
            <div className="post-modal-comments">{comments}</div>
            <div className="post-modal-icon-and-likes-div">
              <div className="post-modal-icons">
                {usernamesOfPostLikes.includes(
                  this.props.loggedInUserUsername
                ) ? (
                  <i
                    className="fa fa-heart post-modal-heart-icon-truthy"
                    onClick={this.changeLikes.bind(this)}
                  ></i>
                ) : (
                  <i
                    className="fa fa-heart post-modal-heart-icon-falsy"
                    onClick={this.changeLikes.bind(this)}
                  ></i>
                )}
                <i
                  className="fa fa-comment post-modal-comment-icon"
                  onClick={() => this.inputRef.current.focus()}
                ></i>
                <i
                  className="fa fa-envelope post-modal-envelope-icon"
                  onClick={() => navigate("/messages")}
                ></i>
              </div>
              {this.props.postLikes.length === 1 ? (
                <div className="post-modal-likes">
                  <p>
                    Liked by{" "}
                    <span className="post-modal-first-span">
                      {this.props.postLikes[0].username}
                    </span>
                  </p>
                </div>
              ) : (
                this.props.postLikes.length > 1 && (
                  <div className="post-modal-likes">
                    <p>
                      Liked by{" "}
                      <span
                        className="post-modal-first-span"
                        onClick={this.navigateToUserPage.bind(
                          this,
                          this.props.postLikes[0].id
                        )}
                      >
                        {this.props.postLikes[0].username}
                      </span>{" "}
                      and{" "}
                      <span
                        className="post-modal-second-span"
                        onClick={this.openLikesModal}
                      >
                        others
                      </span>
                    </p>
                  </div>
                )
              )}
            </div>
            <div>
              <form className="post-modal-form" onSubmit={this.handleSubmit}>
                <div>
                  <input
                    className="post-modal-input"
                    value={this.state.inputValue}
                    ref={this.inputRef}
                    onChange={this.onChange}
                  />
                </div>
                <div>
                  <button className="post-modal-button" type="submit">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <EllipsisModal
          ellipsisModalIsOpen={this.state.ellipsisModalIsOpen}
          closeEllipsisModal={this.closeEllipsisModal}
          deletePost={this.deletePost}
          navigateToUserPage={this.navigateToUserPage}
          changeLikes={this.changeLikes}
        />
        <LikesModal
          likesModalIsOpen={this.state.likesModalIsOpen}
          closeLikesModal={this.closeLikesModal}
        />
      </Modal>
    );
  }
}

PostModal.defaultProps = {
  postLikes: [],
  postComments: [],
  loggedInUserFollowingArray: [],
};

const mapStateToProps = (state) => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    loggedInUserUsername: state.user.loggedInUserUsername,
    loggedInUserFollowingArray: state.user.loggedInUserFollowingArray,
    postId: state.posts.postId,
    postUserId: state.posts.postUserId,
    postProfilePic: state.posts.postProfilePic,
    postUsername: state.posts.postUsername,
    postUrl: state.posts.postUrl,
    postType: state.posts.postType,
    postLikes: state.posts.postLikes,
    postComments: state.posts.postComments,
    postPublicId: state.posts.postPublicId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserId: (id) => dispatch(getUserId(id)),
    getPostInfo: (postId) => dispatch(getPostInfo(postId)),
    getProfileUserPosts: (posts) => dispatch(getProfileUserPosts(posts)),
    updateArrays: () => dispatch(updateArrays()),
    updateToggleLikesArray: (arr) => dispatch(updateToggleLikesArray(arr)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
