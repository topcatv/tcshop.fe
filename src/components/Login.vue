<template>
  <Form ref="userForm"
        class="login_form"
        label-position="top"
        :model="user"
        :rules="ruleInline">
    <h1>后台管理系统</h1>
    <Form-item prop="user" label="用户名">
      <Input type="text"
             v-model="user.username"
             placeholder="用户名">
      <Icon type="person"
            slot="prepend"></Icon>
      </Input>
    </Form-item>
    <Form-item prop="password" label="密码">
      <Input type="password"
             v-model="user.password"
             placeholder="密码">
      <Icon type="locked"
            slot="prepend"></Icon>
      </Input>
    </Form-item>
    <Form-item prop="captcha" label="验证码">
      <Input type="text"
             v-model="user.captcha"
             placeholder="验证码">
      <Icon type="locked"
            slot="prepend"></Icon>
      </Input>
    </Form-item>
    <Alert v-if="warn" type="warning" show-icon>{{warn}}</Alert>
    <img src="/api/images/kaptcha.jpg" style="width: 100px; height: 80px"/>
    <Form-item>
      <Button type="primary" @click="handleSubmit('userForm')">登录</Button>
    </Form-item>
  </Form>
</template>
<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let user = this.user
          this.login(user)
        }
      })
    }
  },
  computed: {
    ...mapState({
      warn: 'warn'
    })
  }
}
</script>

<style scoped>
.login_form {
  margin: 160px auto 0;
  width: 400px;
}
h1 {
  text-align: center;
  padding: 0 0 20px;
}
</style>
