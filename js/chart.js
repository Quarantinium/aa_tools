

// const config = {
//     type: 'pie',
//     data: data,
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Chart.js Pie Chart'
//         }
//       }
//     },
//   };

export class chart {
  constructor(domelement,type,config) {
    this.config = config
    this.chart = new Chart(domelement.getContext('2d'), {
      type: type,
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      },
      options: this.config
    })
  }
  updateData(data) {
    // console.log(`updating data with`)
    // console.log(data)
    this.chart.data.datasets[0].data = data
  }
  updateLabels(labels) {
    // console.log(`updating labels with`)
    // console.log(labels)
    this.chart.data.labels = labels
  }
  updateBackgroundColors(colors) {
    // console.log(`updating colors with`)
    // console.log(colors)
    this.chart.data.datasets[0].backgroundColor = colors
  }

  update() {
    this.chart.update()
  }


}

