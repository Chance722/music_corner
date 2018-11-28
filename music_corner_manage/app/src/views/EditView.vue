<template>
  <div class="edit-view">
    <div class="edit-panel">
      <template v-if="editType === 'account'">
        <div class="edit-item">
          <label>账号:</label>
          <input type="text" v-model="editData">
        </div>
      </template>
      <template v-else-if="editType === 'password'">
        <div class="edit-item">
          <label>旧密码:</label>
          <input type="password" v-model="oldpassword">
        </div>
        <div class="edit-item">
          <label>新密码:</label>
          <input type="password" v-model="newpassword">
        </div>
      </template>
    </div>
    <div class="admin_pwd pdt50">
      <mt-button type="primary" @click="save()" class="btn">保存</mt-button>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      editType: this.$route.query.type,
      editData: this.$route.query.data,
      oldpassword: '',
      newpassword: ''
    }
  },
  methods: {
    save () {
      if (this.editType === 'account' && !this.editData) {
        Toast('账号不能为空')
        return
      } else if (this.editType === 'password' && (!this.newpassword || !this.oldpassword)) {
        Toast('密码不能为空')
        return
      }
      let params = this.editType === 'password' ? {
        type: 3,
        newpassword: this.newpassword,
        oldpassword: this.oldpassword
      } : {
        type: 1,
        name: this.editData
      }
      this.$axios({
          url: api.updateAdmin,
          method: 'post',
          data: {
            params: params
          },
          headers: {
            'authorization': localStorage.getItem('userToken') || ''
          }
        }).then(res => {
          if (res.data.code === 0) {
            Toast('保存成功')
            this.$eventhub.$emit('UPDATE_USER_INFO')
          } else {
            Toast(res.data.message)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../assets/css/common.scss';
.edit-view{
  padding-top: rem(50);
  div.edit-item{
    margin: 0 auto;
    position: relative;
    width: 90%;
    height: rem(70);
    margin-bottom: rem(50);
    label{
      height: rem(74);
      display: inline-block;
      vertical-align: middle;
      width: 20%;
      line-height: rem(74);
      text-align: center;
      position: absolute;
      left: 0;
      top: 0;
      color: #000;
      &:after{
        content: '';
        display: inline-block;
        width: 1px;
        height: rem(60);
        background: #e0e0e0;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    input{
      width: 80%;
      border: 1px solid #e0e0e0;
      height: rem(66);
      border-radius: rem(5);
      outline: none;
      text-indent: rem(20);
      padding-left: 20%;
    }
  }
  .pdt50{
    width: 90%;
    margin: 0 auto;
    padding-top: rem(100);
  }
}
</style>
