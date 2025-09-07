
///////////////////////
// Appel des modules //
///////////////////////

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require("os");
const fs = require('fs');

var mainWindow = null;

////////////////////////
// Options par défaut //
////////////////////////

const userHomeDir = os.homedir();

var isNotSavedFiles = false;
var recentFiles = { recentFiles: [] };
var assets = { assets: [] };
var plugIns = [];

///////////////
// Fonctions //
///////////////

//// Utilitaires ////

function updateRecentFiles($filePath)
{
	var index = recentFiles.recentFiles.indexOf($filePath);

	if (index >= 0)
		recentFiles.recentFiles.splice(index, 1);

	recentFiles.recentFiles.push($filePath);

	if (recentFiles.recentFiles.length > 15)
		recentFiles.recentFiles.shift();

	fs.writeFileSync(userHomeDir + '/Documents/Peguy/Vectors/recentFiles.json', JSON.stringify(recentFiles));

	mainWindow.webContents.executeJavaScript("viewManager.updateRecentFiles(" + JSON.stringify(recentFiles) + ");");
}

//// Appelée par l'interface graphique ////

function handleSetNotSavedFiles($event, $isNotSavedFiles)
{
	isNotSavedFiles = $isNotSavedFiles;
}

async function handleLoadSettingsInGUI()
{
	mainWindow.webContents.executeJavaScript("viewManager.updateRecentFiles(" + JSON.stringify(recentFiles) + ");");
	mainWindow.webContents.executeJavaScript("viewManager.updatePlugIns(" + JSON.stringify({ plugIns: plugIns }) + ");");
	mainWindow.webContents.executeJavaScript("viewManager.updateAssetManager(" + JSON.stringify(assets) + ");");
}

function loadPlugIns()
{
	var tmpPluginsPath = userHomeDir + '/Documents/Peguy/3D/PlugIns/tmp'; 

	if (fs.existsSync(tmpPluginsPath))
		fs.rmSync(tmpPluginsPath, { recursive: true, force: true });
		
	fs.mkdirSync(tmpPluginsPath);

	var index = 1;
	var timestamp = (new Date()).getTime();

	plugIns = [];

	var files = fs.readdirSync('PlugIns');

	for (var file of files)
	{
		if (fs.lstatSync('PlugIns/' + file).isDirectory())
		{
			var subFiles = fs.readdirSync('PlugIns/' + file);

			for (var subFile of subFiles)
			{
				if (subFile !== 'main.js')
				{
					var tmpFilePath = tmpPluginsPath + '/plugin-' + timestamp + '-' + index + '.js';
					var filepath = __dirname + '/PlugIns/' + file + '/' + subFile;
					var fileContent = fs.readFileSync(filepath, "utf8");
					fs.writeFileSync(tmpFilePath, fileContent + '\n\nif (Loader !== null && Loader !== undefined)\n\tLoader.hasLoaded("' + tmpFilePath + '");');
					plugIns.push(tmpFilePath);
				}
			}
		}
		else if (/\.js$/.test(file))
		{
			var tmpFilePath = tmpPluginsPath + '/plugin-' + timestamp + '-' + index + '.js';
			var filepath = __dirname + '/' + path.join('PlugIns', file);
			var fileContent = fs.readFileSync(filepath, "utf8");
			fs.writeFileSync(tmpFilePath, fileContent + '\n\nif (Loader !== null && Loader !== undefined)\n\tLoader.hasLoaded("' + tmpFilePath + '");');
			plugIns.push(tmpFilePath);
		}

		index++;
	}

	files = fs.readdirSync(userHomeDir + '/Documents/Peguy/3D/PlugIns');

	for (var file of files)
	{
		if (fs.lstatSync(userHomeDir + '/Documents/Peguy/3D/PlugIns/' + file).isDirectory())
		{
			var subFiles = fs.readdirSync(userHomeDir + '/Documents/Peguy/3D/PlugIns/' + file);

			for (var subFile of subFiles)
			{
				if (subFile !== 'main.js')
				{
					var tmpFilePath = tmpPluginsPath + '/plugin-' + timestamp + '-' + index + '.js';
					var filepath = userHomeDir + '/Documents/Peguy/3D/PlugIns/' + file + '/' + subFile;
					var fileContent = fs.readFileSync(filepath, "utf8");
					fs.writeFileSync(tmpFilePath, fileContent + '\n\nif (Loader !== null && Loader !== undefined)\n\tLoader.hasLoaded("' + tmpFilePath + '");');
					plugIns.push(tmpFilePath);
				}
			}
		}
		else if (/\.js$/.test(file))
		{
			var tmpFilePath = tmpPluginsPath + '/plugin-' + timestamp + '-' + index + '.js';
			var filepath = path.join(userHomeDir + '/Documents/Peguy/3D/PlugIns', file);
			var fileContent = fs.readFileSync(filepath, "utf8");
			fs.writeFileSync(tmpFilePath, fileContent + '\n\nif (Loader !== null && Loader !== undefined)\n\tLoader.hasLoaded("' + tmpFilePath + '");');
			plugIns.push(tmpFilePath);
		}

		index++;
	}
}

