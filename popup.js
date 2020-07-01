document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('select_all_checkboxes')
    link.addEventListener('click', () => {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
        });
    })
})