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