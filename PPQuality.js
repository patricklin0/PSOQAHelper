console.log('--PureProject Helper--')
let spinner = undefined

function afterLoad() {
    if(spinner.childNodes.length === 0) {
        let testCaseExecutionTable = document.getElementById('testCaseExecutionTable')
        if(testCaseExecutionTable !== null) {
            let testingContainer = testCaseExecutionTable.childNodes[1]
            let bulkUpdateButton = testingContainer.childNodes[1]
            bulkUpdateButton.id = 'pph_bub'
            bulkUpdateButton.onclick = () => {
                let bub = document.getElementById('pph_bub')
                if(bub.innerHTML == 'Bulk Update') {
                    document.getElementById('pph_sab').disabled = true
                } else {
                    document.getElementById('pph_sab').disabled = false
                }
            }
            var selectAllButton = document.createElement('input')
            selectAllButton.id = 'pph_sab' // PureProjectHelper Select All Button
            selectAllButton.type = 'button'
            selectAllButton.value = 'Select All'
            selectAllButton.className = 'btn btn-sm mb-2'
            selectAllButton.style.marginLeft = '3px'
            selectAllButton.disabled = true
            selectAllButton.onclick = () => {
                let tableContainer = document.getElementById('testCaseExecutionTable')
                let tableRows = tableContainer.getElementsByClassName('mb-1')
                for(let i = 0; i < tableRows.length; i++) {
                    if(tableRows[i].childNodes[3].textContent === 'ID:') {
                        if(tableRows[i].childNodes[1].type === 'checkbox' && !tableRows[i].childNodes[1].checked) {
                            tableRows[i].childNodes[1].click()
                        }
                    }
                }
            }
            testingContainer.insertBefore(selectAllButton, testingContainer.childNodes[2])
        }
    }
}
chrome.runtime.onMessage.addListener(
    function(message, callback) {
        /* 
        if (message.message == "start"){ // Depreciated
            /*
            let tableContainer = document.getElementById('testCaseExecutionTable')
            let tableRows = tableContainer.getElementsByClassName('mb-1')
            for(let i = 0; i < tableRows.length; i++) {
                if(tableRows[i].childNodes[3].textContent === 'ID:') {
                    tableRows[i].childNodes[1].click()
                }
            }
            
        } else */
        if(message.message == 'reachQuality') {
            if(spinner === undefined) spinner = document.getElementById('spinner')
            spinner.addEventListener('DOMSubtreeModified', afterLoad, true)
        } else if(message.message == 'leaveQuality') {
            if(spinner === undefined) spinner = document.getElementById('spinner')
            spinner.removeEventListener('DOMSubtreeModified', afterLoad, true)
        }
    }
);