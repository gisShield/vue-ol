<template>
  <div id="app">
    <div id="map" >

    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      mymap: "",
      msg: 'Welcome to Your Vue.js App'

    }
  },
  mounted:function(){
    this.mymap = this.initMap()
    this.overlay=""
    this.tool=""
    this.event=""
    this.menu=""
    this.control=""
    this.layer=""
  },
  methods:{
    initMap(){
      let mymap = this.$VueOpenlayers.init({
        element:'map',
        center:[0,0]
      })
      let layer = this.$VueOpenlayers.setFLayer({
        layerType:'title',
        sourceType:'osm',
      })
      this.$VueOpenlayers.addFLayer('osm',layer)
      return mymap;
    },
  }
}
</script>

<style>
#app {
  margin: 0px;
  padding: 0px;
  height: 570px;
  width: 100%;
}
#map{
  float: left;
  position: relative;
  width: 64%;
}
</style>
