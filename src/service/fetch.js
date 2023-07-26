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
export const nftExternalUpdate = (obj) => S.post('/nft-external-series/update', obj); // 外部nft新增
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
 * @description 一元购管理
 */
export const getOneNftOrdersManagerList = (obj) => S.get('/nft/one-nft-orders/pageList', obj); // 一元购管理
export const getOneNftOrdersStatistics = (obj) => S.get('/nft/one-nft-orders/statistics', obj); // 一元购统计
export const updateOneNftOrders = (obj) => S.post('/nft/one-nft-orders/updateUpAndDown', obj); // 一元购更新
export const getOneNftLotteryOrdersManagerList = (obj) => S.get('/nft/one-nft-lottery-orders/pageList', obj); // 一元购售票记录
export const getOneNftLotteryOrdersStatistics = (obj) => S.get('/nft/one-nft-lottery-orders/statistics', obj); // 一元购售票统计
export const getServiceCharge = (obj) => S.get('/nft/one-nft-orders/getServiceCharge', obj); // 获取一元购服务费
export const updateServiceCharge = (obj) => S.get('/nft/one-nft-orders/updateServiceCharge', obj); // 设置一元购服务费
export const getUserNftList = (obj) => S.get('/nft/nft-user-data/pageList', obj); // 用户Nft列表

/**
 * @description 市场管理
 */
export const getMarketManagerList = (obj) => S.get('/market-manager/pageList', obj); // 市场管理列表
export const marketFreeze = (obj) => S.get('/market-manager/freeze', obj); // 市场冻结
export const marketThaw = (obj) => S.get('/market-manager/thaw', obj); // 市场解禁

/**
 * @description 盲盒管理
 */
export const getBoxManagerList = (obj) => S.get('/box-manager/pageList', obj); // 盲盒管理列表
export const getBoxManagerStatistics = (obj) => S.get('/box-manager/headerDataTotal', obj); // 盲盒管理统计
export const boxManagerAdd = (obj) => S.post('/box-manager/add', obj); // 盲盒新增
export const boxManagerUpdate = (obj) => S.post('/box-manager/update', obj); // 盲盒更新
export const boxManagerFreeze = (obj) => S.get('/box-manager/freeze', obj); // 盲盒管理冻结
export const boxManagerThaw = (obj) => S.get('/box-manager/thaw', obj); // 盲盒管理解禁
export const boxManagerDelete = (obj) => S.get('/box-manager/delete', obj); // 盲盒管理删除
export const boxManagerWinningRevision = (obj) => S.get('/box-manager/update/adjust', obj); // 盲盒中奖修正
export const boxManagerOpen = (obj) => S.get('/box-manager/open', obj); // 血池开启
export const boxManagerClose = (obj) => S.get('/box-manager/close', obj); // 血池关闭
export const calculationPlatformNft = (obj) => S.post('/box-manager/calcNft', obj); // 计算内部Nft数量

/**
 * @description 盲盒测试
 */
export const getBlindBoxTest = (obj) => S.get('/test/box', obj); // 开始测试
export const getBlindBoxFastTest = (obj) => S.get('/test/boxBack', obj); // 快速测试
export const blindBoxReset = (obj) => S.get('/test/reset', obj); // 重置

/**
 * @description 金流管理
 */
export const getAssetFlowList = (obj) => S.get('/asset-flow/pageList', obj); // 金流管理列表
export const getAssetFlowStatistics = (obj) => S.get('/asset-flow/headerDataTotal', obj); // 金流管理统计

/**
 * @description 提款审核
 */
export const getAssetWithdrawalList = (obj) => S.get('/asset-withdrawal/pageList', obj); // 提款审核列表
export const getAssetWithdrawalStatistics = (obj) => S.get('/asset-withdrawal/headerDataTotal', obj); // 提款审核统计
export const withdrawalApproved = (obj) => S.get('/asset-withdrawal/approved', obj); // 审核通过统计
export const withdrawalRefuse = (obj) => S.get('/asset-withdrawal/refuse', obj); // 审核拒绝统计

/**
 * @description 订单管理
 */
export const getOrderManagerList = (obj) => S.get('/order-manager/pageList', obj); // 订单管理列表
export const getOrderManagerStatistics = (obj) => S.get('/order-manager/headerDataTotal', obj); // 订单管理统计
export const getBoxLotteryList = (obj) => S.get('/box-lottery/pageList', obj); // 开奖详情

/**
 * @description 邀请返佣
 */
export const getRebatesBaseList = (obj) => S.get('/rebates-base/pageList', obj); // 邀请返佣列表
export const getRebatesBaseStatistics = (obj) => S.get('/rebates-base/headerDataTotal', obj); // 邀请返佣统计
export const getRebatesBaseDownList = (obj) => S.get('/rebates-base/down/pageList', obj); // 邀请下级列表
export const getRebatesBaseDownStatistics = (obj) => S.get('/rebates-base/down/headerDataTotal', obj); // 邀请下级统计
export const setRebateRate = (obj) => S.get('/rebates-base/set/rebateRate', obj); // 分佣比例更新

