# Péguy Vectors
Péguy Vectors is a vector procedural generation software based on [Electron](https://www.electronjs.org/) and [Péguy.js](https://github.com/Killfaeh/Peguy.js).</br>

Here is an example of what you can do with Péguy Vectors.</br>

<div align="center">
<img src="https://github.com/Killfaeh/PeguyVectors/blob/main/doc/01-general.png?raw=true">
</div></br>

## Table of Contents

1. [Installation](#installation)
2. [How to use](#how-to-use)

## Installation

### Install Node.js

You need to install Node.js to run Péguy Vectors.

**Windows**

Download the installation file on Node.js web site : [https://nodejs.org/fr/download/prebuilt-installer](https://nodejs.org/fr/download/prebuilt-installer) </br>
Run it as administrator.

**Mac OS**

Open a terminal. </br>
Install Homebrew if you haven't already.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then, install Node.js and npm.

```bash
brew install node
brew install npm
```

**Linux**

Open a console and run these 2 commands.

```bash
sudo apt install nodejs
sudo apt install npm
```

### Download and extract the archive

Download the project archive via this Google Drive link : [https://drive.google.com/file/d/1nM6zMYmUR2q9eoBsqv-U8PwXBOX7h_PM/view?usp=sharing](https://drive.google.com/file/d/1nM6zMYmUR2q9eoBsqv-U8PwXBOX7h_PM/view?usp=sharing) </br>
Then, extract it.

<div align="center">
<img src="./doc/archiveContent.png"></br>
Archive content
</div>

### Run the application

**Windows**

If you run Péguy Vectors for the first time, run install.bat as administrator. 
A DOS console appears, with a small rotating bar in the top left corner, then disappears when installation is complete.</br>
Then, run PeguyVectors.bat as administrator.

**Mac OS**

If you run Péguy Vectors for the first time, run Install.app (double clic). </br>
Run PeguyVectors.app (double clic).</br>
You can put PeguyVectors.app in your dock.

**Linux**

If you run Péguy Vectors for the first time, run Install in a console. </br>
Run PeguyVectors in a console.

## How to use

### Basics

Here is how look the interface.</br>

<div align="center">
<img src="https://github.com/Killfaeh/PeguyVectors/blob/main/doc/01-general.png?raw=true">
</div><br/>

A Péguy Vectors project is a directory containing a file named <i>project.json</i> and a file named <i>main.js</i>. If you add new scripts to the project, they will be saved in this directory.<br/>

To open an existing project, you have to open the <i>project.json</i> file of the project. To test your program, you just need to click on the left top double arrow. You can export the result in a Wavefront (.obj) or Collada (.dae) file. The quick code panel at right help you to write your code faster. Double click on the label or simple click on the copy/paste icon of the row which interests you and a code block will be pasted in your code.<br/>

To add a script in your project, you have to click on the add file icon on the left top, near the double arrow.<br/>

<div align="center">
<img src="https://github.com/Killfaeh/PeguyVectors/blob/main/doc/01-general.png?raw=true">
</div><br/>

Then, enter a name and click on the Ok button.<br/>

Since scripts other than main.js may be executed in random order, it is recommended that you do not execute any functions in them and only write variable and function declarations. The execution of functions must be done in <i>main.js</i>, which runs after all other scripts.

### Insert assets

<div align="center">
<img src="./doc/02-assets.png">
</div></br>

You can save assets in your asset library by drag and drop SVG files into it.</br>
Then, you can call these assets in your code. 
To do so, select the asset that interests you in the asset library et click on the Ok button. 
The code line which call the asset is pasted in your code.

### Built-in documentation

A documentation is available inside Péguy Vectors. You can read it by clicking on the Help menu.</br>

<div align="center">
<img src="./doc/03-help.png">
</div></br>
