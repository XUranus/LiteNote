import serverConfig from './reactEnv.json';

const server = serverConfig.server;

export default {
    apiServerAddr: server.protocol+"://"+server.host+":"+server.port+"/api",
    imageServerAddr: server.protocol+"://"+server.host+":"+server.port+"/img",
}