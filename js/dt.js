// https://datatables.net/extensions/datetime/examples/integration/datatables.html
// DataTable.ext.search.push(function (settings, data, dataIndex) {
//     let min = Number.parseInt(sessionStorage.start )/1000
//     let max = Number.parseInt(sessionStorage.end) /1000
//     let date = new Date(data[0]);
//     console.log(data)

//     if (
//         (min === null && max === null) ||
//         (min === null && date <= max) ||
//         (min <= date && max === null) ||
//         (min <= date && date <= max)
//     ) {
//         return true;
//     }
//     return false;
// });

// Create date inputs
// minDate = new DateTime('#min', {
//     format: 'MMMM Do YYYY'
// });
// maxDate = new DateTime('#max', {
//     format: 'MMMM Do YYYY'
// });




import { MD5 } from "./md5.js"
import { REGEX } from "./reader.js"

let date_cache = {}
let attacker_cache = {}
let blacklist_cache = {}
export class dt {
    constructor(domelement) {
        // this.DOMid = DOMid
        // this.datatable = new DataTable(DOMid)
        this.datatable = new DataTable(`#${domelement.id}`, {
            "paging": true,
            "deferRender": true

        })
        this.datatable
        this.datasets = {}
        for (const i of Object.keys(REGEX)) {
            this.datasets[i] = []
        }
    }

    addData(data, mode) {
        this.datasets[mode].push(data)
    }

    render() {
        // console.log("adding row")
        const min = Number.parseInt(sessionStorage.start) / 1000
        const max = Number.parseInt(sessionStorage.end) / 1000
        this.datatable.clear().draw()
        // let elemet_count = 0
        // for (const element of this.datasets)
        // // this.datasets.forEach(async element => 
        // {
        //     const date = element[0]
        //     elemet_count++
        //     if (elemet_count % 1000 == 0) {
        //         console.log(`${elemet_count} / ${this.datasets.length} sleeping to again not murder browser`)
        //         await new Promise((res, rej) => { setTimeout(res, 500) })
        //     }
        //     if (
        //         (min === null && max === null) ||
        //         (min === null && date <= max) ||
        //         (min <= date && max === null) ||
        //         (min <= date && date <= max)
        //     ) {
        //         this.datatable.row.add(element).draw(true)
        // this.datatable.rows.add(this.datasets)
        // console.log(this.datasets.length)
        let data = this.getData().filter((element, index, arr) => {
            // const date = element[0]
            // const attacker = elemet[1]
            const date = element[0]
            const attacker = element[1]
            const victim = element[2]
            const skill = element[3]
            const dmg = element[4]
            // console.log([date,attacker,victim,skill,dmg])
            // console.log(((min === null && max === null) ||
            // (min === null && date <= max) ||
            // (min <= date && max === null) ||
            // (min <= date && date <= max)) && 
            // sessionStorage.getItem("Attacker") != null &&
            // (sessionStorage.getItem("Attacker") == attacker || 
            // sessionStorage.getItem("Attacker") == "") &&
            // localStorage.getItem("blacklist") != null &&
            // localStorage.getItem("blacklist").match(victim) == null)
            const date_check = this.date_check(min, max, date)
            const attacker_check = this.attacker_check(attacker)
            const blacklist_check = this.blacklist_check(victim)
            // console.log(date_check , attacker_check , blacklist_check)
            // if(date_check && attacker_check && blacklist_check)
            //     console.log(element)

            return date_check && attacker_check && blacklist_check
        })
        data = data.map(element => {
            // console.log(element)
            const date = new Date(element[0])
            // const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            // const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
            // const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
            // const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
            // const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
            return [this.format_date(date), element[1], element[2], element[3], element[4]]
        })
        this.datatable.rows.add(data).draw(true)
        // this.datatable.column(0).data().filter((date, index) => {
        //     return (min === null && max === null) ||
        //         (min === null && date <= max) ||
        //         (min <= date && max === null) ||
        //         (min <= date && date <= max)
        // }).draw(true)

        //     }
        // }
        // )
        // this.datatable.draw(true)
    }
    format_date(ts) {
        const date = new Date(ts * 1000)
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        return `${day}/${month}/${date.getFullYear()} ${hour}:${minute}:${second}`
    }

