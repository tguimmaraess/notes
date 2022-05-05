
const storageHelper = {

  /**
   * Gets all notes in reverse (last to first)
   *
   * @returns array
   */
  getNotesInReverseOrder() {
    return JSON.parse(localStorage.getItem("notes") || "[]").sort(function(b, a){return 0});
  },

  /**
   * Gets all notes in regular order
   *
   * @returns array
   */
  getAllNotes() {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  },

  /**
   * Takes an array to save in local storage and returns
   * @param {array} item
   * @returns void
   */
  saveNewNote(item) {
    //Gets all notes saved in local storage and
    const items = this.getNotesInReverseOrder();

    //Adds a new item to the start of the array
    items.unshift(item);

    //Adds the array in local storage with the new values
    localStorage.setItem("notes", JSON.stringify(items));
  },

  /**
   * Edits a note
   *
   * @param {string} title
   * @param {string} content
   * @param {string} date
   * @param {int} id
   * @returns void
   */
  editNote(title, content, date, id) {
    //Gets note array from local storage containing all notes
    const items = this.getAllNotes();

    //Defines a new value for certain index with title and content
    items[id] = [title, content, date];

    //Defines "notes" array in local storage with new values
    localStorage.setItem("notes", JSON.stringify(items));
  },

  /**
   * Deletes a note by its id (position in array)
   *
   * @param {int} id
   * @returns void
   */
  deleteNote(id) {
    //Gets the array from local storage containing all notes
    const items = this.getAllNotes();

    //Deletes the note from the array based on its id (position/index)
    items.splice(id, 1)

    //Defines "notes" array in local storage with new values
    localStorage.setItem("notes", JSON.stringify(items))
  },

  /**
   * Counts all notes
   *
   * @returns int
   */
  countNotes() {
    return JSON.parse(localStorage.getItem("notes") || '[]').length
  }

}

export default storageHelper;
