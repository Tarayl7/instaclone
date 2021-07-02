import React from "react";
import axios from "axios";
import { navigate, Redirect } from "@reach/router";
import { connect } from "react-redux";

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fullName: "",
      username: "",
      password: "",
      errorMsg: "",
    };
  }

  onChange = (e) => {
    if (e.currentTarget.name === "email") {
      this.setState({
        email: e.currentTarget.value,
      });
    } else if (
      e.currentTarget.name === "full name" &&
      e.currentTarget.value.length <= 15
    ) {
      this.setState({
        fullName: e.currentTarget.value,
      });
    } else if (
      e.currentTarget.name === "username" &&
      e.currentTarget.value.length <= 15
    ) {
      this.setState({
        username: e.currentTarget.value,
      });
    } else if (e.currentTarget.name === "password") {
      this.setState({
        password: e.currentTarget.value,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const userInfo = {
      email: this.state.email,
      fullName: this.state.fullName,
      username: this.state.username,
      password: this.state.password,
    };

    // If sign up successful, go to login page. Else send error message
    if (
      this.state.email !== "" &&
      this.state.fullName !== "" &&
      this.state.username !== "" &&
      this.state.password.length >= 6
    ) {
      axios
        .post("user/sign_up", userInfo)
        .then(() => {
          navigate("/");
        })
        .catch((e) => {
          this.setState({
            errorMsg: e.response.data,
          });
        });
    }
  };

  render() {
    if (this.props.token !== "")
      return <Redirect from="" to="/homepage" noThrow />;

    return (
      <div className="sign-up-container">
        <div className="sign-up-top-box">
          <h1 className="sign-up-h1">Instaclone</h1>
          <p className="sign-up-friendly-msg">
            Sign up to see photos and videos from your friends.
          </p>
          <form className="sign-up-form" onSubmit={this.handleSubmit}>
            <input
              className="sign-up-input"
              type="text"
              value={this.state.email}
              name="email"
              placeholder=" Email"
              onChange={this.onChange}
            />
            <input
              className="sign-up-input"
              type="text"
              value={this.state.fullName}
              name="full name"
              placeholder=" Full Name"
              onChange={this.onChange}
            />
            <input
              className="sign-up-input"
              type="text"
              value={this.state.username}
              name="username"
              placeholder=" Username"
              onChange={this.onChange}
            />
            <input
              className="sign-up-input"
              type="password"
              value={this.state.password}
              name="password"
              placeholder=" Password"
              onChange={this.onChange}
            />
            {this.state.email === "" ||
            this.state.fullName === "" ||
            this.state.username === "" ||
            this.state.password.length < 6 ? (
              <button className="sign-up-button-truthy" type="submit">
                Sign up
              </button>
            ) : (
              <button className="sign-up-button-falsy" type="submit">
                Sign up
              </button>
            )}
          </form>
        </div>
        <div className="sign-up-bottom-box">
          <p>
            Have an account?{" "}
            <a className="sign-up-a-tag" href="/">
              Log in
            </a>
          </p>
        </div>
        <div className="sign-up-error-msg">
          <p>{this.state.errorMsg}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  };
};

export default connect(mapStateToProps, null)(SignUp);
