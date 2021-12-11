import "virtual:windi.css";
import "~/assets/style.css";

import App from "./App.vue";
import BaseLayout from "./layouts/BaseLayout.vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";
import { createApp } from "vue";
import { pinia } from "./stores";
import router from "~/routes";
import urql from "@urql/vue";

const app = createApp(App);

app.use(urql, {
  url: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});
app.use(router);
app.use(pinia);
app.component("BaseLayout", BaseLayout);
app.component("EmptyLayout", EmptyLayout);

app.mount("#app");