async function handleRefreshPlugIns()
{
	loadPlugIns();
	await mainWindow.webContents.executeJavaScript("viewManager.updatePlugIns(" + JSON.stringify({ plugIns: plugIns }) + ");");
	return plugIns;
}

async function handleOpenFile()
{
	var output = [];

	const { canceled, filePaths } = await dialog.showOpenDialog();
	
	if (!canceled)
	{
		for (var i = 0; i < filePaths.length; i++)
		{
			var filePath = filePaths[i];
			filePath = filePath.replace(/\/project.json$/, '').replace(/\\project.json$/, '');

			if (fs.existsSync(filePath) && fs.existsSync(filePath + '/project.json'))
			{
				var tmp = filePath.split('/');
				var fileName = tmp[tmp.length-1];
				var configContent = fs.readFileSync(filePath + '/project.json', "utf8");
				var config = JSON.parse(configContent);
				var filesContent = {};

				for (var i = 0; i < config.scripts.length; i++)
				{
					if (fs.existsSync(filePath + '/' + config.scripts[i] + '.js'))
						filesContent[config.scripts[i]] = fs.readFileSync(filePath + '/' + config.scripts[i] + '.js', "utf8");
				}

				output.push({ name: fileName, path: filePath, content: filesContent});
				updateRecentFiles(filePath);
			}
		}
	}

	return output;
}

async function handleOpenRecentFile($event, $filePath)
{
	var output = null;

	if (fs.existsSync($filePath))
	{
		var tmp = $filePath.split('/');
		var fileName = tmp[tmp.length-1];
		var configContent = fs.readFileSync($filePath + '/project.json', "utf8");
		var config = JSON.parse(configContent);
		var filesContent = {};

		for (var i = 0; i < config.scripts.length; i++)
		{
			if (fs.existsSync($filePath + '/' + config.scripts[i] + '.js'))
				filesContent[config.scripts[i]] = fs.readFileSync($filePath + '/' + config.scripts[i] + '.js', "utf8");
		}

		output = { name: fileName, path: $filePath, content: filesContent};
		updateRecentFiles($filePath);
	}

	return output;
}

async function handleSaveFileAs($event, $content)
{
	var output = null;

	const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow);

	if (!canceled && filePath)
	{
		var tmp = filePath.split('/');
		var fileName = tmp[tmp.length-1];
		fs.mkdirSync(filePath);

		var projectConfig = { projectName: fileName, scripts: [] };

		for (key in $content)
		{
			projectConfig.scripts.push(key);
			fs.writeFileSync(filePath + '/' + key + '.js', $content[key]);
		}

		fs.writeFileSync(filePath + '/project.json', JSON.stringify(projectConfig));

		output = { name: fileName, path: filePath, content: $content};
		updateRecentFiles(filePath);
	}

	return output;
}

async function handleSaveFile($event, $filePath, $content)
{
	var output = null;

	var tmp = $filePath.split('/');
	var fileName = tmp[tmp.length-1];

	var projectConfig = { projectName: fileName, scripts: [] };

	for (key in $content)
	{
		projectConfig.scripts.push(key);
		fs.writeFileSync($filePath + '/' + key + '.js', $content[key]);
	}

	fs.writeFileSync($filePath + '/project.json', JSON.stringify(projectConfig));

	output = { name: fileName, path: $filePath, content: $content};
	updateRecentFiles($filePath);

	return output;
}

