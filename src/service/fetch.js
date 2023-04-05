import S from '../utils/service';

/**
 * @description 登录
 */
export const sysUserLogin = (obj) => S.post('sys-user/login', obj);
export const sysUserGetCode = (obj) => S.get('sys-user/getCode', obj, 'blob');
/**
 * @description 角色列表
 */
export const sysRoleList = (obj) => S.get('sys-role/list', obj);

/**
 * @description 用户列表
 */
export const getUserlist = (obj) => S.get('/user/pageList', obj);
export const getUserDataTotal = (obj) => S.get('/user/headerDataTotal', obj);
export const accountFreeze = (obj) => S.get('/user/freeze', obj); // 封停
export const accountThaw = (obj) => S.get('/user/thaw', obj); // 解禁
export const importInner = (obj) => S.post('/user/importInner', obj); // 导入测试账号
export const upAndDown = (obj) => S.post('/user/upAndDown', obj); // 上下分

/**
 * @description NFT系列
 */
export const getNftExternalList = (obj) => S.get('/nft-external-series/pageList', obj); // 外部nft列表
export const getNftExternalStatistics = (obj) => S.get('/nft-external-series/headerDataTotal', obj); // 外部nft统计
export const nftExternalAdd = (obj) => S.post('/nft-external-series/add', obj); // 外部nft新增
export const nftExternalDel = (obj) => S.get('/nft-external-series/delete', obj); // 外部nft删除

export const getNftPlatformList = (obj) => S.get('/nft-platform-series/pageList', obj); // 平台nft列表
export const getNftplatformStatistics = (obj) => S.get('/nft-platform-series/headerDataTotal', obj); // 平台nft统计
export const nftPlatformAdd = (obj) => S.post('/nft-platform-series/add', obj); // 外部nft新增
export const nftPlatformUpdate = (obj) => S.post('/nft-platform-series/update', obj); // 外部nft修改
export const nftPlatformDel = (obj) => S.get('/nft-platform-series/delete', obj); // 外部nft删除

export const getNftExternalManagerList = (obj) => S.get('/nft-external-manager/pageList', obj); // 外部nft管理
export const getNftExternalManagerStatistics = (obj) => S.get('/nft-external-manager/headerDataTotal', obj); // 外部nft管理统计
export const ntExternalFreeze = (obj) => S.get('/nft-external-manager/freeze', obj); // 外部nft冻结
export const nftExternalThaw = (obj) => S.get('/nft-external-manager/thaw', obj); // 外部nft解禁
export const nftExternalFlushed = (obj) => S.get('/nft-external-manager/flushed', obj); // 外部nft刷新

export const getNftPlatformManagerList = (obj) => S.get('/nft-platform-manager/pageList', obj); // 平台nft管理
export const getNftPlatformManagerStatistics = (obj) => S.get('/nft-platform-manager/headerDataTotal', obj); // 平台nft管理统计


/**
 * @description 市场管理
 */
export const getMarketManagerList = (obj) => S.get('/market-manager/pageList', obj); // 市场管理列表
export const marketFreeze = (obj) => S.get('/market-manager/freeze', obj); // 市场冻结
export const marketThaw = (obj) => S.get('/market-manager/thaw', obj); // 市场解禁