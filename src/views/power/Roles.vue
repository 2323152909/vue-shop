<template>
  <div>
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in props.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(item1.id, props.row)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过v-for循环 嵌套渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' :'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(item2.id, props.row)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, index3) in item2.children" :key="item3.id" closable @close="removeRightById(item3.id, props.row)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!-- 索引列 -->
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="getRoleById(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%">
      <el-form :model="addRoleForm" :rules="RoleFormRules" ref="addRoleFormReg" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="50%">
      <el-form :model="editRoleForm" :rules="RoleFormRules" ref="editRoleFormReg" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" empty-text="无权限可供分配！" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="rightTreeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, getRoleById, editRole, delRole, delRightById, getRights, setRights } from '../../network/power'

export default {
  name: 'roles',
  data() {
    return {
      // 所有角色数据列表
      rolesList: [],
      // 控制添加角色弹窗
      addRoleDialogVisible: false,
      // 添加角色表单数据对象
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色表单数据验证(添加和修改通用)
      RoleFormRules: {
        roleName: [
          { required: true, message: "请填写角色名", trigger: "blur" }
        ]
      },
      // 控制修改角色信息弹窗
      editRoleDialogVisible: false,
      editRoleForm: {
        rid: '',
        roleName: '',
        roleDesc: ''
      },
      // 控制分配权限对话框显示
      setRightDialogVisible: false,
      // 所有权限数据列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      // 默认选中的结点id值数组
      defKeys:[],
      // 当前即将分配权限的角色id
      currentRoleId:''
    }
  },
  created() {
    // 调用获取所有角色数据列表
    this.getRolesList();
  },
  methods: {
    // 获取所有角色数据列表
    async getRolesList() {
      const { data: res } = await getRoles();
      if (res.meta.status !== 200) return this.$message.error("获取角色数据失败！");
      // console.log(res);
      this.rolesList = res.data;
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleFormReg.validate(async (valid) => {
        if (!valid) return this.$message.error("请将角色名称填写完整！")
        const { data: res } = await addRole(this.addRoleForm)
        if (res.meta.status !== 201) return this.$message.error("添加角色失败！");
        this.$message.success("添加角色成功！");

        this.addRoleDialogVisible = false;
        this.getRolesList();
      })
    },
    // 通过id查询角色信息
    async getRoleById(rid) {
      const { data: res } = await getRoleById(rid);
      if (res.meta.status !== 200) return this.$message.error("获取用户数据失败！");
      this.editRoleForm.rid = res.data.roleId
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      // 打开修改角色弹窗
      this.editRoleDialogVisible = true
    },
    // 修改角色
    editRole() {
      // 判断是否满足规则
      this.$refs.editRoleFormReg.validate(async (valid) => {
        if (!valid) return this.$message.error("有必填项未填写！");
        const { data: res } = await editRole(this.editRoleForm.rid, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        });
        if (res.meta.status !== 200) return this.$message.error("修改角色失败！")
        this.$message.success("修改角色成功！");
        this.getRolesList();
        this.editRoleDialogVisible = false;
      })
    },
    // 删除角色
    removeRole(rid) {
      this.$confirm("该操作会永久删除角色信息，你确定要继续嘛？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await delRole(rid);
        if (res.meta.status !== 200) return this.$message.error("删除角色失败！")
        this.$message.success("成功删除角色")
        this.getRolesList();
      }).catch(() => {
        return this.$message.info("成功取消该操作！")
      })
    },
    // 根据id删除对应的权限
    async removeRightById(rightId, role) {
      // 弹框提示用户是否进行删除
      const confirmResult = await this.$confirm("该操作将永久移除该权限，是否继续？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info("成功取消删除操作！")
      };
      const { data: res } = await delRightById(role.id, rightId);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色对应权限失败！");
      }
      // this.$message.success("删除权限成功！");
      // 删除权限后，给角色重新赋权限
      role.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 将当前角色id保存到 data 中，方便配置权限时使用
      this.currentRoleId = role.id;
      // 获取所有权限数据
      const { data: res } = await getRights('tree');
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！")
      }
      // 把获取到的数据保存到 data 中
      this.rightsList = res.data;
      // console.log(this.rightsList);

      // 递归获取三级结点
      // 获取之前先清空
      // this.defKeys = [];
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并且保存到 defKeys 数组中
    getLeafKeys(node, arr){
      // 如果当前node结点不包含children属性，则为三级结点，将其保存到arr数组中去
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defKeys = [];
    },
    // 为角色分配所选权限
    async allotRights(){
      // 获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点
      const keys = [
        // 将所有选中的结点的权限 id数组解构
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        // 将所有半选中状态的结点的权限 id数组解构
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ];
      // 以逗号作为分割分，将 keys 转化为字符串
      const idStr = keys.join(',')
      const { data:res } = await setRights(this.currentRoleId, {
        rids: idStr
      });
      // console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error("分配权限失败！")
      }
      this.$message.success("分配权限成功！");
      // 重新获取角色
      this.getRolesList();
      // 关闭分配权限弹窗
      this.setRightDialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 定义的一个使其垂直居中的类
.vcenter {
  display: flex;
  align-items: center;
}
</style>