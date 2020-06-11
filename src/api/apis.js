import axios from 'axios'

//设置服务器IP地址
axios.defaults.baseURL = "http://127.0.0.1:5000"

//登陆
export const API_LOGIN = (data) => axios.post("/users/checkLogin",data)

//添加账号
export const API_ACCOUNTADD = (data) => axios.post("/users/add",data)

//获取账号
export const API_USERLIST = (data) => axios.get("/users/list",{params: data})

//删除账号
export const API_ACCOUNTDEL = (data) => axios.get("/users/del",{params: data})

//批量删除
export const API_ACCOUNTDELALL = (data) => axios.get("/users/batchdel",{params: data})

//修改账号
export const API_ACCOUNTEDIT = (data) => axios.post("/users/edit",data)

//检查旧密码是否正确
export const API_CHECKOLDPWD = (data) => axios.get("/users/checkoldpwd",{params: data})

//修改密码
export const API_EDITPWD = (data) => axios.post("/users/editpwd",data)

//获取账号（个人中心）信息
export const API_ACCOUNTINFO = (data) => axios.get("/users/accountinfo",{params: data})

//头像上传接口
export const API_AVATAR_UPLOAD = (data) => axios.post("/users/avatar_upload",data)

//验证token是否过期
export const API_CHECKTOKEN = (data) => axios.get("/users/checktoken",{params: data})

//修改用户头像
export const API_AVATAREDIT = (data) => axios.get("/users/avataredit",{params: data})

/*------------------------商品管理模块------------------ */

//添加分类
export const API_ADDCATE = (data) => axios.post("/goods/addcate",data)

//获取分类
export const API_CATELIST = (data) => axios.get("/goods/catelist",{params: data})

//删除分类
export const API_DELCATE = (data) => axios.get("/goods/delcate",{params: data})

//修改分类
export const API_EDITCATE = (data) => axios.post("/goods/editcate",data)

//查询所有分类名称
export const API_CATEGORIES = () => axios.get("/goods/categories")

//商品图片上传接口
export const API_GOODS_IMG_UPLOAD = (data) => axios.post("/goods/goods_img_upload",data)

//添加商品
export const API_GOODSADD = (data) => axios.post("/goods/add",data)

//获取商品列表
export const API_GOODSLIST = (data) => axios.get("/goods/list",{params: data})

//删除商品
export const API_GOODSDEL = (data) => axios.get("/goods/del",{params: data})

//修改商品
export const API_GOODSEDIT = (data) => axios.post("/goods/edit",data)

/*------------------------订单管理模块------------------ */

//获取订单列表
export const API_ORDERLIST = (data) => axios.get("/order/list",{params: data})

//订单查询
export const API_ORDERSEARCH = (data) => axios.get("/order/search",{params: data})

//获取订单详情
export const API_ORDERDETAIL = (data) => axios.get("/order/detail",{params: data})

//修改订单
export const API_ORDEREDIT = (data) => axios.post("/order/edit",data)

/*------------------------店铺管理模块------------------ */

//获取店铺详情
export const API_SHOPINFO = () => axios.get("/shop/info")

//店铺图片上传接口
export const API_SHOPUPLOAD = (data) => axios.post("/shop/upload",data)

//店铺内容修改
export const API_SHOPEDIT = (data) => axios.post("/shop/edit",data)

/*------------------------报表统计------------------ */

//首页报表接口
export const API_TOTALDATA = () => axios.get("/order/totaldata")

//订单报表接口
export const API_ORDERTOTAL = (data) => axios.get("/order/ordertotal",{params: data})