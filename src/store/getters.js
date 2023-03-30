import {
  getSessionStore,
  decodeStr,
} from "@/utils";
const getters = {
  // sidebar: state => state.app.sidebar,

  accountConfig(state) {
    if (state.user.accountConfig) return state.user.accountConfig;
    const localInfo = getSessionStore("accountConfig");
    if (localInfo) return localInfo;
    return null;
  },
  coinConfig(state) {
    if (state.user.coinConfig) return state.user.coinConfig;
    const localInfo = getSessionStore("coinConfig");
    if (localInfo) return localInfo;
    return null;
  },
}
export default getters
