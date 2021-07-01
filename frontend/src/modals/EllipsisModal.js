import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

Modal.setAppElement('#root');

class EllipsisModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }

  componentDidMount = () => {
    // Get usernames of the post likes
    const usernamesOfPostLikes = this.props.postLikes.map(user => { return user.username });

    if (usernamesOfPostLikes.includes(this.props.loggedInUserUsername)) {
      this.setState({
        text: 'unLike post'
      })
    } else {
      this.setState({
        text: 'like post'
      })
    }
  };

  changeLikes = () => {
    this.props.changeLikes();

    if (this.state.text === 'like post') {
      this.setState({
        text: 'unLike post'
      })
    } else {
      this.setState({
        text: 'like post'
      })
    }
  };

  render() {
    return(
      <Modal isOpen={this.props.ellipsisModalIsOpen} onRequestClose={this.props.closeEllipsisModal} style={
          {
            overlay: {
              backgroundColor: 'rgba(55, 55, 55, 0.8)',
              zIndex: '2'
            },
            content: { 
              top: '15rem',
              width: '18rem',
              height: '6.5rem',
              margin: '0 auto',
              borderRadius: '3%',
              padding: '0',
              border: 'none'
            }
          }
        }>  
        <div>
          {
            this.props.currentPageOn === 'profile-page' ?
            <div>
              <div className='ellipsis-modal-delete-post' onClick={this.props.deletePost}>Delete Post</div>              
              <div className='ellipsis-modal-cancel' onClick={this.props.closeEllipsisModal}>Cancel</div>
            </div> :
            this.props.currentPageOn === 'homepage' ? 
            <div>
              <div className='ellipsis-modal-navigate' onClick={this.props.navigateToUserPage(this.props.postUserId)}>Go to posts</div>
              <div className='ellipsis-modal-cancel' onClick={this.props.closeEllipsisModal}>Cancel</div>
            </div> :
            <div>
              <div className='ellipsis-modal-text' onClick={this.changeLikes}>{this.state.text}</div>
              <div className='ellipsis-modal-cancel' onClick={this.props.closeEllipsisModal}>Cancel</div>
            </div>
          }       
        </div>                              
        </Modal>
  )
  }
};

const mapStateToProps = state => {
  return {
    loggedInUserId: state.user.loggedInUserId,
    currentPageOn: state.user.currentPageOn,
    postUserId: state.posts.postUserId,
    postLikes: state.posts.postLikes
  }
};

export default connect(
  mapStateToProps,
  null
)(EllipsisModal);