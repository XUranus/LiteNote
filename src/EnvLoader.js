import config from './env.json'

export default {
    apiServerAddr: "http://"+config.nodeServer.host+":"+config.nodeServer.port+"/api",
    imageServerAddr: "http://"+config.nodeServer.host+":"+config.nodeServer.port+"/img",
}