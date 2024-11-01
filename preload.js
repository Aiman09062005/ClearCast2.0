const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (filename, content) => {
        const crudFolderPath = path.join(__dirname, 'src', 'CRUDFile');
        
        // Create CRUDFile directory if it doesn't exist
        if (!fs.existsSync(crudFolderPath)) {
            fs.mkdirSync(crudFolderPath, { recursive: true });
        }

        const filePath = path.join(crudFolderPath, filename);
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
}); 