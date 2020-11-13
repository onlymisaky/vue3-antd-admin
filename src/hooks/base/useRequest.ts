/**
 * @author zhushiqi
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { message } from 'ant-design-vue';
import { ref, Ref } from 'vue';

interface Opt<T> {
  initData?: T;
  msg?: string;
  errMsg?: boolean | string;
}

export function useRequest<Requests extends Array<any>, Resp>(
  apiFn: (...args: Requests) => HttpResponseP<Resp>,
  opt?: Opt<Resp>,
) {
  const options = {
    ...opt,
    errMsg: true,
  };
  const loading = ref(false);
  const data = ref(options.initData as Resp) as Ref<Resp>;
  const error = ref(null) as Ref<any>;

  function requestFn(...args: Requests): Promise<XingrenResponse<Resp>> {
    loading.value = true;
    return apiFn(...args)
      .then((response) => {
        data.value = response.data.data;
        if (typeof options.msg === 'string') {
          message.success(options.msg);
        }
        return response.data;
      })
      .catch((err: HttpError) => {
        error.value = err;
        if (typeof options.errMsg === 'string') {
          message.error(options.errMsg);
        } else if (options.errMsg) {
          message.error(err.errMessage);
        }
        return Promise.reject(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return {
    loading,
    data,
    error,
    requestFn,
  };
}
