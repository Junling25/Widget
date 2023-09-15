var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const chartdom = document.createElement('template')
  chartdom.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class Sampledemo extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(chartdom.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    async render (resultSet2) {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const chart = echarts.init(this._root)

      const region = []
      const channel = []

      var revenueA =[];
      var revenueB =[];
      var revenueC =[];
      var revenueD =[];

      for (var i=0; i<resultSet2.length;i++){
	
        	var pro = resultSet2[i]["ID_4j181g05s5"].description;
	
          if (region.indexOf(pro) === -1) {
           region.push(pro);
           }
	
	
	        var chan = resultSet2[i]["ID_2r2z313k3n"].description;
        	 if (channel.indexOf(chan) === -1) {
           channel.push(chan);
           }
	

	       if (resultSet2[i]["ID_2r2z313k3n"].description ==="电商") {
	      	var revenue = Number(resultSet2[i]["@MeasureDimension"].rawValue);
	      	revenueA.push(revenue);
        	}

         	else if (resultSet2[i]["ID_2r2z313k3n"].description ==="百货") {
	      	revenue = Number(resultSet2[i]["@MeasureDimension"].rawValue);
      		revenueB.push(revenue);
        	}
	
        	else if (resultSet2[i]["ID_2r2z313k3n"].description ==="直营") {
	        revenue = Number(resultSet2[i]["@MeasureDimension"].rawValue);
        	revenueC.push(revenue);
        	}
	        else if (resultSet2[i]["ID_2r2z313k3n"].description ==="购物") {
	        revenue = Number(resultSet2[i]["@MeasureDimension"].rawValue);
       	revenueD.push(revenue);
       	}
}

      console.log(region)
      console.log(channel)

      const option = {
        angleAxis: {
          type: 'category',
          data: region
      },
      radiusAxis: {
      },
      polar: {
      },
      series: [{
          type: 'bar',
          data: revenueA,
          coordinateSystem: 'polar',
          name: '电商',
          stack: 'a',
          emphasis: {
              focus: 'series'
          }
      }, {
          type: 'bar',
          data: revenueB,
          coordinateSystem: 'polar',
          name: '百货',
          stack: 'a',
          emphasis: {
              focus: 'series'
          }
      }, {
          type: 'bar',
          data: revenueC,
          coordinateSystem: 'polar',
          name: '直营',
          stack: 'a',
          emphasis: {
              focus: 'series'
          }
      },{
        type: 'bar',
        data: revenueD,
        coordinateSystem: 'polar',
        name: '购物',
        stack: 'a',
        emphasis: {
            focus: 'series'
        }
    },],
      legend: {
          show: true,
          data: channel
      }
  };
    
      chart.setOption(option)
    }
  }

  customElements.define('sapecharts-chartdom', Sampledemo)
})()