import React from 'react';
import axios from 'axios';
import { Redirect } from '@reach/router';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import MessagesModal from '../modals/MessagesModal';
import { LayoutOfDisplayedMessages, LayoutOfRecipientUsers } from './Layouts';

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recipientId: '',
            recipientProfilePic: '',
            recipientUsername: '',
            inputValue: '',
            messages: [],
            displayedMessages: [],
            recipientMessages: [],
            messagesModalIsOpen: false,
            isUpdated: false,
            isModalUpdated: false
        }
    }

    componentDidMount = () => {
        // Get logged in user messages
        axios.get('user/' + this.props.loggedInUserId, {
            headers: {
                'x-auth-token': this.props.token
            }
        })
            .then(res => {
                this.setState({
                    messages: res.data.messages
                })
            })
    };

    componentDidUpdate = () => {     
        if (this.state.isUpdated) {
            // Get logged in user messages and display the messages between the two users
             axios.get('user/' + this.props.loggedInUserId, {
                headers: {
                    'x-auth-token': this.props.token
                }
                })
                .then(res => {
                    this.setState({
                        messages: res.data.messages,
                        displayedMessages: res.data.messages.filter(user => user.recipientUsername === this.state.recipientUsername).map(message => message.messagesBetweenRecipient)[0],
                        isUpdated: false
                    })
                })
        };
    };

    displayMessages = (recipientId, recipientProfilePic, recipientUsername) => {
        // Get messages between the two users
        const displayedMessages = this.state.messages.filter(user => user.recipientUsername === recipientUsername).map(message => message.messagesBetweenRecipient)[0];

        this.setState({
            displayedMessages,
            recipientId,
            recipientProfilePic,
            recipientUsername
        })

    };

    openMessagesModal = () => {
        this.setState({
           messagesModalIsOpen: true
          })
    };

    closeMessagesModal = () => {
        this.setState({
            messagesModalIsOpen: false,
            isModalUpdated: true
        })
      };

    setModalUpdatedToFalse = () => {
        this.setState({
            isModalUpdated: false
        })
    };

    updateMessagesPage = (id, profilePic, username) => {
        this.setState({
            recipientId: id,
            recipientProfilePic: profilePic,
            recipientUsername: username,
            isUpdated: true
        })
    }

    onChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        // If input value in not empty
        if (this.state.inputValue !== '') {
            // Get the recipient's messages
            await axios.get('user/' + this.state.recipientId, {
                headers: {
                    'x-auth-token': this.props.token
                }
            })
                .then(res => {
                    this.setState({
                        recipientMessages: res.data.messages
                    })
                })

        // array of usernames in recipient's messages
        const usernamesOfRecipientMessages = this.state.recipientMessages.map(user => { return user.recipientUsername });

        // If the recipient has not messaged the logged in user, then send message and add user
        if (!usernamesOfRecipientMessages.includes(this.props.loggedInUserUsername)) {
            
           axios.put('user/messages/' + this.props.loggedInUserId, {
                recipientUsername: this.state.recipientUsername,
                id: this.props.loggedInUserId,
                profilePic: this.props.loggedInUserProfilePic,
                username: this.props.loggedInUserUsername,
                message: this.state.inputValue, 
            });
    
            axios.put('user/messages/add_user/' + this.state.recipientId, {
                recipientId: this.props.loggedInUserId,
                recipientUsername: this.props.loggedInUserUsername,
                recipientFullName: this.props.loggedInUserFullName,
                recipientProfilePic: this.props.loggedInUserProfilePic,
                messagesBetweenRecipient: []
            })
    
            axios.put('user/messages/' + this.state.recipientId, {
                recipientUsername: this.props.loggedInUserUsername,
                id: this.props.loggedInUserId,
                profilePic: this.props.loggedInUserProfilePic,
                username: this.props.loggedInUserUsername,
                message: this.state.inputValue, 
            });
  
        // Else just send message
        } else {
            
            axios.put('user/messages/' + this.props.loggedInUserId, {
                recipientUsername: this.state.recipientUsername,
                id: this.props.loggedInUserId,
                profilePic: this.props.loggedInUserProfilePic,
                username: this.props.loggedInUserUsername,
                message: this.state.inputValue, 
            });
      
            axios.put('user/messages/' + this.state.recipientId, {
                recipientUsername: this.props.loggedInUserUsername,
                id: this.props.loggedInUserId,
                profilePic: this.props.loggedInUserProfilePic,
                username: this.props.loggedInUserUsername,
                message: this.state.inputValue, 
            });
           
        };

        this.setState({
            inputValue: '',
            isUpdated: true
        })
        }
    };

    render() {

        if (this.props.token === '') return <Redirect from='' to='/' noThrow />

        const recipients = this.state.messages.map((user, index) => {
            return(
                <div key={index}>
                    <LayoutOfRecipientUsers 
                        user={user} 
                        displayMessages={this.displayMessages}
                    />
                </div>
            )
        });

        const displayedMessages = this.state.displayedMessages.map((user, index) => {
            return(
                <div key={index}>
                    <LayoutOfDisplayedMessages 
                        user={user}
                        loggedInUserUsername={this.props.loggedInUserUsername}
                    />
                </div>
            )
        })
        
        return(
            <div>
                <Navbar />
                <div className='messages-container'>
                    <div className='messages-left-box'>
                        <div className='messages-left-top-box'>
                            <p className='messages-username'>{this.props.loggedInUserUsername}</p>
                            <button className='messages-select-user' onClick={this.openMessagesModal}>
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className='messages-recipients'>
                            {recipients}
                        </div>
                    </div>
                    {
                        this.state.recipientUsername === '' ?
                        <div></div> :
                        <div className='messages-right-box'>
                            <div className='messages-right-top-box'>
                                <img className='messages-recipient-profile-pic' src={this.state.recipientProfilePic} alt='' />
                                <p className='messages-recipient-username'>{this.state.recipientUsername}</p>
                            </div>
                            <div className='messages-right-bottom-box'>
                                <div className='messages-displayed-messages-div'>
                                    {displayedMessages}
                                </div>
                                <form className='messages-form' onSubmit={this.handleSubmit}>
                                    <input className='messages-input' type='text' value={this.state.inputValue} onChange={this.onChange} />
                                    {
                                        this.state.inputValue === '' ?
                                        <button className='messages-button-truthy'>Send</button> :
                                        <button className='messages-button-falsy'>Send</button>
                                    }
                                </form>
                            </div>
                        </div>
                    }
                </div>
                <MessagesModal 
                    searchedUserUsername={this.state.searchedUserUsername}
                    messagesModalIsOpen={this.state.messagesModalIsOpen}
                    closeMessagesModal={this.closeMessagesModal}
                    updateMessagesPage={this.updateMessagesPage}
                    messages={this.state.messages}
                    isModalUpdated={this.state.isModalUpdated}
                    setModalUpdatedToFalse={this.setModalUpdatedToFalse}
                />
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        loggedInUserId: state.user.loggedInUserId,
        loggedInUserProfilePic: state.user.loggedInUserProfilePic,
        loggedInUserUsername: state.user.loggedInUserUsername,
        loggedInUserFullName: state.user.loggedInUserFullName,
        token: state.user.token
    }
};

export default connect(
    mapStateToProps,
    null
)(Messages)