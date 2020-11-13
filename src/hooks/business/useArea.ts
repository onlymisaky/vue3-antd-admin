/* eslint-disable no-param-reassign */
import {
  computed, onMounted, Ref, watch,
} from 'vue';
import { configService } from '@/services/Config.service';
import { useToRef } from '../base/useToRef';

export interface AreaForm {
  province: string;
  city: string;
  district: string;
}

export function useArea<T extends AreaForm>(areaForm: T | Ref<T>) {
  let provinceWacthCount = 0;
  let cityWacthCount = 0;

  const area = useToRef(areaForm);
  const { provinceList } = configService;
  const cityList = computed(() => configService.cityMap[area.value.province]);
  const districtList = computed(() => configService.districtMap[area.value.city]);

  function getCities() {
    if (area.value.province) {
      configService.getArea('cities', { province: area.value.province });
    }
  }

  function getDistricts() {
    if (area.value.city) {
      configService.getArea('districts', { city: area.value.city });
    }
  }

  watch(() => area.value.province, () => {
    if (provinceWacthCount) {
      area.value.city = '';
    }
    getCities();
    provinceWacthCount += 1;
  });

  watch(() => area.value.city, () => {
    if (cityWacthCount) {
      area.value.district = '';
    }
    getDistricts();
    cityWacthCount += 1;
  });

  onMounted(() => {
    configService.getArea('provinces');
    getCities();
    getDistricts();
  });

  return {
    provinceList,
    cityList,
    districtList,
  };
}
