import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

import i18n from '../../lang';

dayjs.extend(dayOfYear);

export const options = [
  {
    value: '',
    label: i18n.t('report.all'),
    key: 'all',
  },
  {
    value: 7,
    label: i18n.t('report.lastSevenDays'),
    key: 'lastSevenDays',
  },
  {
    value: 30,
    label: i18n.t('report.lastThirtyDays'),
    key: 'lastThirtyDays',
  },
  {
    value: Number(dayjs().format('DD')),
    label: i18n.t('report.theMonth'),
    key: 'theMonth',
  },
  {
    value: Number(dayjs().dayOfYear()),
    label: i18n.t('report.theYear'),
    key: 'theYear',
  },
];
