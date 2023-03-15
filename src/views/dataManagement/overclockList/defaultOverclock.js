import i18n from '../../../lang';

export const isCheckbox = [
  'closeLed',
  'ethEnhance',
  'reducedIdlePowerConsumption',
  'forcePzeroState',
  'radicalHypotension',
];
export const templateAmdTweaks = {
  gpuIndex: '', //gpuIndex
  socVddmax: '', //处理器VDDMAX
};
export const defaultOverclockAmd = {
  algorithmId: '', // 算法id
  coreClockOffset: '', //核心频率
  coreState: '', //核心状态
  coreVoltage: '', //核心电压
  memoryControllerVoltage: '', //显存电压控制器
  memoryFrequency: '', //显存频率
  memoryState: '', //显存状态编号
  memoryVoltage: '', //显存电压
  fan: '', //风扇
  powerLimit: '', //功耗限制
  socFrequency: '', //处理器电压
  socVddmax: '', //处理器VDDMAX
  radicalHypotension: false, //激进降压(OPEN-打开,CLOSE-关闭)
  templateAmdTweaks: [Object.copyArrObj(templateAmdTweaks)], //Amd调整
};

export const defaultOverclockNvidia = {
  graphicsCardName: '', // 显卡名称
  graphicsCardMemory: '', // 显卡内存
  baseNumber: '', // 基数
  efficiency: '', // 效率
  algorithmId: '', // 算法id
  coreClockOffset: '', //核心频率
  memoryFrequency: '', //显存频率
  fan: '', //风扇
  powerLimit: '', //功耗限制
  overDelay: '', //超频延迟
  closeLed: false, //关闭LED(OPEN-打开,CLOSE-关闭)
  ethEnhance: false, //ETH增强模式(OPEN-打开,CLOSE-关闭)
  forcePzeroState: false, //强制P的状态(OPEN-打开,CLOSE-关闭)
  reducedIdlePowerConsumption: false, //降低闲置功耗(OPEN-打开,CLOSE-关闭)
  pillCmdLine: '', //pill_cmd_line
  ethEnhanceDelay: '', //ETH增强模式延迟
};
export const cupAform = [
  //A卡
  {
    title: `${i18n.t('overclock.coreClockOffset')}, MHz`, //标题
    tooltip: i18n.t('overclock.aCoreClockOffset'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.coreClockOffset')}`, //input提示
    key: 'coreClockOffset',
  },
  {
    title: `${i18n.t('overclock.coreState')}`, //标题
    tooltip: i18n.t('overclock.aCoreState'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.coreState')}`, //input提示
    key: 'coreState',
  },
  {
    title: `${i18n.t('overclock.coreVoltage')}, MV`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.coreVoltage')}`, //input提示
    key: 'coreVoltage',
  },
  {
    title: `${i18n.t('overclock.memoryControllerVoltage')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t(
      'overclock.memoryControllerVoltage'
    )}`, //input提示
    key: 'memoryControllerVoltage',
  },
  {
    title: `${i18n.t('overclock.memoryFrequency')}, MHz`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.memoryFrequency')}`, //input提示
    key: 'memoryFrequency',
  },
  {
    title: `${i18n.t('overclock.memoryState')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.memoryState')}`, //input提示
    key: 'memoryState',
  },
  {
    title: `${i18n.t('overclock.memoryVoltage')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.memoryVoltage')}`, //input提示
    key: 'memoryVoltage',
  },
  {
    title: `${i18n.t('overclock.fan')}, %`, //标题
    tooltip: i18n.t('overclock.aFan'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.fan')}`, //input提示
    key: 'fan',
  },
  {
    title: `${i18n.t('overclock.powerLimit')}, W`, //标题
    tooltip: i18n.t('overclock.aPowerLimit'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.powerLimit')}`, //input提示
    key: 'powerLimit',
  },
  {
    title: `${i18n.t('overclock.socFrequency')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.socFrequency')}`, //input提示
    key: 'socFrequency',
  },
  {
    title: `${i18n.t('overclock.socVddmax')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.socVddmax')}`, //input提示
    key: 'socVddmax',
  },
  {
    title: `${i18n.t('overclock.radicalHypotension')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.radicalHypotension')}`, //input提示
    key: 'radicalHypotension',
  },
];
export const cupNform = [
  //n卡

  {
    title: `${i18n.t('overclock.coreClockOffset')}, MHz`, //标题
    tooltip: i18n.t('overclock.nCoreClockOffset'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.coreClockOffset')}`, //input提示
    key: 'coreClockOffset',
  },
  {
    title: `${i18n.t('overclock.memoryFrequency')}, MHz`, //标题
    tooltip: i18n.t('overclock.nMemoryFrequency'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.memoryFrequency')}`, //input提示
    key: 'memoryFrequency',
  },
  {
    title: `${i18n.t('overclock.fan')}, %`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.fan')}`, //input提示
    key: 'fan',
  },
  {
    title: `${i18n.t('overclock.powerLimit')}, W`, //标题
    tooltip: i18n.t('overclock.nPowerLimit'), //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.powerLimit')}`, //input提示
    key: 'powerLimit',
  },
  {
    title: `${i18n.t('overclock.overDelay')}(秒)`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.overDelay')}`, //input提示
    key: 'overDelay',
  },
  {
    title: `${i18n.t('overclock.presetState')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.presetState')}`, //input提示
    key: 'presetState',
  },
  {
    title: `${i18n.t('overclock.closeLed')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.closeLed')}`, //input提示
    key: 'closeLed',
  },
  {
    title: `${i18n.t('overclock.ethEnhance')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.ethEnhance')}`, //input提示
    key: 'ethEnhance',
  },

  {
    title: `${i18n.t('overclock.forcePzeroState')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.forcePzeroState')}`, //input提示
    key: 'forcePzeroState',
  },
  {
    title: `${i18n.t('overclock.reducedIdlePowerConsumption')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t(
      'overclock.reducedIdlePowerConsumption'
    )}`, //input提示
    key: 'reducedIdlePowerConsumption',
  },
  {
    title: `${i18n.t('overclock.pillCmdLine')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.pillCmdLine')}`, //input提示
    key: 'pillCmdLine',
  },
  {
    title: `${i18n.t('overclock.ethEnhanceDelay')}`, //标题
    tooltip: '', //冒泡提示
    tips: `${i18n.t('public.write')}${i18n.t('overclock.ethEnhanceDelay')}`, //input提示
    key: 'ethEnhanceDelay',
  },
];
// export const rules = {
//   graphicsCardName: [
//     {
//       required: true,
//       message: i18n.t('graphicsCardList.graphicsCardNameMust'),
//       trigger: ['blur', 'change'],
//     },
//   ],
//   graphicsCardMemory: [
//     {
//       required: true,
//       message: i18n.t('graphicsCardList.graphicsCardMemoryMust'),
//       trigger: ['blur', 'change'],
//     },
//   ],
//   algorithmId: [
//     {
//       required: true,
//       message: i18n.t('miningSoftware.algNameMust'),
//       trigger: ['blur', 'change'],
//     },
//   ],
//   coreState: [
//     {
//       type: 'number',
//       min: 1,
//       max: 7,
//       message: i18n
//         .t('overclock.coreStateErro')
//         .replace(/{min}/, 1)
//         .replace(/{max}/, 7),
//       trigger: ['blur', 'change'],
//     },
//   ],
//   efficiency: [
//     {
//       type: 'number',
//       min: 0,
//       max: 100,
//       message: i18n
//         .t('overclock.efficiencyErro')
//         .replace(/{min}/, 0)
//         .replace(/{max}/, 100),
//       trigger: ['change'],
//     },
//   ],
// };
