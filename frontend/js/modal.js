// Custom Modal Dialog for Plugin Alerts
function showPluginAlert(title, message, type) {
    // Create custom modal dialog
    var modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
    `;
    
    var dialog = document.createElement('div');
    var bgColor = type === 'error' ? '#ffebee' : '#e8f5e8';
    var borderColor = type === 'error' ? '#f44336' : '#4caf50';
    
    dialog.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        width: 70vw;
        max-height: 70vh;
        overflow-y: auto;
        border-left: 4px solid ${borderColor};
        background-color: ${bgColor};
    `;
    
    dialog.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">${title}</h3>
        <p style="margin: 0 0 20px 0; color: #666; line-height: 1.4;">${message}</p>
        <button id="pluginAlertOk" style="
            background: ${borderColor};
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            float: right;
        ">OK</button>
        <div style="clear: both;"></div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Close modal when OK is clicked
    document.getElementById('pluginAlertOk').onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Close modal when background is clicked
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}
