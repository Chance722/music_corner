<template>
	<div class="info-view">
		<div class="admin_pic">
      <label>头像</label>
      <span class="img">
        <img :src="userImage">
      </span>
      <i class="arrow-btn"></i>
      <input type="file" ref="fileInput" @change="selectFile($event)" />
    </div>
    <div class="admin_name">
      <label>账号</label>
      <span>{{userInfo && userInfo.name}}</span>
      <i @click="linkToEdit('account', userInfo.name)" class="arrow-btn"></i>
    </div>
    <div class="admin_pwd">
      <mt-button @click="linkToEdit('password')" class="btn">修改密码</mt-button>
    </div>
	</div>
</template>

<script>
import { Button } from 'mint-ui'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'
import api from '@/api'
export default {
	name: 'info-view',
	data () {
		return {
      defaultImg: 'http://pcd4kcit1.bkt.clouddn.com/default.png',
      userImage: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    getUserImage () {
      if (this.userInfo && this.userInfo.avator) {
        this.userImage = this.userInfo.avator
      } else {
        this.userImage = this.defaultImg
      }
    },
    linkToEdit (type, data) {
      this.$router.push({
        name: 'edit',
        query: {
          type: type,
          data: data
        }
      })
    },
    checkFile (filePath) {
      let allImgExt = '.jpg|.jpeg|.gif|.bmp|.png|'
      let extName = filePath.substring(filePath.lastIndexOf(".")).toLowerCase()
      if (allImgExt.indexOf(extName+'|') == -1) {
				return false
			} else {
        return true
      }
    },
    selectFile (e) {
      let filePath = this.$refs.fileInput.value
      if (!this.checkFile(filePath)) {
        Toast('请选择正确格式的图片')
        return
      }
      let file = e.target.files[0]
      let formData = new FormData()
      let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
      }
      let params = {
        'filename': this.userImage
      }
      formData.append('params', JSON.stringify(params))
      formData.append('file', file)
      this.$axios.post(api.upload, formData, config).then(res => {
        if (res.data.code === 0) {
          this.userImage = res.data.data.imageUrl
          this.updateImage(this.userImage)
        } else {
          Toast(res.data.message)
        }
      })
    },
    updateImage (url) {
      this.$axios({
        url: api.updateAdmin,
        method: 'post',
        data: {
          params: {
            type: 2,
            avator: url
          }
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
  },
  created () {
    this.getUserImage()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/common.scss';
.info-view{
  div{
    background: #fff;
    padding: rem(20) 0;
    margin: 0 rem(20);
    position: relative;
    height: rem(100);
    line-height: rem(100);
    label,span{
      display: inline-block;
      vertical-align: middle;
    }
    @include fixLinkBlink;
    label{
      padding-left: rem(40);
    }
    span{
      position: absolute;
      right: rem(80);
      top: 50%;
      transform: translateY(-50%);
    }
    span.img{
      width: rem(110);
      height: rem(110);
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  div:not(:last-child){
    border-bottom: 1px solid #eee;
    i.arrow-btn{
      display: inline-block;
      position: absolute;
      width: rem(80);
      height: rem(80);
      right: rem(-20);
      top: 50%;
      transform: translateY(-50%);
      background: {
        image: url(../assets/images/arrow-right.png);
        size: 100% 100%;
      }
    }
    input[type=file]{
      position: absolute;
      width: rem(80);
      height: rem(80);
      right: rem(-20);
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
    }
  }
  div:nth-child(1){
    height: rem(120);
    line-height: rem(120);
  }
  .admin_pwd{
    margin-top: rem(100);
  }
}
</style>