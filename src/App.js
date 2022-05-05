import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ModalDialog from 'react-bootstrap/ModalDialog';
import Modal from 'react-bootstrap/Modal';
import React, { useState, setState, ref } from 'react';
import ReactDOM from 'react-dom';

//Helpers
import dateTimeHelper from './helpers/dateTimeHelper';
import storageHelper from './helpers/storageHelper';

function App() {

  const [showAddNewNoteModal, setShowAddNewNoteModal] = useState(false); //Add note modal state (true or false, if true, shows the modal)

  const [showEditModal, setShowEditModal] = useState(false); //Edit note modal state (true or false, if true, shows the modal)

  const [editNoteTitle, setEditNoteTitle] = useState(''); //Constant that contains the note title to display in the edit modal

  const [editNoteContent, setEditNoteContent] = useState('');  //Constant that contains the note text to display in the edit modal

  const [date, setDate] = useState(''); //Variable that contains the date that the note was added (this goes in a hidden input in edit modal)

  const [noteId, setNoteId] = useState(''); //Contains the note id (array index)

  const [showDeleteAlert, setShowDeleteAlert] =  useState(false); //Shows an alert asking if the user wants to delete a note

  const [noteQuantity, setNoteQuantity] = useState(''); //Number of notes

  const noteTitle = React.createRef(); //Note title reference used to get the value from the modal

  const noteContent = React.createRef(); //Note Text reference used to get the value from the modal

  const noteDate = React.createRef(); //Note date reference used to get the value from the modal

  //Opens the "Add New Note" Modal
  function newNote() {
    setShowAddNewNoteModal(true);
  }

  //Opens the Edit Modal, filling inputs with data from local storage
  function openEditNoteModal(eve) {
    //Opens the edit modal
    setShowEditModal(true);

    //Gets notes array from local storage containing all notes ordered by index ascending
    const items = storageHelper.getNotesInReverseOrder();

    //Gets the note id from the modal
    var id = eve.target.id;

    //Sets all inputs and values with respective data
    setEditNoteTitle(items[id][0]); //Defines the title of the note
    setEditNoteContent(items[id][1]);  //Defines the text of the note
    setDate(items[id][2]);  //Defines the date of the note to fill the hidden input
    setNoteId(id); //Defines the id of the note (position in array)
  }


  //Edits a note by its id
  function execEditNote(id) {
    //Saves the edits, passing the ref value of each input as well as the id of the note that's is being edited
    storageHelper.editNote(noteTitle.current.value, noteContent.current.value, noteDate.current.value, id);

    //Closes edit modal
    setShowEditModal(false);

    //Renders notes
    showNotes();
  }


  //Shows the delete note alert modal, defining the id of the note that was chosen
  function deleteNoteAlert(eve) {
    setShowDeleteAlert(true);
    setNoteId(eve.target.id);
  }


  //Deletes a note
  function deleteNote(id) {
    //Closes delete alert
    setShowDeleteAlert(false);

    //Deletes a note by its id
    storageHelper.deleteNote(id);

    //Rerenders the notes
    showNotes();
    countNotes();
  }


  //Adds a new note
  function saveNote() {
    //Formated date
    var date = dateTimeHelper.formatTodaysDate();

    //Formated time
    var time = dateTimeHelper.formatTodaysTime();

    //Defines an array of notes with title, content and date
    var item = [
        noteTitle.current.value,
        noteContent.current.value,
        'Note added on '+ date +', at '+ time
      ];

    //Saves a new note in local storage
    storageHelper.saveNewNote(item);

    //Closes the modal
    setShowAddNewNoteModal(false);

    //Displays all notes
    showNotes();
    countNotes();
  }


  function showNotes() {
    //Gets all notes
    var items = storageHelper.getNotesInReverseOrder();

    /* HTML Elements Variables */
    var noteCardContainer = [];
    var noteCard =  [];
    var noteTitle = [];
    var noteContent = [];
    var noteDate  = [];
    var noteTime  = [];
    var notes = [];
    var noteEditButton = [];
    var noteDeleteButton = [];
    var noteHeader  = [];

    //Loops through array of notes
    for (var i = 0; i < items.length; i++) {

      //Creates the card header element
      noteHeader[i] = React.createElement(
        'p',
        {className: 'noteheader'}
      );

      //Creates h2 title element with note title
      noteTitle[i] = React.createElement(
        'h2',
        {className: 'card-title'},
        items[i][0]
      );

      //Creates p element with note content
      noteContent[i] = React.createElement(
        'p',
        {className: 'card-text'},
        items[i][1]
      );

      //Creates span element with date the note was addded
      noteDate[i] = React.createElement(
        'p',
        {className: 'notedate'},
        items[i][2]
      );

      //Creates edit button for each note passing the id of the note and on click function to edit the note
      noteEditButton[i] = React.createElement(
        'span',
        {
          className: 'notebutton primary',
          id: [i],
          onClick: (eve) => openEditNoteModal(eve)
        },
        String.fromCharCode("9998")
      );

      //Creates delete button for each note passing the id of the note and on click function to delete the note
      noteDeleteButton[i] = React.createElement(
        'span',
         {
           className: 'notebutton danger',
            id: [i],
            onClick: (eve) => deleteNoteAlert(eve)
          },
          String.fromCharCode("10005")
        );

      //Creates card element (sub-container) for each note
      noteCard[i] = React.createElement(
        'div',
        {className: 'card-body mt-5'},
        noteDate[i], noteHeader[i],
        noteTitle[i],
        noteContent[i],
        noteEditButton[i],
        noteDeleteButton[i]
      );

      //Creates card element container for each note, containing all information
      noteCardContainer[i] = React.createElement(
        'div',
        {className: 'col-sm-4 note fold'},
        noteCard[i]
      );

      notes.push(noteCardContainer[i]) //Appends all results and elements to a single array
    }

    //Renders the notes
    ReactDOM.render(
      <>
        {notes}
      </>,
      document.getElementById('notes')
    );
  }

  //Counts all notes
  function countNotes() {
    setNoteQuantity(storageHelper.countNotes());
  }


  /*
  Adds a delay before calling functions in order to give time for the component to mount/load,
  consequently avoiding invalid DOM errors
  */
  setTimeout(() => {
    showNotes()
    countNotes()
  }, 0)

  //JSX
  return (
    <>
      {/* Add New Note Button*/}
      <div className="App">
        <Button variant="primary mt-5 btn-xxl" onClick={newNote}>+ Create Note</Button>
      </div>

      {/* Displays the number of notes */}
      <div className="mt-5 text-center">
        <p className="h4 text-muted">You have {noteQuantity} notes</p>
      </div>

      {/* Displays all notes */}
      <div className="row mx-auto mt-5 mb-5" id="notes">
      </div>

        {/* Add New Note Modal*/}
        <Modal show={showAddNewNoteModal} onHide={() => setShowAddNewNoteModal(false)} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Title</label>
              <input type="text" ref={noteTitle} className="mb-5 form-control" />
              <label>Note</label>
              <textarea ref={noteContent} className="form-control"></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddNewNoteModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => saveNote(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Note Modal*/}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Edit a note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Title</label>
              <input type="text" ref={noteTitle} defaultValue={editNoteTitle} className="mb-5 form-control" />
              <label>Note</label>
              <textarea  ref={noteContent} className="form-control" defaultValue={editNoteContent}></textarea>
              <input type="hidden" ref={noteDate} defaultValue={date} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => execEditNote(noteId)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Note Modal*/}
        <Modal show={showDeleteAlert} onHide={() => setShowDeleteAlert(false)} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Delete note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this note?</p>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAlert(false)}>
            Cancel
          </Button>
            <Button variant="danger" onClick={() => deleteNote(noteId)} >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
}

export default App;
