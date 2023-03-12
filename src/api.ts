import type { API } from "../electron/API";

// This is a proxy that will call the bridge.call function
// so you can call api.myFunction(args) instead of bridge.call("myFunction", args)
// which will also show you documentation for the function in your IDE
const api = new Proxy({}, {
    get: (_, method: any) => (...args: any[]) => bridge.call(method, ...args)
});

export default api as API;