// import { getCloudInstance } from '../../utils/tcb';

Component({
  options: {
    virtualHost: true,
  },
  data: {
    __html: '',
  },
  properties: {
    value: {
      type: String,
      value: '',
    },
    className: {
      type: String,
      value: '',
    },
    style: {
      type: String,
      value: '',
    },
  },
  methods: {
    updateValue() {
      let initValue = (this.properties.value || '')
        .toString()
        .replace(/<img /g, `<img style="max-width:100%;height:auto" `)
        .replace(/<pre>/g, `<pre class="pre">`)
        .replace(/<blockquote>/g, `<blockquote class="blockquote">`)
        .replace(/<table/g, `<table class="table" `)
        .replace(/<th/g, `<th class="th" `)
        .replace(/<td/g, `<td class="td" `)
        .replace(/<p>/g, `<p class="p"> `)
        .replace(/<ul>/g, `<ul class="ul"> `)
        .replace(/<a>/g, `<a class="a"> `)
        .replace(/<hr/g, `<hr class="hr" `)
        .replace(/<ol>/g, `<ol class="ol"> `);
      this.setData({ __html: initValue });
      console.log('ryan',initValue)
    },
  },
  observers: {
    value() {
      this.updateValue();
    },
  },
});
