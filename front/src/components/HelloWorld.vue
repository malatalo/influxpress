<template>
    <div class="hello">
        <div id="app-6">
            <p v-on:click="randomPlace">{{ stuff.locTitle }}</p>
            <p><input v-model="stuff.loc"></p>
            <p v-on:click="randomTemp"> {{ stuff.tempTitle }}</p>
            <p><input v-model="stuff.temp"></p>
            <button v-on:click="getMessage">Get Messages</button>
            <button v-on:click="sendMessage">Send Message</button>
            <p>{{ stuff.message }}</p>
        </div>
        <p v-for="d in stuff.temps">
            {{ d.time + ", " + d.loc + ", " + d.temp }}
        </p>
    </div>
</template>

<script>
import axios from 'axios';

let places = ["space","home","work","lab","outside","Turku"];

export default {
  name: "HelloWorld",
  data: function () {
    return {
        stuff: {    
            message  : ".",
            locTitle : "Location",
            loc      : "",
            tempTitle: "Temperature",
            temp     : "",
            temps    : []
        }
    }
  },
  props: {
    
  },
  methods: {
    sendMessage: function() {
        this.stuff.message = "Sent: " + this.stuff.loc + ", " + this.stuff.temp;
        setTimeout(() => { this.stuff.message = "." }, 5000);
        let data = JSON.stringify({
            loc : this.stuff.loc,
            temp: this.stuff.temp
        });
        axios.post('http://localhost:3000/post', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        this.stuff.temp = this.stuff.loc = "";
    },
    getMessage: function() {
        axios.get('http://localhost:3000/temps')
        .then(response => {
            this.stuff.temps = response.data;
        });
    },
    randomTemp: function() {
        this.stuff.temp = Math.floor(Math.random() * (250 - 160) + 160 ) / 10;
    },
    randomPlace: function() {
        this.stuff.loc = places[Math.floor(Math.random() * (places.length - 1) + 1 )];
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding        : 0;
}
li {
  display: inline-block;
  margin : 0 10px;
}
a {
  color: #42b983;
}
p {
     -webkit-touch-callout: none;
     -webkit-user-select  : none;
     -khtml-user-select   : none;
     -moz-user-select     : none;
     -ms-user-select      : none;
     user-select          : none;
}
</style>
