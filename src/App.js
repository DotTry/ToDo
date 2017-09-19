import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider, login2, logout2 } from './firebase.js';

class App extends Component {
  constructor() {
    super();
    //Initialize values
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
      viewall: false
    }
    //Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.viewAll = this.viewAll.bind(this);
    this.taskDone = this.taskDone.bind(this);
  }
  
  //Change text form
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  //firebase logout call
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  //Invert viewall flag
  viewAll(){
      this.setState({
            viewall: !this.state.viewall
          });

  }
  
  //////////NEW EDIT
  state = { loginMessage: null }
  loginSubmit = (e) => {
    this.setState(setErrorMsg(null))
    e.preventDefault()
    login2(this.email.value, this.pw.value) //Call firebase login
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
  }
  //submission of task. 
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items'); //fetch database items query
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
      done: false
    }
    itemsRef.push(item); //push the task. Task will have author data.
    
    this.setState({//Reset state for next task to be added. Text forms will be cleared
      currentItem: '',
      username: ''
    });
  }
  
  componentDidMount() {
    auth.onAuthStateChanged((user) => { //If current logged in user changes, update our state.
      if (user) {
        this.setState({ user });
      } 
    });
    const itemsRef = firebase.database().ref('items'); //Fetch our database for our todo activities
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          done: items[item].done
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) { //Find entry and remove activity
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  taskDone(itemId){ //update our entry with the done status
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    console.log(itemRef);
    itemRef.update({done:true});
  }
  
  render() {
    return (
      <div className='app'>
        <header>
            <div className="wrapper">
              <h2>To Do With Friends</h2>
              
              
              
          {this.state.user ?
                
                <button type="submit" onClick={this.logout} className="btn btn-primary">Logout</button>    
                
                :
                
                <form onSubmit={this.loginSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
                  </div>
                  {
                    this.state.loginMessage &&
                    <div className="alert alert-danger" role="alert">
                      <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                      <span className="sr-only">Error:</span>
                      &nbsp;{this.state.loginMessage} <a href="#" onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
                    </div>
                  }
                  
                  {this.state.user ?
                <button type="submit" onClick={this.logout} className="btn btn-primary">Logout</button>                
                :
                <button type="submit" className="btn btn-primary">Log In</button>              
                }
              
                </form>
          }
                
                
                
                
            </div>
        </header>
        {this.state.user ?
          <div>
            <div className='user-profile'>
                <img src={this.state.user.photoURL} />
            </div>
            <div className='container'>
              <section className='add-item'>
                    <form onSubmit={this.handleSubmit}>
                      <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.user.displayName || this.state.user.email} />
                      <input type="text" name="currentItem" placeholder="What to do?" onChange={this.handleChange} value={this.state.currentItem} />
                      <button>Add Item</button>
                    </form>
              </section>

              <section className='display-item'>
                  <div className="wrapper">
                    <ul> 
                      {this.state.items.map((item) => {
                      //Filter tasks by author
                      if(this.state.viewall && item.user === this.state.user.email || !(this.state.viewall))
                        return (
                          <li key={item.id}>
                          
                          {item.done ? <h1 >Done</h1> : <h1 > Not Done {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                <button onClick={() => this.taskDone(item.id)}> Finish</button>
                              : null}</h1> }
                          
                          
                          
                            <h3>{item.title}</h3> 
                            <p>Author: {item.user}
                              {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                <button onClick={() => this.removeItem(item.id)}><i className="fa fa-times" aria-hidden="true"></i> Remove Item</button>
                              : null}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
              </section>
            </div>
          </div>
        : 
          <p>You must be logged in to see the list and submit to it.</p>
        }
        <div className="footer"> <button onClick={this.viewAll}>View All Tasks</button>
        {this.state.viewall ? <span >ON</span> :<span > OFF</span> }
        
      </div>
      </div>
    );
  }
}

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export default App;