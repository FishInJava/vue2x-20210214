import Vue from 'vue';
import Router from 'vue-router';
import barChart from '../components/BarChart.vue';
import linkBoard from '../components/LinkBoard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "linkBoard",
      component: linkBoard,
    },
    {
      path: "/barChart",
      name: "barChart",
      component: barChart,
    },
  ],
});
