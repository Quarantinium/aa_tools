export class dialog {
    constructor(domelement,dialogelement) {
        this.domelement = domelement
        this.dialogelement = dialogelement
        // this.d.getElementById('close').addEventListener('click', () => this.hide())
        this.domelement.addEventListener('click', (e) => {
            this.show()
        })
        this.dialogelement.querySelector(".close").addEventListener('click',e=>{
            this.hide()
        })
    }

    show() {
        // console.log("showing")
        this.dialogelement.showModal()
    }
    hide() {
        // console.log("closeing")
        this.dialogelement.close()
    }
}