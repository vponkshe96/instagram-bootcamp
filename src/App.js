import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_POSTS_KEY = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textInputValue: "",
      fileInputFile: "",
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  //adds data to db
  writeData = (input) => {
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, input);
  };

  //form handler
  handleTextChange = (e) => {
    this.setState({ textInputValue: e.target.value });
  };

  handleFileChange = (e) => {
    // e.target.files is a FileList object that is an array of File objects
    // e.target.files[0] is a File object that Firebase Storage can upload
    this.setState({
      fileInputFile: e.target.files[0],
    });
  };

  uploadSend = (e) => {
    e.preventDefault();
    this.writeData(this.state.textInputValue);
  };

  uploadImage = (e) => {
    e.preventDefault();
    //linking my storage bucket with app and telling it what to name user uploaded images
    const imageRef = storageRef(storage, `${this.state.fileInputFile.name}`);
    //upload image
    uploadBytes(imageRef, this.state.fileInputFile)
      //handling the success state of the promise, .then has access to the success value via callback, we ask it to return another promise
      .then(() => getDownloadURL(imageRef))
      //handling the second promise, success value is a the url of the uploaded image which is accessed via callback
      .then((downloadURL) => {
        const postListRef = databaseRef(database, DB_POSTS_KEY);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadURL,
          text: this.state.fileInputFile.name,
        });
        // Reset input field after submit
        this.setState({
          fileInputFile: null,
          textInputValue: "",
        });
      });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <form>
            <label>Write message</label>
            <br />
            <input
              type="input"
              value={this.state.textInputValue}
              onChange={this.handleTextChange}
            />
            <button onClick={this.uploadSend}>Send</button>
            <br />
            <br />
            <input
              type="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileChange}
            />
            <button onClick={this.uploadImage}>Upload</button>
            <ul>{messageListItems}</ul>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
