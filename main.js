const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

const isDev = process.env.NODE_ENV !== 'production';

// Inicia o servidor Express em um processo separado
const serverProcess = fork(path.join(__dirname, 'server', 'index.js'));

let mainWindow; // A janela principal agora é uma variável global

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // << IMPORTANTE: Inicia a janela de forma invisível
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'client/build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
   //mainWindow.webContents.openDevTools({ mode: 'detach' }); // Abre o DevTools em janela separada
  }

  // Quando a janela principal estiver pronta para ser mostrada, faremos a troca
  mainWindow.once('ready-to-show', () => {
    // A lógica de mostrar a janela principal e fechar o splash foi movida para o app.whenReady
  });
}

// Uma nova função para criar a janela de Splash
function createSplashWindow() {
  const splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false, // Janela sem bordas
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  return splashWindow;
}

app.whenReady().then(() => {
  const splashWindow = createSplashWindow();
  createMainWindow();

  // Quando o conteúdo da janela principal estiver 100% carregado e renderizado...
  mainWindow.webContents.on('did-finish-load', () => {
    // ... nós mostramos a janela principal e fechamos a de splash.
    splashWindow.close();
    mainWindow.show();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  serverProcess.kill();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});