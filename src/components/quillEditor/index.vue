<template>
  <div class="quillEditorBox">
    <quill-editor ref="newEditor" v-model="ruleForm.content" class="editor" :options="editorOption" @change="onEditorChange($event)" />
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// import { ImageDrop } from "quill-image-drop-module";
// import ImageResize from "quill-image-resize-module";
// Quill.register("modules/imageDrop", ImageDrop);
// Quill.register("modules/imageResize", ImageResize);
import { Quill, quillEditor } from "vue-quill-editor";
import Video from "@/utils/video.js";
Quill.register(Video, true);
import quillConfig from "@/utils/quill-config";

export default {
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editorOption: quillConfig,
      ruleForm: {
        content: "",
      },
    };
  },
  components: { quillEditor },
  watch: {
    content() {
      this.ruleForm.content = this.content;
    },
  },
  created() {
    this.ruleForm.content = this.content;
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.ruleForm.content = html;
      this.ruleForm.contentText = text;
      this.$emit("change", this.ruleForm.content);
    },
  },
};
</script>
<style lang="scss">
.ql-editor {
  min-height: 200px;
}
.ql-snow .ql-picker-label {
  display: flex;
}
</style>