async function handleExecProgram($event, $filePath, $content)
{
	var tmp = $filePath.split('/');
	var fileName = tmp[tmp.length-1];

	if (fs.existsSync($filePath + '/run'))
		fs.rmSync($filePath + '/run', { recursive: true, force: true });
		
	fs.mkdirSync($filePath + '/run');

	var index = 1;
	var timestamp = (new Date()).getTime();

	var projectConfig = { projectName: fileName, scripts: [] };

	for (key in $content)
	{
		var tmpFileName = key + '-' + timestamp + '-' + index + '.js';
		var codeToSave = $content[key] + '\n\nif (Loader !== null && Loader !== undefined)\n\tLoader.hasLoaded("' + tmpFileName + '");';
		projectConfig.scripts.push({ name: key, tmpFile: tmpFileName });
		fs.writeFileSync($filePath + '/run/' + tmpFileName, codeToSave);
		index++;
	}

	return projectConfig;
}

async function handleExportToSVG($event, $content)
{
	var output = null;

	const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow);

	if (!canceled && filePath)
	{
		var tmp = filePath.split('/');
		var fileName = tmp[tmp.length-1];
		fs.writeFileSync(filePath, $content);
		output = { name: fileName, path: filePath, content: $content};
	}

	return output;
}

async function handleExportToPNG($event, $content)
{
	var output = null;

	const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow);

	if (!canceled && filePath)
	{
		var tmp = filePath.split('/');
		var fileName = tmp[tmp.length-1];
		fs.writeFileSync(filePath, $content, 'base64');
		output = { name: fileName, path: filePath, content: $content};
	}

	return output;
}

async function handleSaveAssets($event, $assets)
{
	assets.assets = JSON.parse($assets);
	fs.writeFileSync(userHomeDir + '/Documents/Peguy/Vectors/assets.json', $assets);
};

function handleQuit()
{
	app.quit();
};

////////////////////////////////
// Démarrage de l'application //
////////////////////////////////

// Initialisation des options par défaut

if (!fs.existsSync(userHomeDir + '/Documents/Peguy'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/Vectors'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy/Vectors');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/Vectors/recentFiles.json'))
	fs.writeFileSync(userHomeDir + '/Documents/Peguy/Vectors/recentFiles.json', JSON.stringify(recentFiles));
else
{
	var fileContent = fs.readFileSync(userHomeDir + '/Documents/Peguy/Vectors/recentFiles.json', "utf8");
	recentFiles = JSON.parse(fileContent);
}

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/Vectors/PlugIns'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy/Vectors/PlugIns');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/Vectors/assets.json'))
	fs.writeFileSync(userHomeDir + '/Documents/Peguy/Vectors/assets.json', JSON.stringify(assets));
else
{
	var fileContent = fs.readFileSync(userHomeDir + '/Documents/Peguy/Vectors/assets.json', "utf8");
	assets = JSON.parse(fileContent);
}

loadPlugIns();

// Fonction de création d'une fenêtre
function createWindow ()
{
	// Création et paramétrage d'une fenêtre
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1200,
		webPreferences:
		{
			preload: path.join(__dirname, 'preload.js')
		}
	});

	mainWindow.on('close', ($e) => {
		
		if (isNotSavedFiles === true)
		{
			$e.preventDefault();
			mainWindow.webContents.executeJavaScript("viewManager.confirmCloseApp();");
		}
	});

	// Charger une page HTML dans la fenêtre
	mainWindow.loadFile('index.html');

	//mainWindow.webContents.openDevTools() // Affiche automatiquement la console de débugage
}

// Déclencher l'ouverture de la fenêtre uniquement lorsqu'électron a fini de se charger.
app.whenReady().then(() =>
{
	ipcMain.on('setNotSavedFiles', handleSetNotSavedFiles);
	ipcMain.handle('loadSettingsInGUI', handleLoadSettingsInGUI);
	ipcMain.handle('refreshPlugIns', handleRefreshPlugIns);
	ipcMain.handle('openFile', handleOpenFile);
	ipcMain.handle('openRecentFile', handleOpenRecentFile);
	ipcMain.handle('saveFileAs', handleSaveFileAs);
	ipcMain.handle('saveFile', handleSaveFile);
	ipcMain.handle('execProgram', handleExecProgram);
	ipcMain.handle('exportToSVG', handleExportToSVG);
	ipcMain.handle('exportToPNG', handleExportToPNG);
	ipcMain.handle('saveAssets', handleSaveAssets);
	ipcMain.on('quit', handleQuit);

	createWindow();
	
	app.on('activate', function ()
	{
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow();
	});
});

app.on('window-all-closed', function () { app.quit(); });