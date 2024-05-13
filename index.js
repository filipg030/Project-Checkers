import { GameObject } from './src/modules/Main';
import { allEvents } from "./src/modules/Ui.js"
import loadingGif from './src/modules/img/loading.gif'


document.getElementById("loadingGif").src = loadingGif
GameObject.render()
allEvents.init()