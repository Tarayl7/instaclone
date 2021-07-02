import React from "react";
import axios from "axios";
import { navigate, Redirect } from "@reach/router";
import { connect } from "react-redux";
import { authorizeUser } from "../redux";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: "",
      password: "",
      errorMsg: "",
    };
  }

  onChange = (e) => {
    if (e.currentTarget.name === "email or username") {
      this.setState({
        emailOrUsername: e.currentTarget.value,
      });
    } else {
      this.setState({
        password: e.currentTarget.value,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const loginInputFields = {
      emailOrUsername: this.state.emailOrUsername,
      password: this.state.password,
    };

    // If login successful, go to homepage. Else send error message
    if (this.state.emailOrUsername !== "" && this.state.password.length >= 6) {
      axios
        .post("user/login", loginInputFields)
        .then((res) => {
          // user information
          const user = res.data;

          // Put user information in redux store
          this.props.authorizeUser(user);

          navigate("/homepage");
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
      <div className="login-container">
        <div className="login-top-box">
          <h1 className="login-h1">Instaclone</h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input
              className="login-input"
              type="text"
              value={this.state.emailOrUsername}
              name="email or username"
              placeholder=" Email or Username"
              onChange={this.onChange}
            />
            <input
              className="login-input"
              type="password"
              value={this.state.password}
              name="password"
              placeholder=" Password"
              onChange={this.onChange}
            />
            {this.state.emailOrUsername === "" ||
            this.state.password.length < 6 ? (
              <button className="login-button-truthy" type="submit">
                Log In
              </button>
            ) : (
              <button className="login-button-falsy" type="submit">
                Log In
              </button>
            )}
          </form>
        </div>
        <div className="login-bottom-box">
          <p>
            Don't have an account?{" "}
            <a className="login-a-tag" href="/sign-up">
              Sign up
            </a>
          </p>
        </div>
        <div className="login-error-msg">
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

const mapDispatchToProps = (dispatch) => {
  return {
    authorizeUser: (userInfo) => dispatch(authorizeUser(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
