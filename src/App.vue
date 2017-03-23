<template>
  <div id="app">
    <router-view></router-view>
    <Spin size="large" fix v-show="isLoading" class="loading"></Spin>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState(['isLoading'])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 160px;
}
.loading {
  opacity: 0.8;
}
</style>