    getData() {
        return this.datasets[localStorage.getItem("Mode")]
    }
    date_check(ts_min, ts_max, ts) {
        // if (!date_cache[ts])
            // date_cache[ts] = ((ts_min === null && ts_max === null) ||
            //     (ts_min === null && ts <= ts_max) ||
            //     (ts_min <= ts && ts_max === null) ||
            //     (ts_min <= ts && ts <= ts_max))
        // console.log(min,max,date)
        return ((ts_min === null && ts_max === null) ||
            (ts_min === null && ts <= ts_max) ||
            (ts_min <= ts && ts_max === null) ||
            (ts_min <= ts && ts <= ts_max))
        return date_cache[ts]
    }
    attacker_check(attacker) {

        // if (!attacker_cache[attacker])
            // return attacker_cache[attacker] = sessionStorage.getItem("Attacker") != null && (sessionStorage.getItem("Attacker") == attacker.trim() || sessionStorage.getItem("Attacker") == "")
        return sessionStorage.getItem("Attacker") != null && (sessionStorage.getItem("Attacker") == attacker.trim() || sessionStorage.getItem("Attacker") == "")
        return attacker_cache[attacker]
    }

    blacklist_check(victim) {
        // if (!blacklist_cache[victim])
            //  blacklist_cache[victim] = localStorage.getItem("blacklist") != null && localStorage.getItem("blacklist").match(victim.trim()) == null
            return localStorage.getItem("blacklist") != null && localStorage.getItem("blacklist").match(victim.trim()) == null
        return blacklist_cache[victim]
    }

    getTotalDps() {
        let data = {}
        date_cache = {}
        attacker_cache = {}
        blacklist_cache = {}
        const min = Number.parseInt(sessionStorage.start) / 1000
        const max = Number.parseInt(sessionStorage.end) / 1000
        for (const element of this.getData()) {
            
            const [date, attacker, victim, skill, dmg] = element
            if(date > max) break
            if(!this.date_check(min, max, date)) continue
            if(!this.attacker_check(attacker)) continue
            if(!this.blacklist_check(victim)) continue
            // if (!(date_check && attacker_check && blacklist_check)) continue
            
            if (!data[skill]) {
                data[skill] = {
                    dmg: 0,
                    //fight me it ensures same colors everytime :pepeshrug:
                    color: `#${MD5(skill).slice(0, 6)}`
                }

            }
            // console.log(element)
            // console.log(`adding ${dmg} to ${skill}`)
            data[skill]["dmg"] = data[skill]["dmg"] + dmg
        }
        return data
    }

    getTimedDps() {
        let data = {}
        date_cache = {}
        attacker_cache = {}
        blacklist_cache = {}
        const min = Number.parseInt(sessionStorage.start) / 1000
        const max = Number.parseInt(sessionStorage.end) / 1000
        for (const element of this.getData()) {
            const [date, attacker, victim, skill, dmg] = element
            const date_check = this.date_check(min, max, date)
            const attacker_check = this.attacker_check(attacker)
            const blacklist_check = this.blacklist_check(victim)
            if (!(date_check && attacker_check && blacklist_check)) continue
            const time_frame = new Date(date * 1000)
            time_frame.setSeconds(0)
            if (!data[time_frame.getTime()]) {
                data[time_frame.getTime()] = {
                    dmg: 0,
                    //fight me it ensures same colors everytime :pepeshrug:
                    // color: `#${MD5(skill).slice(0, 6)}`
                }

            }
            // console.log(element)
            // console.log(`adding ${dmg} to ${skill}`)
            data[time_frame.getTime()]["dmg"] = data[time_frame.getTime()]["dmg"] + dmg
        }
        return data
    }

    getTotalDpsforcsv() {
        let data = []
        date_cache = {}
        attacker_cache = {}
        blacklist_cache = {}
        const min = Number.parseInt(sessionStorage.start) / 1000
        const max = Number.parseInt(sessionStorage.end) / 1000
        for (const element of this.getData()) {
            const [date, attacker, victim, skill, dmg] = element
            const date_check = this.date_check(min, max, date)
            const blacklist_check = this.blacklist_check(victim)
            if (!(date_check && blacklist_check)) continue

            data.push([date, this.format_date(date), attacker, victim, skill, dmg])
        }
        return data
    }

    getModes() {
        return Object.keys(REGEX)
    }
}
