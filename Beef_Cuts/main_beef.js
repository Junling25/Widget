var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
     const parseMetadata = metadata => {
      const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
      const dimensions = []           //dimension数组，key为类似dimension_0，用来读取data对应项
      for (const key in dimensionsMap) {
          const dimension = dimensionsMap[key]
          dimensions.push({ key, ...dimension })
      }
      const measures = []             //mesaure数组，key为类似measure_0，用来读取data对应项
      for (const key in measuresMap) {
          const measure = measuresMap[key]
          measures.push({ key, ...measure })
      }
      return { dimensions, measures, dimensionsMap, measuresMap }
    }

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

      set dataBinding (dataBinding) {
        if (this._dataBinding !== dataBinding) {
        this._dataBinding = dataBinding
        this.render()
        }
      }

      getSelectedDataPoint () {
        return this._selectedDataPoint
      }
  
    async render () {
      if (!this._dataBinding || this._dataBinding.state !== 'success') { return }
      const { data, metadata } = this._dataBinding

      if (!data || data.length === 0) {
        return;
      }
      const { dimensions, measures } = parseMetadata(metadata)
      // dimension         
      const result= []
      data.forEach(row => {
        if (row['dimensions_0'] && row['dimensions_0'].label) {
        const item = {
          name: row['dimensions_0'].label,
          value: [
              row['measures_0'].raw.toFixed(2)
          ]
            };
            result.push(item);
         }
        });

        if (!result || result.length === 0) {
          return;
        }
        
      console.log('data',data)
      console.log('result',result)
        
      await getScriptPromisify('https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js')

        const eChart = this._eChart = echarts.init(this._root, 'main')
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
                data: result,
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
