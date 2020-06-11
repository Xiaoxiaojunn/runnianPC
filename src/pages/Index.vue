<template>
  <el-container id="index">
    <el-aside width="220px">
      <el-menu
        unique-opened
        router
        :default-active="$route.path"
        background-color="#2d3a4b"
        text-color="#fff"
        active-text-color="#409eff"
      >
        <div v-for="item in newTreelist" :key="item.path">
          <el-submenu v-if="item.children" :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="i in item.children" :key="i.path" :index="i.path">{{ i.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="50px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in levelList" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-right">
          <span>欢迎您,{{ message }}</span>
          <img :src="head_portrait" alt="头像" />
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { API_ACCOUNTINFO } from '@/api/apis.js'
export default {
  name: "index",
  data() {
    return {
      role:'',
      levelList: [],
      message: localStorage.account,
      head_portrait: '',
      treelist: [
        { path: "/index/home", icon: "el-icon-s-home", title: "首页", role:['super','normal'] },
        { path: "/index/order", icon: "el-icon-document", title: "订单管理" ,role:['super','normal']},
        {
          path: "/index/product",
          icon: "el-icon-food",
          title: "商品管理",
          role:['super','normal'],
          children: [
            {
              path: "/index/product/list",
              title: "商品列表"
            },
            {
              path: "/index/product/add",
              title: "商品添加"
            },
            {
              path: "/index/product/class",
              title: "商品分类"
            }
          ]
        },
        { path: "/index/shops", icon: "el-icon-s-shop", title: "店铺管理",role:['super'] },
        {
          path: "/index/user/list",
          icon: "el-icon-s-custom",
          title: "账号管理",
          role:['super'],
          children: [
            {
              path: "/index/user/list",
              title: "账号列表"
            },
            {
              path: "/index/user/add",
              title: "账号添加"
            },
            {
              path: "/index/user/edit",
              title: "账号修改"
            },
            {
              path: "/index/user/self",
              title: "个人中心"
            }
          ]
        },
        {
          path: "/index/sales/goods",
          icon: "el-icon-data-line",
          title: "销售统计",
          role:['super'],
          children: [
            {
              path: "/index/sales/goods",
              title: "商品统计"
            },
            {
              path: "/index/sales/order",
              title: "订单统计"
            }
          ]
        }
      ]
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    API_ACCOUNTINFO({ id: localStorage.id }).then(res => { //获取头像
      if (res) {
        localStorage.imgUrl = res.data.accountInfo.imgUrl
        this.head_portrait = localStorage.imgUrl
      }
    });
    this.getBreadcrumb();
    this.role = localStorage.role
  },
  methods: {
    getBreadcrumb() {
      this.levelList = this.$route.meta.title.split("/");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  computed: {
    newTreelist: function() {
      return this.treelist.filter( item => item.role.includes(this.role))
    }
  }
};
</script>

<style>
#index .el-breadcrumb {
  line-height: 50px;
}
</style>
<style lang="less" scoped>
@base: #2d3a4b; //主题色
@font_color: #409eff; //蓝色
@font_con_color: #606266;
@background_color: #f0f2f5;
.el-container {
  height: 100%;
  .el-aside {
    background-color: @base;
  }
  .el-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .header-right {
      line-height: 50px;
      font-size: 14px;
      color: @font_con_color;
      img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        vertical-align: middle;
        margin-left: 30px;
        margin-right: 20px;
        margin-top: -2px;
      }
    }
  }
  .el-main {
    background-color: @background_color;
  }
  .el-menu {
    border-right: none;
  }
}
</style>