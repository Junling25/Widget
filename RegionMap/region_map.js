/* 异步获取js */
var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
      $.getScript(src, resolve)
  })
}



(function () {
  const template = document.createElement('template')
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%; position: relative;">
        </div>
      `
  class Main extends HTMLElement {
      constructor() {
          super()

          this._shadowRoot = this.attachShadow({ mode: 'open' })
          this._shadowRoot.appendChild(template.content.cloneNode(true))

          this._root = this._shadowRoot.getElementById('root')
          //this._isRendered = false;

          //this._eChart = null
          //this._selectedDataPoint = {}
          this._props = {};

          this.render()
          //document.addEventListener('propertiesChanged', this.MapSettingChanged);
      }
      
      async render() {
        //var ROOT_PATH = 'https://echarts.apache.org/examples';
       
        await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js')
        const myChart = echarts.init(this._root)

        //var option;
        myChart.showLoading();
        $.get('https://junling25.github.io/Widget/RegionMap/HK.json', function (geoJson)  {
          myChart.hideLoading();
          echarts.registerMap('HK', geoJson);
          myChart.setOption(
            (option = {
              title: {
                text: '地图测试',
                subtext: 'Data from Wikipedia',
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} (p / km2)'
              },
              toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                  dataView: { readOnly: false },
                  restore: {},
                  saveAsImage: {}
                }
              },
              visualMap: {
                min: 800,
                max: 50000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                  color: ['lightskyblue', 'yellow', 'orangered']
                }
              },
              series: [
                {
                  name: '地图测试',
                  type: 'map',
                  map: 'HK',
                  label: {
                    show: true
                  },
                  data: [
                    { name: '中西区', value: 20057.34 },
                    { name: '湾仔', value: 15477.48 },
                    { name: '东区', value: 31686.1 },
                    { name: '南区', value: 6992.6 },
                    { name: '油尖旺', value: 44045.49 },
                    { name: '深水埗', value: 40689.64 },
                    { name: '九龙城', value: 37659.78 },
                    { name: '黄大仙', value: 45180.97 },
                    { name: '观塘', value: 55204.26 },
                    { name: '葵青', value: 21900.9 },
                    { name: '荃湾', value: 4918.26 },
                    { name: '屯门', value: 5881.84 },
                    { name: '元朗', value: 4178.01 },
                    { name: '北区', value: 2227.92 },
                    { name: '大埔', value: 2180.98 },
                    { name: '沙田', value: 9172.94 },
                    { name: '西贡', value: 3368 },
                    { name: '离岛', value: 806.98 }
                  ],
                  // 自定义名称映射
                  nameMap: {
                    'Central and Western': '中西区',
                    Eastern: '东区',
                    Islands: '离岛',
                    'Kowloon City': '九龙城',
                    'Kwai Tsing': '葵青',
                    'Kwun Tong': '观塘',
                    North: '北区',
                    'Sai Kung': '西贡',
                    'Sha Tin': '沙田',
                    'Sham Shui Po': '深水埗',
                    Southern: '南区',
                    'Tai Po': '大埔',
                    'Tsuen Wan': '荃湾',
                    'Tuen Mun': '屯门',
                    'Wan Chai': '湾仔',
                    'Wong Tai Sin': '黄大仙',
                    'Yau Tsim Mong': '油尖旺',
                    'Yuen Long': '元朗'
                  }
                }
              ]
              
            })
          );
        });
        //eChart.setOption(option);
      };
    }
  customElements.define('com-sac-sample-echarts-regionmap', Main)
})()
