import { BrowserWindow, app } from "electron";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
app.whenReady().then(() => {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const win = new BrowserWindow({
		title: "OGame",
		icon: path.join(__dirname, "../public/favicon.ico"),
		width: 1200,
		height: 800
	});
	win.setMenu(null);
	if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
	else win.loadFile("docs/index.html");
});
