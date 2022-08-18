import React from 'react';
import { fetchUserData, cancelFetch } from './dataFetcher';
import { Userlist } from './Userlist';

export class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {userData :  null};
  }

//loading or fetching the data into userData
  loadUserData(){
    this.setState({userData : null})
    this.fetchID = fetchUserData(this.props.username, (userData) => {
  this.setState({ userData });
});
  }

//call method for loading user data when componnent mounts
  componentDidMount(){
    this.loadUserData();
  }

//canceling the fetch when <profile> unmounts
    //if we try to click on profile and back to dir quickly, the page will go back before its loaded which will make it load in the bg which take a lot of memory w bigger profile. so we want to cancel the loading if we go back before loading
    //make sure not to put this in the end.
    componentWillUnmount(){
      cancelFetch(this.fetchID);
    }

    componentDidUpdate(prevProps){
      if(this.props.username!==prevProps.username){
        cancelFetch(this.fetchID);
        this.loadUserData();
      }
    }

  render() {
    const isLoading = this.state.userData === null ? true : false;

    //showing up the name on the screen i.e lizard lady 
    const name = isLoading ? 'Loading...' : this.state.userData.name;  

    //showing up the bio for each user
    const bio = isLoading ? "Hello, how are you" : this.state.userData.bio;

    //showing up the pets friends 
    let friends = isLoading ? [] : this.state.userData.friends;

    let className = 'Profile';
    if (isLoading) {
      className += ' loading';
    } 
    

    return (
      <div className={className}>
        <div className="profile-picture">
          {!isLoading && <img src={this.state.userData.profilePictureUrl} alt="" />}
        </div>
        <div className="profile-body">
          <h2>{name}</h2>
          <h3>@{this.props.username}</h3>
          <p>{bio}</p>
          <h3>My friends</h3>
          <Userlist usernames={friends} onChoose={this.props.onChoose} />
        </div>
      </div>
    );
  }
}
