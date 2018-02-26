Vue.component('star-rating', VueStarRating.default);

var app = new Vue({
  el: '#app',
  data: {
    number: '',
    max: '',
    current: {},
    loading: true,
    addedName: '',
    addedComment: '',
    comments: {},
    rating: 0,
    ratings: {},
  },
  created: function() {
    this.xkcd();
  },
  computed: {
    month: function() {
      var month = new Array;
      if (this.current.month === undefined)
  return '';
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month[this.current.month - 1];
    },
    starAverage: function() {
      if (!(this.number in this.ratings))
      return "No rating";
      else {
      average = this.ratings[this.number].sum / this.ratings[this.number].number;
      return average;
    }

    },
  },
  watch: {
    number: function(value,oldvalue) {
      if (oldvalue === '') {
         this.max = value;
      } else {
         this.xkcd();
      }
    },
  },
  methods: {
    xkcd: function() {
      fetch('https://xkcd.now.sh/' + this.number).then(response => {
  return response.json();
      }).then(json => {
  this.current = json;
  this.loading = false;
  this.number = json.num;
  return true;
      }).catch(err => {
        this.number = this.max;
      });
    },
    setRating: function(rating){
    // Handle the rating
    if (!(this.number in this.ratings))
    Vue.set(this.ratings,this.number,{sum:0,number:0});
    this.ratings[this.number].sum += rating;
    this.ratings[this.number].number += 1;

    },
    previousComic: function() {
      this.number = this.current.num - 1;
    },
    nextComic: function() {
      this.number = this.current.num + 1;
    },
    getRandom: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomComic: function() {
      this.number = this.getRandom(1, this.max);
    },
    firstComic: function() {
      this.number = 1;
    },
    lastComic: function() {
      this.number = this.max;
    },
    addComment: function() {
      if (!(this.number in this.comments))
      Vue.set(app.comments, this.number, new Array);
      this.comments[this.number].push({author:this.addedName,text:this.addedComment, date:formatAMPM(new Date())});
      this.addedName = '';
      this.addedComment = '';

      //using your function (passing in date)
      function formatAMPM(date) {
        // gets the hours
        var hours = date.getHours();
        // gets the day
        var days = date.getDay();
        // gets the month
        var minutes = date.getMinutes();
        // gets AM/PM
        var ampm = hours >= 12 ? 'pm' : 'am';
        // converts hours to 12 hour instead of 24 hour
        hours = hours % 12;
        // converts 0 (midnight) to 12
        hours = hours ? hours : 12; // the hour '0' should be '12'
        // converts minutes to have leading 0
        minutes = minutes < 10 ? '0'+ minutes : minutes;

        // the time string
        var time = hours + ':' + minutes + ' ' + ampm;

        // gets the match for the date string we want
        var match = date.toString().match(/\w{3} \w{3} \d{1,2} \d{4}/);

        //the result
        return match[0] + ' ' + time;
    }
  },


}

});