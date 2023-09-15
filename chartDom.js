var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const bardemotest = document.createElement('template')
  bardemotest.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class Samplebardemo extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(bardemotest.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    async render (resultSet) {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const chart = echarts.init(this._root)
      
      var month = [];

      var sale =[];
      var revenue =[];
 
       for (var i=0; i<resultSet.length;i++){
	
	     if(resultSet[i]["@MeasureDimension"].description==="销量")
	     {
        	var sales = Number(resultSet[i]["@MeasureDimension"].rawValue);
        	sale.push(sales);
      	}
    	if(resultSet[i]["@MeasureDimension"].description ==="收入"){
	       var revenues = Number(resultSet[i]["@MeasureDimension"].rawValue);
      	 revenue.push(revenues);
	     }
	

	     var month1=resultSet[i]["ID_4h4o2c3k3n"].description;
	      if (month.indexOf(month1) === -1) {
          month.push(month1);
        }
	
}
console.log(sale);
console.log(revenue);
console.log(month);

      const option = {
        title: {
          text: '',
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: ['收入', '销量']
      },
      toolbox: {
          show: true,
          feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      calculable: true,
      xAxis: [
          {
              type: 'category',
              data: month
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: [
          {
              name: '收入',
              type: 'bar',
              data: revenue,
              markPoint: {
                  data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                  ]
              },
              markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
              }
          },
          {
              name: '销量',
              type: 'bar',
              data: sale,
              markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
              },
              markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
              }
          }
      ]
    };
    
      chart.setOption(option)
    }
  }

  customElements.define('sapecharts-bardemotest', Samplebardemo)
})()
