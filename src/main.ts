import "virtual:windi.css";
import "/@/assets/style.css";

import App from "./App.vue";
import BaseLayout from "./layouts/Base.vue";
import EmptyLayout from "./layouts/Empty.vue";
import { createApp } from "vue";
import { pinia } from "./stores";
import router from "/@/router";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.component("BaseLayout", BaseLayout);
app.component("EmptyLayout", EmptyLayout);

app.mount("#app");
