import { set, get, remove } from '@/localDatabase/helpers'

export type YearMonthCountType = {
  [year: string]: {
      [month: string]: number;
  };
};

const storeKey = 'donationCountYearMonth'
const save = (donationCountYearMonth: YearMonthCountType) => {
    set(storeKey, donationCountYearMonth)
}
const load = () => {
    return get(storeKey)
}
const clear = () => {
  remove(storeKey)
}

export default {
    save, load, clear
}