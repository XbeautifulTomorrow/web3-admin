<template>
  <div class="content mall-add">
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane name="zh_CN" label="中文">
        <el-row>
          <el-col :span="23">
            <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="130px">
              <el-form-item label="板块" prop="project">
                <el-select v-model="ruleForm.project" style="width: 300px" @change="changeSection" placeholder="请选择板块" clearable>
                  <el-option :label="item.text" :value="item.val" v-for="(item, index) in projectOps" :key="index"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标题名称" prop="title">
                <el-input v-model="ruleForm.title" style="width: 300px" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="公告内容" prop="contentHtml">
                <quillEditor class="ql-editor" :content="ruleForm.contentHtml" @change="onEditorChange"></quillEditor>
              </el-form-item>

              <el-form-item label="是否强提醒" prop="forcedSwitch">
                <el-radio-group v-model="ruleForm.forcedSwitch" @change="changeForced">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否是重要公告" prop="importantSwitch">
                <el-radio-group v-model="ruleForm.importantSwitch" @change="changeImportant">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="en_US" label="英文">
        <el-row>
          <el-col :span="23">
            <el-form ref="ruleForm2" class="add-form" :model="ruleForm2" label-width="130px">
              <el-form-item label="板块">
                <el-select v-model="ruleForm2.project" style="width: 300px" placeholder="请选择板块" @change="changeSection" clearable>
                  <el-option :label="item.text" :value="item.val" v-for="(item, index) in projectOps" :key="index"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标题名称">
                <el-input v-model="ruleForm2.title" style="width: 300px" placeholder="请输入名称" />
              </el-form-item>

              <el-form-item label="公告内容">
                <quillEditor class="ql-editor" :content="ruleForm2.contentHtml" @change="onEditorChange2"></quillEditor>
              </el-form-item>
              <el-form-item label="是否强提醒">
                <el-radio-group v-model="ruleForm2.forcedSwitch" @change="changeForced">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否是重要公告">
                <el-radio-group v-model="ruleForm2.importantSwitch" @change="changeImportant">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-row style="margin-top: 50px">
      <el-button type="primary" plain @click="resetForm()">取消</el-button>
      <el-button type="primary" @click.native.prevent="submitCofirm()">保存</el-button>
    </el-row>
  </div>
</template>
<script>
import quillEditor from "@/components/quillEditor";
export default {
  name: "AddNotice",
  data() {
    var checkIntNumMaxThree = (rule, value, callback) => {
      const reg = /^\d{0,3}$/;
      if (!value) {
        return callback(new Error("请输入"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback("请输入不超过3位数的整数");
      }
    };
    return {
      active: "zh_CN",
      projectOps: [
        {
          text: "云算力",
          val: "cloud_fil",
        },
        {
          text: "POW",
          val: "x_pool_pow",
        },
      ],
      ruleForm: {
        language: "zh_CN",
        title: "",
        project: "",
        content: "",
        contentHtml: "",
        forcedSwitch: 0,
        importantSwitch: 0,
      },
      ruleForm2: {
        language: "en_US",
        title: "",
        project: "",
        content: "",
        contentHtml: "",
        forcedSwitch: 0,
        importantSwitch: 0,
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        project: [{ required: true, message: "请选择板块", trigger: "blur" }],
        contentHtml: [{ required: true, message: "请输入公告内容", trigger: "blur" }],
        forcedSwitch: [{ required: true, trigger: "blur" }],
        importantSwitch: [{ required: true, trigger: "blur" }],
      },
      timer: null,
      timer2: null,
    };
  },
  components: { quillEditor },

  created() {
    const { id } = this.$route.query;
    if (id) {
      this.getBannerInfo(id);
      this.id = id;
    }
  },
  methods: {
    async getBannerInfo(id) {
      let res = await this.$http.queryAnnouncement({ annId: id });
      if (res) {
        res.forEach((element) => {
          if (element.language == "zh_CN") {
            this.ruleForm = element;
          }
          if (element.language == "en_US") {
            this.ruleForm2 = element;
          }
        });
      }
    },
    changeSection(event) {
      this.ruleForm.project = event;
      this.ruleForm2.project = event;
    },
    changeForced(event) {
      this.ruleForm.forcedSwitch = event;
      this.ruleForm2.forcedSwitch = event;
    },
    changeImportant(event) {
      this.ruleForm.importantSwitch = event;
      this.ruleForm2.importantSwitch = event;
    },
    resetForm() {
      this.$router.push({ name: "noticeList" });
    },
    onEditorChange({ quill, html, text }) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.ruleForm.content = text;
      }, 300);
    },
    onEditorChange2({ quill, html, text }) {
      clearTimeout(this.timer2);
      this.timer2 = setTimeout(() => {
        this.ruleForm2.content = text;
      }, 300);
    },
    //保存
    async submitCofirm() {
      //表单1验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;

        let ruleForm1 = [this.ruleForm];

        if (this.ruleForm2.title != "") {
          ruleForm1.push(this.ruleForm2);
        }

        let isEbit = false;

        //判断有没有id传进来，有就是修改
        console.log(ruleForm1);
        ruleForm1.forEach((event) => {
          if (event.id) {
            isEbit = true;
          }
        });

        if (isEbit) {
          let res = await this.$http.updateAnnouncement(ruleForm1);
          this.$router.push({ name: "noticeList" });
          if (res) {
            this.$message.success("操作成功！");
          }
        } else {
          let res = await this.$http.saveAnnouncement(ruleForm1);
          if (res) {
            this.$message.success("操作成功！");
            this.$router.push({ name: "noticeList" });
          }
        }
      });
    },

    save() {
      var obj = {};
      obj = this.arrayList.map((index) => {
        return { ...this.$ref.cond[index].onsubmint() };
      });
      console.log(obj);
    },

    foramtImgs(imgs) {
      let fileList = [];
      if (Array.isArray(imgs) && imgs.length > 0) {
        fileList = imgs.map((d, i) => ({ name: i, url: d || "" }));
      }
      return fileList;
    },
  },
};
</script>
<style lang="scss" scoped>
.mall-add {
  .el-form-item .el-upload--picture-card,
  .el-upload-list__item {
    width: 80px;
    height: 80px;
    line-height: 88px;
  }
}

.file-imgs {
  /deep/.el-tabs__header {
    display: none;
  }
}
/deep/.ql-container {
  height: 400px;
}

.price-box {
  margin: 0;
}

.ql-editor {
  padding: 0;
  >>> .ql-container {
    height: calc(100% - 83px);
  }
}

.el-textarea__inner {
  min-height: 100px !important;
}
.ql-editor-container {
  padding-left: 20px;
}
.el-row:nth-child(2) {
  text-align: center;
}
</style>
