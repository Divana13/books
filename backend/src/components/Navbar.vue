<template>
  <div>
    <Disclosure as="nav" class="bg-primary" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex shrink-0 items-center">
              <img class="h-8 w-auto" src="/imgs/logo.webp" alt="Your Company" />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <router-link v-for="item in navigation" :key="item.name" :to="item.to" :class="[route.name === item.to.name ? 'bg-secondary text-primary' : 'text-white hover:bg-accent hover:text-white', 'rounded-md px-6 py-2 text-sm font-medium']" class="cursor-pointer">{{ $t(item.name) }}</router-link>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="relative flex text-white">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <span>{{ $t('navbar.setting')}}</span>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div class="px-4 py-2" :class="isBookRoute  ? '' : 'hidden'">
                    <button @click="createShare">{{ $t('navbar.linkShare') }}</button>
                  </div>
                  <div class="px-4 py-2 md:hidden block">
                    <button @click="createShortcut">{{ $t('navbar.shortcut') }}</button>
                  </div>
                  <div class="px-4 py-2">
                    <select v-model="currentLanguage" @change="changeLanguage">
                      <option value="kh">ខ្មែរ</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
  
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :to="item.to" :class="[route.name === item.to.name ? 'bg-light-green text-dark-green' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']">{{ $t(item.name) }}</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <router-view></router-view>  
  </div>
</template>

<script setup>
    import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems } from '@headlessui/vue'
    import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import { ref, computed } from 'vue';

    const route = useRoute();
    const { locale} = useI18n();
    const currentLanguage = ref(locale.value);

    const changeLanguage = () => {
      locale.value = currentLanguage.value;
      localStorage.setItem('language', currentLanguage.value);
    }
    const navigation = [
    { name: 'navbar.book', to: {name: 'BookView'} },
    { name: 'navbar.photo', to: {name: ''}, },
    ]

    const createShortcut = () => {
      if ('homescreen' in navigator) {
        navigator.homescreen.install();
      } else {
        alert('Your browser doesn\'t support adding shortcuts.');
      }
    };
    const createShare = () => {
      const currentUrl = window.location.href; // Get the full current URL
      if ('share' in navigator) {
        navigator.share({
          title: book,
          url: currentUrl
        }).catch(console.error);
      } else {
        alert(`Share this link: ${currentUrl}`);
      }
    };

    // Check if the route matches the condition
    const isBookRoute = computed(() => {
      const bookId = route.params.id; // Check if the route contains `id` parameter
      return route.name === 'BookDetail' && !!bookId; // Adjust condition based on your route name
    });
</script>