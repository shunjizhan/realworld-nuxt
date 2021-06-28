import Vue from 'vue';
import dayjs from 'dayjs';

// usage: {{ value | 过滤器(dayjs) }}
Vue.filter('date', (value, format='YYYY.MM.DD') => {
  return dayjs(value).format(format);
});