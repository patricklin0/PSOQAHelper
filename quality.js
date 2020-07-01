chrome.runtime.onMessage.addListener(
    function(message, callback) {
        if (message.message == "start"){
            let tableContainer = document.getElementById('testCaseExecutionTable')
            let tableRows = tableContainer.getElementsByClassName('mb-1')
            for(let i = 0; i < tableRows.length; i++) {
                if(tableRows[i].childNodes[3].textContent === 'ID:') {
                    tableRows[i].childNodes[1].click()
                }
            }
        }   
    }
);