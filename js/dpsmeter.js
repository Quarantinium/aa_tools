/*
Created By Sukran / Quarantinium discord:quarantinium

*/
import { dt } from "./dt.js"
import { dialog } from "./dialog.js"
import { reader, REGEX } from "./reader.js"
import { chart } from "./chart.js"



const r = new reader()

const datatable = new dt(document.querySelector("#datatablesSimple"))
// console.log(datatable)
const dmgchart = new chart(document.getElementById("DMGchart"), "pie", {
    // options: {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            display: true
        },
        // zoom: {
        //     zoom: {
        //         wheel: {
        //             enabled: true,
        //         },
        //         pinch: {
        //             enabled: true
        //         },
        //         mode: 'xy',
        //     }
        // },

    },
    maintainAspectRatio: false,
    height: 268,
    width: 669
    // },
}
)
const dmg_timeline = new chart(document.getElementById("DMGtimeline"), "bar", {
    // options: {
    responsive: true,
    scales: {

    },
    plugins: {
        legend: {
            position: 'top',
            display: false
        },

        zoom: {
            // Enable zooming by dragging over the chart
            zoom: {
                wheel: {
                    enabled: true
                },

                mode: 'x'
            },
            limits: {
                y: { min: 0 },
            },
            // Enable panning
            pan: {
                enabled: true,
                // modifierKey: 'ctrl',
                mode: 'xy'
            }
        }

    },
    maintainAspectRatio: false,
    height: 300,
    width: 669
    // },
}
)

console.log(dmgchart)

new dialog(document.getElementById("LoadData"), document.getElementById("loadData-dialog"))
new dialog(document.getElementById("Observer"), document.getElementById("Observer-dialog"))
new dialog(document.getElementById("Timeframe"), document.getElementById("Timeframe-dialog"))
new dialog(document.getElementById("Inspect"), document.getElementById("Inspect-dialog"))
new dialog(document.getElementById("Blacklist"), document.getElementById("Blacklist-dialog"))
new dialog(document.getElementById("Mode"), document.getElementById("Mode-dialog"))
// console.log(d)

document.addEventListener("DOMContentLoaded", () => {
    //fight me its easier that way
    if (localStorage.getItem("Mode") == null)
        localStorage.setItem("Mode","dps")
    if (localStorage.getItem("blacklist") == null)
        localStorage.setItem("blacklist","Squad Horse\n")
    if (localStorage.getItem("Observer") == null)
        localStorage.setItem("Observer","yourname goes here")

    if (sessionStorage.getItem("Attacker") == null)
        sessionStorage.setItem("Attacker","")
    if (sessionStorage.getItem("end") == null)
        sessionStorage.setItem("end",Date.now())
    if (sessionStorage.getItem("start") == null)
        sessionStorage.setItem("start",Date.now() - 3600000)

    

    document.getElementById("blacklist_text").value = localStorage.getItem("blacklist")
    const Mode_select = document.getElementById("mode_select")
    Mode_select.value = localStorage.getItem("Mode")
    for(const item in REGEX){
        const option = document.createElement("option")
        option.value = item
        option.text = item
        Mode_select.appendChild(option)
    }
})

document.getElementById("loadData-dialog").querySelector("#dropArea").addEventListener('drop', e => {
    const data = r.handleDrop(e, datatable)
})
document.getElementById("loadData-dialog").querySelector("#dropArea").addEventListener('dragover', r.allowDrop)

document.getElementById("time_start").addEventListener("change", e => {
    sessionStorage.setItem("start", (Date.parse(e.target.value)))
})
document.getElementById("time_end").addEventListener("change", e => {
    sessionStorage.setItem("end", (Date.parse(e.target.value)))
})

document.getElementById("ObserverName").addEventListener("change", e => {
    localStorage.setItem("Observer", e.target.value)
})

document.getElementById("Inspect_name").addEventListener("change", e => {
    sessionStorage.setItem("Attacker", e.target.value)
    console.log(sessionStorage.Attacker)
})

document.getElementById("Redraw").addEventListener("click", e => {

    //why is it soo slow REE
    //by skill chart
    console.time("redraw")
    datatable.render()
    console.log("dt.render")
    console.timeLog("redraw")
    const dps_data = datatable.getTotalDps()
    const time_data = datatable.getTimedDps()
    console.log(dps_data)
    let labels = []
    let dmg = []
    console.log("dt.getdata")
    console.timeLog("redraw")
    dmgchart.updateLabels(Object.keys(dps_data))
    console.log(Object.keys(dps_data))
    console.log("dmgchart.updateLabels")
    console.timeLog("redraw")
    dmgchart.updateData(Object.values(dps_data).map(e => e.dmg))
    console.log(Object.values(dps_data).map(e => e.dmg))
    console.log("dmgchart.updateData")
    console.timeLog("redraw")
    dmgchart.updateBackgroundColors(Object.values(dps_data).map(e => e.color))
    console.log(Object.values(dps_data).map(e => e.color))
    console.log("dmgchart.updateBackgroundColors")
    console.timeLog("redraw")
    dmgchart.update()
    console.log("dmgchart.update")
    console.timeLog("redraw")
    console.timeEnd("redraw")
    // console.log(dps_data)
    //by time chart
    console.log(time_data)
    dmg_timeline.updateLabels(Object.keys(time_data).map(e => {
        // console.log(parseInt(e))
        const date = new Date(parseInt(e))
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        // console.log(date)
        return `${day}/${month}/${date.getFullYear()} ${hour}:${minute}`
    }))
    dmg_timeline.updateData(Object.values(time_data).map(e => e.dmg))
    dmg_timeline.update()

})

document.getElementById("downloadCSV").addEventListener("click", e => {
    const data = datatable.getTotalDpsforcsv()
    let content = "data:text/csv;charset=utf-8,"
    data.forEach(r => {
        const row = r.join(",")
        content += row + "\r\n"

    })
    const encodedUri = encodeURI(content)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "dps.csv")
    link.click()
})
document.getElementById("blacklist_text").addEventListener("change", e => {
    localStorage.setItem("blacklist", e.target.value)
    console.log(e.target.value)
})

document.getElementById("mode_select").addEventListener("change",e=>{
    localStorage.setItem("Mode",e.target.value)
})


// document.getElementById('dropArea').addEventListener('drop', handleDrop);
// document.getElementById('dropArea').addEventListener('dragover', allowDrop);