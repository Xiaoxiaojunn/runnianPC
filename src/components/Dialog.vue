<template>
  <div>
    <el-dialog
      v-if="dialogOption.type === 'text'"
      :title="dialogOption.title"
      :visible.sync="dialogOption.dialog"
      width="30%"
      center
    >
      <span>{{ dialogOption.text }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOption.dialog = false">取 消</el-button>
        <el-button type="primary" @click="$emit(dialogOption.summit)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogOption.type === 'table'"
      :title="dialogOption.title"
      :visible.sync="dialogOption.dialog"
    >
      <el-form :model="dialogOption.params">
        <el-form-item label="账号名" :label-width="formLabelWidth">
          <el-input v-model="dialogOption.params.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="dialogOption.params.userGroup">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOption.dialog = false">取 消</el-button>
        <el-button type="primary" @click="$emit(dialogOption.summit)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="dialogOption.type === 'table-product-add'"
      :title="dialogOption.title"
      :visible.sync="dialogOption.dialog"
    >
      <el-form :model="dialogOption.params">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="dialogOption.params.cateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="即时配送" :label-width="formLabelWidth">
          <el-switch v-model="dialogOption.params.state"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOption.dialog = false">取 消</el-button>
        <el-button type="primary" @click="$emit(dialogOption.summit)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  props: ["dialogOption"]
};
</script>

<style lang="scss" scoped>
</style>