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
  cache?: boolean;
}

export function useRequest<Requests extends Array<any>, Resp>(
  apiFn: (...args: Requests) => HttpResponseP<Resp>,
  opt?: Opt<Resp>,
) {
  const options = {
    errMsg: true,
    cache: false,
    ...opt,
  };
  const loading = ref(false);
  const data = ref(options.initData as Resp) as Ref<Resp>;
  const error = ref(null) as Ref<any>;

  function fetchData(...args: Requests): Promise<XingrenResponse<Resp>> {
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

  let firstFetch = true;
  let prevRequsets: Requests = [] as unknown as Requests;
  let prevResponse: XingrenResponse<Resp>;

  function getCache(...args: Requests): Promise<XingrenResponse<Resp>> {
    const cacheEnable = options.cache
      && !firstFetch
      && JSON.stringify(prevRequsets) === JSON.stringify(args)
      && error.value === null;
    if (cacheEnable) {
      loading.value = false;
      return Promise.resolve(prevResponse);
    }
    return fetchData(...args)
      .then((response) => {
        if (options.cache) {
          firstFetch = false;
          prevRequsets = args;
          prevResponse = response;
        }
        return response;
      })
      .catch((err) => {
        firstFetch = true;
        return Promise.reject(err);
      });
  }

  // TODO 是返回原始的 Response 还是返回 Response.data 好？
  function requestFn(...args: Requests): Promise<XingrenResponse<Resp>> {
    return getCache(...args);
  }

  return {
    loading,
    data,
    error,
    requestFn,
  };
}
