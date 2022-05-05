//Date object
var today = new Date();

const dateTimeHelper = {

  formatTodaysDate() {
    return today.getFullYear()+'-'+('0'+today.getMonth()).slice(-2)+'-'+('0'+today.getDate()).slice(-2);
  },


  formatTodaysTime() {
    return ('0'+today.getHours()).slice(-2)+':'+('0'+today.getMinutes()).slice(-2)+':'+('0'+today.getSeconds()).slice(-2);
  }

}

export default dateTimeHelper;
