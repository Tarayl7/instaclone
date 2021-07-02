import React from "react";
import { navigate } from "@reach/router";

export const LayoutOfComments = (props) => {
  return (
    <div className="layout-of-comments-container">
      <img
        className="layout-of-comments-profile-pic"
        src={props.comment.profilePic}
        alt=""
        onClick={props.navigateToUserPage.bind(this, props.comment.id)}
      />
      <p
        className="layout-of-comments-username"
        onClick={props.navigateToUserPage.bind(this, props.comment.id)}
      >
        {props.comment.username}
      </p>
      <p className="layout-of-comments-comment">{props.comment.comment}</p>
    </div>
  );
};

export const LayoutOfDisplayedMessages = (props) => {
  return (
    <div className="layout-of-messages-container">
      {props.user.username !== props.loggedInUserUsername ? (
        <div className="layout-of-messages-truthy-div">
          <div>
            <img
              className="layout-of-messages-profile-pic"
              src={props.user.profilePic}
              alt=""
            />
          </div>
          <div>
            <p className="layout-of-messages-truthy-message">
              {props.user.message}
            </p>
          </div>
        </div>
      ) : (
        <div className="layout-of-messages-falsy-div">
          <div>
            <img
              className="layout-of-messages-profile-pic"
              src={props.user.profilePic}
              alt=""
            />
          </div>
          <div>
            <p className="layout-of-messages-falsy-message">
              {props.user.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const LayoutOfPost = (props) => {
  return (
    <div className="layout-of-post-container">
      <div className="layout-of-post-img-and-p-div">
        <img
          className="layout-of-post-profile-pic"
          src={props.post.profilePic}
          alt=""
          onClick={props.navigateToUserPage.bind(this, props.post.userId)}
        />
        <p
          className="layout-of-post-username"
          onClick={props.navigateToUserPage.bind(this, props.post.userId)}
        >
          {props.post.username}
        </p>
      </div>
      <div>
        {props.post.type === "image" ? (
          <img className="layout-of-post-image" src={props.post.url} alt="" />
        ) : (
          props.post.type === "video" && (
            <video
              className="layout-of-post-video"
              src={props.post.url}
            ></video>
          )
        )}
      </div>
      <div className="layout-of-post-icons">
        {props.usernamesOfPostLikes.includes(props.loggedInUserUsername) ? (
          <i
            className="fa fa-heart layout-of-post-heart-icon-truthy"
            onClick={props.changeLikes.bind(
              this,
              props.post._id,
              props.post.likes
            )}
          ></i>
        ) : (
          <i
            className="fa fa-heart layout-of-post-heart-icon-falsy"
            onClick={props.changeLikes.bind(
              this,
              props.post._id,
              props.post.likes
            )}
          ></i>
        )}
        <i
          className="fa fa-comment layout-of-post-comment-icon"
          onClick={props.openPostModal.bind(this, props.post._id)}
        ></i>
        <i
          className="fa fa-envelope layout-of-post-envelope-icon"
          onClick={() => navigate("/messages")}
        ></i>
      </div>
      {props.post.likes.length === 1 ? (
        <div className="layout-of-post-likes">
          <p>
            Liked by{" "}
            <span
              className="layout-of-post-first-span"
              onClick={props.navigateToUserPage.bind(this, props.post.userId)}
            >
              {props.post.likes[0].username}
            </span>
          </p>
        </div>
      ) : (
        props.post.likes.length > 1 && (
          <div className="layout-of-post-likes">
            <p>
              Liked by{" "}
              <span
                className="layout-of-post-first-span"
                onClick={props.navigateToUserPage.bind(this, props.post.userId)}
              >
                {props.post.likes[0].username}
              </span>{" "}
              and{" "}
              <span
                className="layout-of-post-second-span"
                onClick={props.openLikesModal.bind(this, props.post._id)}
              >
                others
              </span>
            </p>
          </div>
        )
      )}
      <div className="layout-of-post-caption-div">
        <p
          className="layout-of-post-username"
          onClick={props.navigateToUserPage.bind(this, props.post.userId)}
        >
          {props.post.username}
        </p>
        <p className="layout-of-post-caption">{props.post.caption}</p>
      </div>
      {props.post.comments.length === 1 ? (
        <div
          className="layout-of-post-comment"
          onClick={props.openPostModal.bind(this, props.post._id)}
        >
          View comment
        </div>
      ) : (
        props.post.comments.length > 1 && (
          <div
            className="layout-of-post-comment"
            onClick={props.openPostModal.bind(this, props.post._id)}
          >
            View comments
          </div>
        )
      )}
      <div>
        <form
          className="layout-of-post-form"
          onSubmit={props.handleSubmit.bind(this, props.post._id, props.index)}
        >
          <input
            className="layout-of-post-input"
            value={props.inputValue}
            placeholder=" Add a comment..."
            onChange={props.onChange.bind(this, props.index)}
          />
          {props.inputValue === "" ? (
            <button className="layout-of-post-button-truthy" type="submit">
              Post
            </button>
          ) : (
            <button className="layout-of-post-button-falsy" type="submit">
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export const LayoutOfRecipientUsers = (props) => {
  return (
    <div
      className="layout-of-searched-users-container"
      onClick={props.displayMessages.bind(
        this,
        props.user.recipientId,
        props.user.recipientProfilePic,
        props.user.recipientUsername
      )}
    >
      <div className="layout-of-searched-users-profile-pic-and-name">
        <div>
          <img
            className="layout-of-searched-users-profile-pic"
            src={props.user.recipientProfilePic}
            alt=""
          />
        </div>
        <div className="layout-of-searched-users-username-and-full-name-div">
          <div>{props.user.recipientUsername}</div>
          <div className="layout-of-searched-users-full-name">
            {props.user.recipientFullName}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LayoutOfSearchedUsers = (props) => {
  return (
    <div
      className="layout-of-searched-users-container"
      onClick={props.getClickedUserInfo.bind(
        this,
        props.user._id,
        props.user.profilePic,
        props.user.username,
        props.user.fullName
      )}
    >
      <div className="layout-of-searched-users-profile-pic-and-name">
        <div>
          <img
            className="layout-of-searched-users-profile-pic"
            src={props.user.profilePic}
            alt=""
          />
        </div>
        <div className="layout-of-searched-users-username-and-full-name-div">
          <div>{props.user.username}</div>
          <div className="layout-of-searched-users-full-name">
            {props.user.fullName}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LayoutOfUsers = (props) => {
  return (
    <div className="layout-of-users-container">
      <div className="layout-of-users-profile-pic-and-name">
        <div>
          <img
            className="layout-of-users-profile-pic"
            src={props.user.profilePic}
            alt=""
            onClick={props.navigateToUserPage.bind(this, props.user.id)}
          />
        </div>
        <div className="layout-of-users-username-and-full-name-div">
          <div
            className="layout-of-users-username"
            onClick={props.navigateToUserPage.bind(this, props.user.id)}
          >
            {props.user.username}
          </div>
          <div className="layout-of-users-full-name">{props.user.fullName}</div>
        </div>
      </div>
      <div>
        <button
          onClick={props.toggle.bind(
            this,
            props.user.id,
            props.user.username,
            props.user.fullName,
            props.user.profilePic
          )}
          style={{
            display: props.user.display,
            backgroundColor: props.user.buttonBackgroundColor,
            color: props.user.buttonTextColor,
          }}
          className="layout-of-users-button"
          type="submit"
        >
          {props.user.buttonText}
        </button>
      </div>
    </div>
  );
};
