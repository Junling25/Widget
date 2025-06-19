var getScriptPromisify = (src) => {
  return new Promise(resolve => {
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

  class BeefCuts extends HTMLElement {
      constructor () {
        super()

        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this._root = this._shadowRoot.getElementById('root')
        this._isRendered = false;

        this._eChart = null
        this._selectedDataPoint = {}
        this._props = {};
  
        this.render()
      }
      
    getSelectedDataPoint () {
        return this._selectedDataPoint
      }
  
    async render (resultSet) {
      await getScriptPromisify('https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js')
      //const eChart = this._eChart = echarts.init(this._root, 'main')
      const eChart = echarts.init(this._root)
        if (!resultSet || resultSet.length === 0) {
          return;
        }
        
      var length=resultSet.length;
      console.log('result',resultSet)
      //取数据并设置MAP需要的数组
      const labels = [];
      const values = [];
      for (let i=0; i<length;i++){
           let lab = resultSet[i]["ID_264y6h04q5"].description;
           if (labels.indexOf(lab) === -1) {
                labels.push(lab);
              }
           let val = Number(resultSet[i]["@MeasureDimension"].rawValue);
              values.push(val); 
          }
        console.log("labels");
        console.log(labels);
        console.log(values);
        
       const data = values.map((label, index) => ({ value: label, name: labels[index] }));
       console.log(data);
        

        //this._eChart.showLoading();

        $.get('https://junling25.github.io/Widget/RegionMap/beef_cuts_france.svg', (svg) =>{
          echarts.registerMap('beef_cuts_france', { svg: svg });

          const option = {
            tooltip: {},
            visualMap: {
              left: 'center',
              bottom: '10%',
              //min: this._props.minvalue || 0,
              //max: this._props.maxvalue || 100,
              min:5,
              max:10000,
              orient: 'horizontal',
              text: ['', 'Price'],
              realtime: true,
              calculable: true,
              inRange: {
                color: ['#dbac00', '#db6e00', '#cf0000']
              }
            },
            series: [
              {
                name: 'Beef Cuts',
                type: 'map',
                map: 'beef_cuts_france',
                roam: true,
                emphasis: {
                  label: {
                    show: false
                  }
                },
                selectedMode: false,
                data: data,
              }
            ]
          };
        
        eChart.setOption(option);
      });

      eChart.on('click',   (params)=> {
        const { seriesIndex, seriesName, dataIndex, data, name } = params
        this._selectedDataPoint = { seriesIndex, seriesName, dataIndex, data, name }
        this.dispatchEvent(new Event('onClick'))
      })      
    }

    dispose () {
      if (this._echart) {
        echarts.dispose(this._echart);
      }
    }
  }

  customElements.define('com-beef-cuts-echarts', BeefCuts)
})()
