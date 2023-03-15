import S from '../utils/service';

/**
 * @description 登录
 */
export const sysUserLogin = (obj) => S.post('sys-user/login', obj);
export const sysUserGetCode = (obj) => S.get('sys-user/getCode', obj, 'blob');

/**
 * @description 用户列表
 */
export const baseUserPage = (obj) => S.get('base-user/page', obj);
export const baseUserDataTotal = (obj) => S.get('base-user/dataTotal', obj);
export const sysUserAdd = (obj) => S.post('sys-user/add', obj);
export const baseUserFrozen = (obj) => S.post('base-user/frozen', obj);
export const baseUserRelieveFrozen = (obj) =>
  S.post('base-user/relieveFrozen', obj);
export const baseUserLoginLog = (obj) => S.get('base-user/loginLog', obj);
export const baseUserUpdatePassword = (obj) =>
  S.post('base-user/updatePassword', obj);

/**
 * @description 角色列表
 */
export const sysRoleList = (obj) => S.get('sys-role/list', obj);

/**
 * @description 矿场列表
 */
export const userFarmPage = (obj) => S.get('user-farm/page', obj);
export const userFarmDataTotal = (obj) => S.get('user-farm/dataTotal', obj);
export const userFarmFrozen = (obj) => S.get('user-farm/frozen', obj);
export const userFarmRelieveFrozen = (obj) =>
  S.get('user-farm/relieveFrozen', obj);

/**
 * @description 矿机列表
 */
export const userMinerPage = (obj) => S.get('user-miner/page', obj);
export const userMinerDataTotal = (obj) => S.get('user-miner/dataTotal', obj);
export const userMinerFrozen = (obj) => S.get('user-miner/frozen', obj);
export const userMinerRelieveFrozen = (obj) =>
  S.get('user-miner/relieveFrozen', obj);

/**
 * @description 显卡列表
 */
export const userCardPage = (obj) => S.get('user-card/page', obj);
export const userCardDataTotal = (obj) => S.get('user-card/dataTotal', obj);
export const userCardFrozen = (obj) => S.get('user-card/frozen', obj);
export const userCardRelieveFrozen = (obj) =>
  S.get('user-card/relieveFrozen', obj);

/**
 * @description 超频模板
 */
export const templatePage = (obj) => S.get('template/page', obj);

/**
 * @description 超频模板
 */
export const flightSheetBasePage = (obj) =>
  S.get('flight-sheet-base/page', obj);

/**
 * @description 币种列表
 */
export const coinConfigPageList = (obj) => S.get('coin-config/pageList', obj);
export const coinConfigDelete = (obj) => S.get('coin-config/delete', obj);
export const coinConfigFindList = (obj) => S.get('coin-config/findList', obj);
export const coinConfigAdd = (obj) => S.post('coin-config/add', obj);
export const coinConfigUpdate = (obj) => S.post('coin-config/update', obj);

/**
 * @description 算法列表
 */
export const algorithmBasePageList = (obj) =>
  S.get('algorithm-base/pageList', obj);
export const algorithmBaseDelete = (obj) => S.get('algorithm-base/delete', obj);
export const algorithmBaseFindList = (obj) =>
  S.get('algorithm-base/findList', obj);
export const algorithmBaseAdd = (obj) => S.post('algorithm-base/add', obj);
export const algorithmBaseUpdate = (obj) =>
  S.post('algorithm-base/update', obj);

/**
 * @description 挖矿软件列表
 */
export const miningSoftwarePageList = (obj) =>
  S.get('mining-software/pageList', obj);
export const miningSoftwareDelete = (obj) =>
  S.get('mining-software/delete', obj);
export const miningSoftwareEnableStatus = (obj) =>
  S.get('mining-software/enableStatus', obj);
export const miningSoftwareEnableAdd = (obj) =>
  S.post('mining-software/add', obj);
export const miningSoftwareEnableUpdate = (obj) =>
  S.post('mining-software/update', obj);
export const uploadSoftware = (obj) => S.post('upload/software', obj);

/**
 * @description 超频预设
 */
export const templatePresetFindNvidiaPresetList = (obj) =>
  S.get('template-preset/findNvidiaPresetList', obj);
export const templatePresetFindAmdPresetList = (obj) =>
  S.get('template-preset/findAmdPresetList', obj);
export const templatePresetNvidiaDelete = (obj) =>
  S.get('template-preset/nvidia/delete', obj);
export const templatePresetAmdDelete = (obj) =>
  S.get('template-preset/amd/delete', obj);
export const templatePresetAmdAdd = (obj) =>
  S.post('template-preset/amd/add', obj);
export const templatePresetNvidiaAdd = (obj) =>
  S.post('template-preset/nvidia/add', obj);
export const templatePresetNvidiaUpdate = (obj) =>
  S.post('template-preset/nvidia/update', obj);
export const templatePresetAmdUpdate = (obj) =>
  S.post('template-preset/amd/update', obj);

/**
 * @description 矿池列表
 */
export const orePoolPageList = (obj) => S.get('ore-pool/pageList', obj);
export const orePoolEnable = (obj) => S.get('ore-pool/enable', obj);
export const orePoolProhibit = (obj) => S.get('ore-pool/prohibit', obj);
export const orePoolDelete = (obj) => S.get('ore-pool/delete', obj);
export const orePoolAdd = (obj) => S.post('ore-pool/add', obj);
export const orePoolUpdate = (obj) => S.post('ore-pool/update', obj);

/**
 * @description A卡默认频率管理
 */
export const defaultCardConfigPageList = (obj) =>
  S.get('default-card-config/pageList', obj);
export const defaultCardConfigDelete = (obj) =>
  S.get('default-card-config/delete', obj);
export const defaultCardConfigExportTemplate = (obj) =>
  S.get('default-card-config/exportTemplate', obj, 'blob');
export const defaultCardConfigAdd = (obj) =>
  S.post('default-card-config/add', obj);
export const defaultCardConfigUpdate = (obj) =>
  S.post('default-card-config/update', obj);
export const defaultCardConfigImport = (obj) =>
  S.post('default-card-config/import', obj);

/**
 * @description 系统版本管理
 */
export const systemVersionManagerPageList = (obj) =>
  S.get('system-version-manager/pageList', obj);
export const systemVersionManagerDelete = (obj) =>
  S.get('system-version-manager/delete', obj);
export const systemVersionManagerAdd = (obj) =>
  S.post('system-version-manager/add', obj);
export const systemVersionManagerUpdate = (obj) =>
  S.post('system-version-manager/update', obj);

/**
 * @description 钱包列表
 */
export const userWalletPageList = (obj) => S.get('user-wallet/pageList', obj);

/**
 * @description 矿机日志
 */
export const userMinerActivePageList = (obj) =>
  S.get('user-miner-active/pageList', obj);

/**
 * @description 图片上传
 */
export const uploadImage = (obj) => S.post('upload/image', obj);

/**
 * @description 首页报表
 */
export const mainChartDataHead = (obj) => S.get('main-chart-data/head', obj);
export const mainChartDataShow = (obj) => S.get('main-chart-data/show', obj);
export const mainChartDataRegTotal = (obj) =>
  S.get('main-chart-data/regTotal', obj);
export const mainChartDataCoinRank = (obj) =>
  S.get('main-chart-data/coinRank', obj);
export const mainChartDataPoolRank = (obj) =>
  S.get('main-chart-data/poolRank', obj);
export const mainChartDataCardRank = (obj) =>
  S.get('main-chart-data/cardRank', obj);
