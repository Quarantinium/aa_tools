// import  GRAPH  from "./graph.js"

export const REGEX = {
    "dps": /^([0-9]*) \[(.*)] => \|.*;(.*)\|r attacked (.*)\|r using \|.{9}(.*)\|r\|r and caused \|.{9}-{0,1}([0-9]*).*Health/,
    "heal": /^([0-9]*) \[(.*)] => \|.*;(.*)\|r targeted (.*)\|r using \|.{9}(.*)\|r\|r.* \|.{9}([0-9]*).* health/,
    "debuff": /^([0-9]*) \[(.*)] => \|.*;(.*)\|(?:r|r's).*\|.{9}(.*)\|r\|r ((?:debuff cleared|debuff))/,
}

export class reader {

    constructor() {

    }



    allowDrop(event) {
        event.preventDefault();
    }

    handleDrop(event, dt) {
        event.preventDefault();

        const files = event.dataTransfer.files;

        if (files.length > 0) {
            const file = files[0];

            if (file.type === 'text/plain' || true) {
                const chunkSize = 1024 * 1024; // 1 MB chunk size (adjust as needed)
                let offset = 0;
                const per = document.getElementById('fileloading')
                if (files.length > 0) {
                    const file = files[0];

                    if (file.type === 'text/plain' || true) {

                        processLargeFile(file, dt)
                    } else {
                        console.error('Please drop a valid text file.');
                    }
                }
            }

            async function processLargeFile(file) {
                try {
                    const stream = await file.stream();
                    const reader = stream.getReader();
                    const chunkSize = 1024 * 1024; // 1 MB chunk size (adjust as needed)
                    let partialLine = '';
                    // const per = document.getElementById("fileloading")
                    let line_count = 0
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            // alert(`Processing done\nline processed: ${linecount}`)
                            // console.log(GRAPH.getDataSets("Sukran"))
                            // dt.render()
                            alert("Loaded")
                            break;
                        }

                        const chunkData = new TextDecoder().decode(value);

                        const lines = (partialLine + chunkData).split('\n');
                        partialLine = lines.pop();


                        lines.forEach(async line => {
                            // console.log('Line:', line);
                            line_count++
                            if (line_count % 10000 == 0) {
                                console.log(`${line_count} lines processed`)
                                // await new Promise((res,rej)=>{
                                //     setTimeout(res,100)
                                // })
                            }
                            for (let i in REGEX) {
                                const matches = REGEX[i].exec(line)
                                // console.log(matches)


                                if (matches) {
                                    const time = matches[1]
                                    const observer = matches[2]
                                    const attacker = matches[3]
                                    const victim = matches[4]
                                    const skill = matches[5]
                                    const dmg = matches[6]
                                    if (observer == localStorage.getItem("Observer")) {
                                        dt.addData([Number(time), attacker, victim, skill, Number(dmg)],i)

                                    }
                                    // console.log(observer,attacker, { time: time, dmg: dmg, victim: victim, skill: skill })
                                    // DPS[observer][attacker].push({ time: time, dmg: dmg, victim: victim, skill: skill })
                                    // GRAPH.addData(observer, attacker, { time: Number(time), dmg: Number(dmg), victim: victim, skill: skill })
                                    // GRAPH.setEarliestTime(Number(time))
                                    // GRAPH.setLatestTime(Number(time))
                                    // DPS[observer].push({ time: time, dmg: dmg, attacker: attacker, victim: victim, skill: skill })
                                }
                                // console.log('Line count:', linecount)
                                // per.textContent = line
                                // linecount++
                                // if (linecount % 100000 == 0) {
                                //     per.textContent = linecount
                                // }
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error processing the file:', error);
                }
            }
        } else {
            console.error('Please drop a valid text file.');
        }
    }


    displayFileContent(content) {
        const fileContentDiv = document.getElementById('fileContent');
        fileContentDiv.textContent = content;
    }

}
// document.getElementById('dropArea').addEventListener('drop', handleDrop);
// document.getElementById('dropArea').addEventListener('dragover', allowDrop);