const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',
{
	setNotSavedFiles: ($isNotSavedFiles) => ipcRenderer.send('setNotSavedFiles', $isNotSavedFiles), 
	loadSettingsInGUI: () => ipcRenderer.invoke('loadSettingsInGUI'),
	openFile: () => ipcRenderer.invoke('openFile'),
	openRecentFile: ($filePath) => ipcRenderer.invoke('openRecentFile', $filePath),
	saveFileAs: ($content) => ipcRenderer.invoke('saveFileAs', $content),
	saveFile: ($filePath, $content) => ipcRenderer.invoke('saveFile', $filePath, $content),
	exportToSVG: ($content) => ipcRenderer.invoke('exportToSVG', $content),
	exportToPNG: ($content) => ipcRenderer.invoke('exportToPNG', $content),
	saveAssets: ($assets) => ipcRenderer.invoke('saveAssets', $assets),
	quit: () => ipcRenderer.send('quit'), 
})