/**
 * @description 返佣记录
 */
export const getRebatesRecordList = (obj) => S.get('/rebates-record/pageList', obj); // 返佣记录列表
export const getRebatesRecordStatistics = (obj) => S.get('/rebates-record/headerDataTotal', obj); // 返佣记录统计

/**
 * @description 闪兑管理
 */
export const getFlashManagerList = (obj) => S.get('/flash-manager/pageList', obj); // 闪兑管理列表
export const getFlashManagerStatistics = (obj) => S.get('/flash-manager/headerDataTotal', obj); // 闪兑管理统计

/**
 * @description 积分流水
 */
export const getAssetPointFlowList = (obj) => S.get('/asset-point-flow/pageList', obj); // 积分流水列表
export const getAssetPointFlowStatistics = (obj) => S.get('/asset-point-flow/headerDataTotal', obj); // 积分流水统计


/**
 * @description 系统设置
 */
export const getPointConfig = (obj) => S.get('/system-setting/findPointSetting', obj); // 积分配置查询
export const pointConfigSet = (obj) => S.post('/system-setting/pointSetting', obj); // 积分配置更改
export const getWithdrawalConfig = (obj) => S.get('/system-setting/findWithdrawalSetting', obj); // 提现配置查询
export const withdrawalConfigSet = (obj) => S.post('/system-setting/withdrawalSetting', obj); // 提现配置更改
export const getRecycleConfig = (obj) => S.get('/system-setting/findReclaimSetting', obj); // NFT回收配置查询
export const recycleConfigSet = (obj) => S.post('/system-setting/reclaimSetting', obj); // NFT回收配置更改
export const getSystemWalletList = (obj) => S.get('/system-wallet/pageList', obj); // 归集钱包列表
export const systemWalletActive = (obj) => S.get('/system-wallet/activate', obj); // 归集钱包激活
export const systemWalletAdd = (obj) => S.post('/system-wallet/add', obj); // 归集钱包新增
export const systemWalletDel = (obj) => S.get('/system-wallet/delete', obj); // 归集钱包删除
export const getInviteSetting = (obj) => S.get('/system-setting/findBaseSetting', obj); // 邀请文本查询
export const inviteSet = (obj) => S.post('/system-setting/baseSetting', obj); // 邀请文本设置

/**
 * @description 群发邮件
 */
export const getSendEmailList = (obj) => S.get("/send-email-content/emailList", obj); // 邮箱列表
export const getSendEmailPageList = (obj) => S.get("/send-email-content/pageList", obj); // 分页查询发送列表
export const getSendEmailUserList = (obj) => S.get("/send-email-content/userList", obj); // 发送邮件用户验证,用户id存在的会返回用户详细
export const sendEmailSave = (obj) => S.post("/send-email-content/save", obj); // 发送邮件
export const getSendEmailUserTotal = (obj) => S.get("/send-email-content/getUserTotal", obj); // 获取用户总量
export const sendEmailDel = (obj) => S.get("/send-email-content/del", obj); // 删除
export const sendEmailCancel = (obj) => S.get("/send-email-content/isCancel", obj); // 取消
export const getSendMailUser = (obj) => S.get("/send-email-content/getSendMailUser", obj); // 查看发送邮箱用户

/**
 * @description 钱包管理-充值钱包
 */
export const getWalletRechargeList = (obj) => S.get("/wallet-recharge/pageList", obj); // 充值钱包分页查询
export const getWalletRechargeStatistics = (obj) => S.get("/wallet-recharge/headerDataTotal", obj); // 充值钱包统计数据

/**
 * @description 钱包管理-盲盒抽奖钱包
 */
export const getWalleBoxLotteryList = (obj) => S.get("/wallet-box-lottery/pageList", obj);
export const getWalletBoxLotteryStatistics = (obj) => S.get("/wallet-box-lottery/headerDataTotal", obj);

/**
 * @description 钱包管理-一元购抽奖钱包
 */
export const getWalleOneDallarLotteryList = (obj) => S.get("/wallet-one-dollar/pageList", obj);

/**
 * @description 钱包管理-出账钱包
 */
export const getWalleWithdrawalList = (obj) => S.get("/wallet-withdrawal/findList", obj);

/**
 * @description 钱包管理-GAS钱包
 */
export const getWalleGasList = (obj) => S.get("/wallet-gas/findList", obj);

/**
 * @description 钱包管理-NFT购买
 */
export const getWalleBuyNftList = (obj) => S.get("/wallet-buy-nft/findList", obj);



