<template>
  <div class="layout">
    <Layout style="height: 100vh">
      <fixedBar v-if="!$route.meta.withoutLayout" />
      <Layout>
        <Content
          :style="{
            background: '#fff',
            minHeight: '260px',
            overflowY: $route.name ? 'auto' : 'hidden',
            height: $route.meta.withoutLayout ? '100vh' : 'calc(100vh - 75px)',
            margin: '50px 0 25px 0'
          }"
        >
          <router-view />
          <!-- <router-view v-if="$route.name" /> -->
          <!-- <section v-else id="micro-main-frame" /> -->
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { currentVersion } from "@/assets/js/config.js";
import fixedBar from "@/components/fixedBar/fixedBar.vue";
export default {
  components: { fixedBar },
  data() {
    return {
      isCollapsed: false,
      currentVersion: currentVersion
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    storeLogo() {
      return this.$store.state.logo;
    }
  }
};
</script>
<style scoped>
/*
     * http://meyerweb.com/eric/tools/css/reset/ v2.0 | 20110126 License: none
     * (public domain)
     */

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  /*
         * font-size: 100%; font: inherit;
         */
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
  overflow: hidden;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

body {
  background: #f0f2f5;
  font-family: Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

#micro-root {
  height: 100%;
}

.layout {
  background-color: #495060;
  position: relative;
  overflow: hidden;
}

.builProject-slider {
  height: 100vh;
  left: 0;
  /*background: #22222C;*/
  top: 50px;
  /* height:1400px; */
}

.ivu-layout-sider-children ul {
  overflow-y: auto;
  height: 100vh;
}

.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
  color: #6c7980;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  font-size: 14px;
}

.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

.ivu-layout-sider-children ul li a:hover {
  color: #fff;
}

.ivu-layout-sider-children ul li a {
  color: #00acc1;
  padding: 10px 20px 10px 25px;
}

#side-menu li a span {
  font-weight: 700;
}

.ivu-layout-sider-children ul li a {
  display: block;
  padding: 10px 20px 10px 25px;
}

.router-link-active {
  background-color: #e2e7fe;
  border-radius: 20px 0px 0px 20px;
}

/*.router-link-active span {
        color: #525bff;
    }*/
.rotateIconS {
  cursor: pointer;
  margin-left: 20px;
}

.ivu-poptip-body {
  border: 1px solid #dddddd;
}

.messageBt {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  padding-left: 12px;
  border-bottom: 1px solid #464646;
  color: #fff;
  padding: 0px 15px;
  font-weight: normal;
  position: relative;
  right: 5px;
}

.messageList li {
  padding: 7px 6px 7px 0;
  border-bottom: 1px solid #464646;
}

.messageList_top {
  width: 366px;
}

.messageList li span {
  font-size: 13px;
  float: left;
  width: 26px;
  line-height: 26px;
  padding-left: 9px;
  padding-top: 1px;
  color: #888888;
  height: 30px;
}

.messageList li i {
  text-align: center;
  font-weight: bold;
  color: #323434;
}

.messageList p {
  width: 366px;
  float: left;
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: 12px;
  font-weight: bold;
}

.messageList_top {
  width: 60px;
}

.messageList li .messageTime {
  height: 17px;
  line-height: 17px;
  text-align: left;
  font-size: 11px;
  color: #76746e;
  width: 320px;
  clear: left;
  background: none;
  padding-left: 38px;
  font-style: italic;
}

.unread {
  font-size: 14px;
}

.ivu-page-simple {
  height: 40px;
  padding-top: 6px;
  /* background: #f9f9f7; */
  /* padding-left: 50px; */
  padding-left: 80px;
  padding-right: 15px;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
  background: #2b2b38 !important;
}

.ivu-menu-vertical .ivu-menu-item {
  padding: 0;
}

.ivu-menu-item,
.ivu-menu-item-active,
.ivu-menu-item-selected {
  padding-left: 0 !important;
}

.ivu-menu-item {
  margin-top: 0;
  margin-bottom: 0;
}

.ivu-select-dropdown-list .ivu-select-item {
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 20px;
}

.ivu-menu-submenu ul li a {
  padding-left: 40px;
}

[v-cloak] {
  display: none;
}

.ivu-menu-item i,
.ivu-menu-submenu-title i {
  margin-right: 6px;
  width: 14px;
}

.ivu-menu-submenu-title span {
  /*color: #00acc1;*/
  padding: 0px;
  margin: 1px;
}

.ivu-menu-submenu-title span:hover {
  color: #fff;
}

.ivu-menu-submenu-title i {
  color: #00acc1;
}

.messageList li .messageTime {
  text-align: right;
  font-weight: 700;
  color: #c3cece;
  width: 300px;
}

.messageList li i {
  text-align: center;
  font-weight: bold;
  color: #ccd7d7;
}

.ivu-tooltip-inner {
  max-width: 280px;
}

.ivu-page-simple .ivu-page-simple-pager input {
  padding: 0px !important;
}

.version-footer {
  text-align: right;
  padding: 3px 20px;
  color: #9ea7b4;
  font-size: 12px;
  font-weight: normal;
  background: #fff;
  box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.08);
}

.btn-return {
  height: 20px;
  margin-left: 25px;
  margin-bottom: 2px;
}

#messageList_operationContent {
  display: inline-block;
  width: 295px;
  height: 17px;
  word-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 10px;
  font-weight: bold;
  color: rgb(204, 213, 213);
  font-size: 12px;
  overflow: hidden;
  position: relative;
  bottom: 19px;
  left: 8px;
}
</style>
