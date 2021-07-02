import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { navigate, Redirect } from "@reach/router";
import EditModal from "../modals/EditModal";
import { connect } from "react-redux";
import {
  updateProfilePicAndPublicId,
  updateProfilePic,
  updateUsernameFullNameAndBio,
} from "../redux";

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editedProfilePic: "",
      editedUsername: "",
      editedFullName: "",
      editedBio: "",
      publicId: "",
      file: "",
      errorMsg: "",
      editModalIsOpen: false,
      isUpdated: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      editedUsername: this.props.loggedInUserUsername,
      editedFullName: this.props.loggedInUserFullName,
    });
  };

  editModal = () => {
    this.setState({
      editModalIsOpen: true,
    });
  };

  closeEditModal = () => {
    this.setState({
      editModalIsOpen: false,
    });
  };

  updateProfilePic = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    // If image type is correct, post image to cloudinary
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      await axios
        .post("upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.setState({
            editedProfilePic: res.data.url,
            publicId: res.data.public_id,
          });
        });
    }

    // If post was successful, then update profile pic
    if (this.state.editedProfilePic !== "") {
      axios.patch("user/update_profilePic/" + this.props.loggedInUserId, {
        profilePic: this.state.editedProfilePic,
        publicId: this.state.publicId,
      });

      axios.post("posts/update_profilePic/" + this.props.loggedInUserUsername, {
        profilePic: this.state.editedProfilePic,
      });

      axios.put(
        "user/update_profilePic_of_arrays/" + this.props.loggedInUserUsername,
        {
          profilePic: this.state.editedProfilePic,
        }
      );
    }

    // update profile pic and public id in redux store
    this.props.updateProfilePicAndPublicId(
      this.state.editedProfilePic,
      this.state.publicId
    );

    this.setState({
      editModalIsOpen: false,
    });
  };

  deleteProfilePic = (e) => {
    e.preventDefault();

    // If profile pic is not the default pic, then delete image from cloudinary
    // Also update the user's profile pic, to the default pic in mongodb
    if (
      this.props.loggedInUserProfilePic !==
      "https://res.cloudinary.com/t-eason/image/upload/v1602544214/n4mdsqo5puulsacc9nuq.jpg"
    ) {
      axios.post("delete/image", {
        public_id: this.props.loggedInUserPublicId,
      });
    }

    axios.patch("user/update_profilePic/" + this.props.loggedInUserId, {
      profilePic:
        "https://res.cloudinary.com/t-eason/image/upload/v1602544214/n4mdsqo5puulsacc9nuq.jpg",
      publicId: "",
    });

    axios.post("posts/update_profilePic/" + this.props.loggedInUserUsername, {
      profilePic:
        "https://res.cloudinary.com/t-eason/image/upload/v1602544214/n4mdsqo5puulsacc9nuq.jpg",
    });

    axios.put(
      "user/update_profilePic_of_arrays/" + this.props.loggedInUserUsername,
      {
        profilePic:
          "https://res.cloudinary.com/t-eason/image/upload/v1602544214/n4mdsqo5puulsacc9nuq.jpg",
      }
    );

    // Update profile pic in redux store
    this.props.updateProfilePic(
      "https://res.cloudinary.com/t-eason/image/upload/v1602544214/n4mdsqo5puulsacc9nuq.jpg"
    );

    this.setState({
      editModalIsOpen: false,
      isUpdated: true,
    });
  };

  onChange = (e) => {
    if (e.currentTarget.name === "edit-username") {
      this.setState({ editedUsername: e.target.value });
    } else if (e.currentTarget.name === "edit-fullName") {
      this.setState({ editedFullName: e.target.value });
    } else if (
      e.currentTarget.name === "edit-bio" &&
      e.currentTarget.value.length <= 150
    ) {
      this.setState({ editedBio: e.target.value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // If the username and full name are not empty, update user information
    if (this.state.editedUsername !== "" || this.state.editedFullName !== "") {
      axios
        .put("user/update_user_info/" + this.props.loggedInUserId, {
          loggedInUserUsername: this.props.loggedInUserUsername,
          username: this.state.editedUsername,
          fullName: this.state.editedFullName,
          bio: this.state.editedBio,
        })
        .then(() => {
          this.setState({
            errorMsg: "",
          });
        })
        .catch((e) => {
          this.setState({
            errorMsg: e.response.data,
          });
        });

      // If no error, then update user from all arrays in mongodb
      if (this.state.errorMsg === "") {
        axios.post("posts/update_username/" + this.props.loggedInUserUsername, {
          username: this.state.editedUsername,
        });

        axios.put(
          "user/update_names_of_arrays/" + this.props.loggedInUserUsername,
          {
            username: this.state.editedUsername,
            fullName: this.state.editedFullName,
          }
        );

        navigate("/profile-page");

        // update username, full name, and bio in redux store
        this.props.updateUsernameFullNameAndBio(
          this.state.editedUsername,
          this.state.editedFullName,
          this.state.editedBio
        );
      }
    }
  };

  render() {
    if (this.props.token === "") return <Redirect from="" to="/" noThrow />;

    return (
      <div>
        <Navbar />
        <br />
        <div className="edit-container">
          <div>
            <h1 className="edit-h1">Edit Profile</h1>
          </div>
          <div className="edit-top">
            <div>
              <img
                className="edit-profile-pic"
                src={this.props.loggedInUserProfilePic}
                alt=""
                onClick={this.editModal}
              />
            </div>
            <div className="edit-username-and-text-div">
              <p className="edit-username">{this.props.loggedInUserUsername}</p>
              <p className="edit-text" onClick={this.editModal}>
                Change Profile Picture
              </p>
            </div>
          </div>
          <form className="edit-form" onSubmit={this.handleSubmit}>
            <div className="edit-label-and-input-div">
              <label className="edit-input-label">username</label>
              <input
                className="edit-input"
                onChange={this.onChange}
                value={this.state.editedUsername}
                name="edit-username"
                placeholder=" required"
              />
              <br />
            </div>
            <div className="edit-label-and-input-div">
              <label className="edit-input-label">fullName</label>
              <input
                className="edit-input"
                onChange={this.onChange}
                value={this.state.editedFullName}
                name="edit-fullName"
                placeholder=" required"
              />
              <br />
            </div>
            <div className="edit-label-and-input-div">
              <label className="edit-textarea-label">Bio</label>
              <textarea
                className="edit-textarea"
                onChange={this.onChange}
                value={this.state.editedBio}
                name="edit-bio"
              />
              <br />
            </div>
            <div className="edit-label-and-button-div">
              <button className="edit-button" type="submit">
                Submit
              </button>
            </div>
            <div className="edit-errorMsg">{this.state.errorMsg}</div>
          </form>
          <EditModal
            editModalIsOpen={this.state.editModalIsOpen}
            closeEditModal={this.closeEditModal}
            onUpdate={this.updateProfilePic}
            onDeleteProfilePic={this.deleteProfilePic}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    loggedInUserProfilePic: state.user.loggedInUserProfilePic,
    loggedInUserUsername: state.user.loggedInUserUsername,
    loggedInUserFullName: state.user.loggedInUserFullName,
    loggedInUserPublicId: state.user.loggedInUserPublicId,
    token: state.user.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfilePicAndPublicId: (pic, publicId) =>
      dispatch(updateProfilePicAndPublicId(pic, publicId)),
    updateProfilePic: (pic) => dispatch(updateProfilePic(pic)),
    updateUsernameFullNameAndBio: (username, fullName, bio) =>
      dispatch(updateUsernameFullNameAndBio(username, fullName, bio)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
