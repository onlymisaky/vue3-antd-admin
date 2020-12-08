# 基础的nginx镜像
FROM ccr.ccs.tencentyun.com/xr_base/nginx-static:1.18-alpine

# 拷贝编译好的镜头资源
COPY ./dist/ /static/