const startClass = "node-start";
const activityClass = "node-activity";
const gatewayClass = "node-gateway";
const captureyClass = "node-capture";
const endClass = "node-end";

export default {
  start: [
    {
      text: "开始节点",
      type: "StartNoneEvent",
      class: startClass,
      src: require("../assets/img/start.svg")
    },
    {
      text: "定时节点",
      type: "timerStart",
      class: startClass + "-timer",
      src: require("../assets/img/timer-start.svg")
    },
    {
      text: "消息节点",
      type: "messageStart",
      class: startClass + "-message",
      src: require("../assets/img/message-start.svg")
    },
    {
      text: "信号节点",
      type: "signalStart",
      class: startClass + "-signal",
      src: require("../assets/img/signal-start.svg")
    }
  ],
  activity: [
    {
      text: "用户任务",
      type: "UserTask",
      class: activityClass,
      src: require("../assets/img/user-task.svg")
    },
    {
      text: "脚本节点",
      type: "scriptTask",
      class: activityClass + "-script",
      src: require("../assets/img/script-task.svg")
    },
    {
      text: "自定义类节点",
      type: "javaTask",
      class: activityClass + "-java",
      src: require("../assets/img/java-task.svg")
    },
    {
      text: "邮件节点",
      type: "mailTask",
      class: activityClass + "-mail",
      src: require("../assets/img/mail-task.svg")
    },
    {
      text: "接收节点",
      type: "receiveTask",
      class: activityClass + "-receive",
      src: require("../assets/img/receive-task.svg")
    }
  ],
  gateway: [
    {
      text: "排他网关",
      type: "ExclusiveGateway",
      class: gatewayClass + "-exclusive",
      src: require("../assets/img/exclusive-gateway.svg")
    },
    {
      text: "并行网关",
      type: "ParallelGateway",
      class: gatewayClass + "-parallel",
      src: require("../assets/img/parallel-gateway.svg")
    },
    {
      text: "包容网关",
      type: "InclusiveGateway",
      class: gatewayClass + "-inclusive",
      src: require("../assets/img/inclusive-gateway.svg")
    }
  ],
  capture: [
    {
      text: "定时节点",
      type: "timerCatch",
      class: captureyClass + "-timer",
      src: require("../assets/img/timer-catch.svg")
    },
    {
      text: "消息节点",
      type: "messageCatch",
      class: captureyClass + "-message",
      src: require("../assets/img/message-catch.svg")
    },
    {
      text: "信号节点",
      type: "signalCatch",
      class: captureyClass + "-signal",
      src: require("../assets/img/signal-catch.svg")
    }
  ],
  end: [
    {
      text: "结束节点",
      type: "EndNoneEvent",
      class: endClass,
      src: require("../assets/img/end.svg")
    }
  ]
};
