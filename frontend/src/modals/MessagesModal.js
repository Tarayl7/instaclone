import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { connect } from 'react-redux';
import { LayoutOfSearchedUsers } from '../components/Layouts';

Modal.setAppElement('#root');

class MessagesModal extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            inputValue: '',
            clickedUserId: '',
            clickedUserProfilePic: '',
            clickedUserUsername: '',
            clickedUserFullName: '',
            users: []
        }
    };

    componentDidMount = () => {
        // Get all users
        axios.get('user', {
            headers: {
                'x-auth-token': this.props.token
            }
        })
            .then(res => {
                this.setState({
                    users: res.data,
                    filteredUsers: res.data
                })
            })
    };

    componentDidUpdate = () => {
        if (this.props.isModalUpdated) {
            this.setState({
                clickedUserId: '',
                clickedUserProfilePic: '',
                clickedUserUsername: '',
                clickedUserFullName: '',
                inputValue: ''
            });

        // Set isModalUpdated to false
        this.props.setModalUpdatedToFalse();
        }
    }

    getClickedUserInfo = (clickedUserId, clickedUserProfilePic, clickedUserUsername, clickedUserFullName) => {
        this.setState({
            clickedUserId,
            clickedUserProfilePic,
            clickedUserUsername,
            clickedUserFullName
        })
    };

    onChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    };

    addUser = () => {
        // Get recipeint usernames from messages
        const usernamesOfRecipients = this.props.messages.map(user => user.recipientUsername);

        // If no messages between the two users
       if (!usernamesOfRecipients.includes(this.state.clickedUserUsername)) {
            axios.put('user/messages/add_user/' + this.props.loggedInUserId, {
                recipientId: this.state.clickedUserId,
                recipientUsername: this.state.clickedUserUsername,
                recipientFullName: this.state.clickedUserFullName,
                recipientProfilePic: this.state.clickedUserProfilePic            
            })
       };

           // Close messages modal
           this.props.closeMessagesModal();

           // Update messages page
           this.props.updateMessagesPage(this.state.clickedUserId, this.state.clickedUserProfilePic ,this.state.clickedUserUsername);

    };

    render() {

        const filteredUsers = this.state.users.filter(user => {
            return user.username.toLowerCase().includes(this.state.inputValue.toLowerCase());
        }).map((user, index) => {
            return(
                <div key={index}>
                    <LayoutOfSearchedUsers 
                        user={user} 
                        getClickedUserInfo={this.getClickedUserInfo}
                        />
                </div>
            )
        });

        return(
            <Modal isOpen={this.props.messagesModalIsOpen} onRequestClose={this.props.closeMessagesModal} style={
                {
                  overlay: {
                    backgroundColor: 'rgba(55, 55, 55, 0.8)',
                  },
                  content: { 
                    top: '8rem',
                    width: '25rem',
                    height: '25rem',
                    margin: '0 auto',
                    borderRadius: '3%',
                    overflow: 'hidden',
                    padding: '0'
                  }
                }
              }>
                <div>
                    <div className='messages-modal-top'>
                        <div onClick={this.props.closeMessagesModal}>
                            <i className="fa fa-times messages-modal-times-icon"></i>
                        </div>
                        <div>
                            New Message
                        </div>
                        <div>
                        <   button className='messages-modal-button' onClick={this.addUser}>Next</button>
                        </div>
                    </div>
                    <div>
                        <form className='messages-modal-form'>
                          { 
                            this.state.clickedUserUsername === '' ? 
                            <div className='messages-modal-truthy-div'>
                                <label className='messages-modal-label'>To: </label> 
                                <input className='messages-modal-input' type='text' placeholder='Search...' onChange={this.onChange} />
                                
                            </div> : 
                            <div className='messages-modal-falsy-div'>
                                <label className='messages-modal-label'>To: </label>
                                <span className='messages-modal-span'>{this.state.clickedUserUsername}</span>
                                <input className='messages-modal-input' type='text' value={this.state.inputValue} placeholder='search' onChange={this.onChange} />
                            </div> 
                          }
                        </form>
                    </div>
                    <div>
                        <p className='messages-modal-suggested-text'>Suggested</p>
                    </div>
                    <div className='messages-modal-filtered-users'>
                        {filteredUsers}
                    </div>
                </div>
              </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInUserId: state.user.loggedInUserId,
        token: state.user.token
    }
};

export default connect(
    mapStateToProps,
    null
)(MessagesModal);