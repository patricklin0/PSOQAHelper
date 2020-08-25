let dropdownSource = null

chrome.runtime.onMessage.addListener(
    function(message, callback) {
        if(message.message == 'reachJIRA') {
            let body = document.getElementById('jira')
            body.addEventListener('DOMSubtreeModified', addDropDownButton, true)
        } 
    }
);

function addDropDownButton() {
    let dropdown = document.getElementById('AJS_DROPDOWN__24_drop')
    if(dropdown !== null) {
        if(document.getElementById('pureprojectButton') === null) {
            try {
                dropdownSource = dropdown.childNodes[0].childNodes[0].childNodes[2].childNodes[4].childNodes[0].href
                let dropdownNewList = dropdown.childNodes[0].childNodes[0].childNodes[3]
                let newLI = document.createElement('li')
                newLI.classList.add('aui-list-item')
                newLI.addEventListener('onmouseover', () => {
                    newLI.classList.add('active')
                })
                newLI.addEventListener('onmouseout', () => {
                    newLI.classList.remove('active')
                })
                let newButton = document.createElement('a')
                newButton.id = 'pureprojectButton'
                newButton.onclick = () => {
                    readJIRARSS()
                }
                newButton.classList.add('aui-list-item-link')
                newButton.innerHTML = 'PureProject'
                newLI.appendChild(newButton)
                dropdownNewList.appendChild(newLI)
            } catch (e) {

            }
        } else {
        }
    }
}

function readJIRARSS() {
    if(dropdownSource == null) return
    fetch(dropdownSource).then((res) => {
        res.text().then((htmlTxt) => {
            var domParser = new DOMParser()
            parseAndDownload(domParser.parseFromString(htmlTxt, 'text/html'))
        })
    }).catch(() => console.error('Error in fetching the website'))
}

function parseAndDownload(dom) {
    let issuesList = dom.getElementsByTagName('issue')[0].childNodes

    var title = dom.getElementsByTagName('title')[0].childNodes[0].nodeValue
    if(title === '' || title == null) title = 'Default'
    var row = []
    var data = []
    data.push(['Scenario','Objective','Data','Steps','Expected Results','Run Priority','Component']) // Headers

    try {
        for(let i = issuesList.length - 1; i >= 0; i--) {
            let currentIssue = issuesList[i]
            if(currentIssue.nodeName === '#text') continue
            let firstLevelNodes = currentIssue.childNodes[(currentIssue.childNodes.length-1)].childNodes
            for(let j = firstLevelNodes.length - 1; j >= 0; j--) {
                let node = firstLevelNodes[j]
                if(node.nodeName === '#text') continue
                if(node.localName == 'customfields') {
                    for(let k = node.childNodes.length - 1; k >= 0; k--) {
                        let finalNode = node.childNodes[k]
                        if(finalNode.nodeName === '#text') continue
                        if(finalNode.childNodes[1].innerHTML === 'Zephyr Teststep') {
                            row = []
                            let steps = finalNode.childNodes[3]
                            let stepContainer = steps.childNodes
                            let stepList = stepContainer[1].childNodes
    
                            let objective = currentIssue.childNodes[1].innerHTML + '\n' + removeTags(currentIssue.childNodes[7].innerText)

                            row.push(removeSymbols(title))                                          // Title
                            row.push(removeSymbols(objective)) // Objective
    
                            //row.push(removeTags(currentIssue.childNodes[7].innerText))
                            //row.push('')
    
                            var finalSteps = ''
                            var finalResults = ''
                            var finalData = ''
                            for(let l = 0; l < stepList.length; l++) {
                                if(stepList[l].nodeName === '#text') continue
                                let step = ''
                                step = stepList[l].childNodes[3].innerHTML
                                step = step.substring(12, step.length - 6)
                                
                                let theData = ''
                                theData = stepList[l].childNodes[5].innerHTML
                                theData = theData.substring(12, theData.length - 6)
    
                                let result = ''
                                result = stepList[l].childNodes[7].innerHTML
                                result = result.substring(12, result.length - 6)
    
                                if(l + 2 >= stepList.length) {
                                    if(allSpaces(result) || result == '') {
                                        finalResults += '>> ' + step + '\n'
                                    } else {
                                        finalSteps += '>> ' + step + '\n'
                                        finalResults += '>> ' + result + '\n'
                                    }
                                } else {
                                    if(!(allSpaces(step) || step == '')) {
                                        finalSteps += '>> ' + step + '\n'
                                    }
                                    if(!(allSpaces(result) || result == '')) {
                                        finalSteps += '>> ' + result + '\n'
                                    }
                                }
                                if(!allSpaces(theData)) finalData += '>> ' + theData + '\n'
                            }
                            row.push(removeSymbols(finalData))                                      // Data
                            row.push(removeSymbols(finalSteps))                                     // Steps
                            row.push(removeSymbols(finalResults))                                   // Expected Results
                            row.push('')                                                            // Run Priority
                            row.push('')                                                            // Component
                            data.push(row)
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.log(e)
        console.log('Parsing error. Please email search URL and resulting Excel to patrick.lin@genesys.com.')
    }

    try {
        var ws = XLSX.utils.aoa_to_sheet(data, { header:1, raw:true })
        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "TestCases")
        XLSX.writeFile(wb, "TestCases.xlsx")
    } catch(e) {
        console.log(e)
        console.log('XLSX Error. Please email search URL to patrick.lin@genesys.com')
    }

}

function removeTags(str) {
    if ((str===null) || (str===''))
    return false;
    else
    str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
}

function removeSymbols(str) {
    let gt = '&gt;'
    let lt = '&lt;'
    if ((str===null) || (str==='')) return false;

    str = str.toString()
    str = str.replace(gt, '>')
    str = str.replace(lt, '<')
    return str
}

 function allSpaces(input) {
     for(var i = 0; i < input.length; i++) {
        if(input.charAt(i) !== ' ') return false
     }
     return true
 }