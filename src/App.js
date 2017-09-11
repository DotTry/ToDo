import React, { Component } from 'react';
import fire, {auth, provider} from './fire.js';

var c = 10;
class App extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    //this.deleteMessage = this.deleteMessage(this);
    
    this.state = { 
      messages: [],
      currentItem: '',
      username: '',
      items: [],
      user: null // <-- add this line
    }; // <- set up react state
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messagesNum').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messagesNum').push( {value:this.inputEl.value, count:c++} );
    this.inputEl.value = ''; // <- clear the input
  }
  
  /*deleteMessage(e){
    console.log("ID: " + this.state.messages[0].id)
    fire.database().ref(this.state.messages[0].id).remove();
  }*/
  
  handleChange(e) {
    /* ... */
  }
  logout() {
    // we will add the code for this in a moment, but need to add the method now or the bind will throw an error
  }
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  
  render() {
    console.log(this.state.messages)
    const listItems = this.state.messages.map((todo) =>
            <li>
              {todo.text.value}
            </li>
          )
    //for( var t = 0; t < this.state.messages.length; t++ )
    //    console.log(this.state.messages[t].text.value + "??")
    return (
      <div>
      <form onSubmit={this.addMessage.bind(this)}>
        <input type="text" ref={ el => this.inputEl = el }/>
        <input type="submit"/>
        <ul>
          {
          listItems
            //this.state.messages.map( message => <li key={message[0]}>{message[0].value}</li> )
            //for( var t in this.state.messages )
            //  console.log(this.state.messages[t].text.value)
            //console.log(this.state.messages)
          }
        </ul>
        
      </form>
      
        
      <div className="wrapper">
        <h1>Fun Food Friends</h1>
        {this.state.user ?
          <button onClick={this.logout}>Log Out</button>                
          :
          <button onClick={this.login}>Log In</button>              
        }
      </div>

      </div>
      
    );
  }
}

export default App;