import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Mixins from './mixins'
import EncryptionMixin from './mixins/encryption'


const app = createApp(App).use(store).use(router).mixin(Mixins).mixin(EncryptionMixin).mount('#app')
