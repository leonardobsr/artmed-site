<template>
  <nav class="footer-nav">
    <ul class="footer-nav__list">
      <li
        v-if="!$auth.loggedIn"
        class="footer-nav__item"
      >
        <NuxtLink
          class="footer-nav__link"
          to="/login"
        >
          Faça seu cadastro
        </NuxtLink>
      </li>
      <li class="footer-nav__item">
        <NuxtLink
          class="footer-nav__link"
          to="/conheca-nossos-autores"
        >
          Compartilhe com os amigos
        </NuxtLink>
      </li>
      <li class="footer-nav__item">
        <span
          class="footer-nav__link"
          @click.prevent="feedback()"
        >
          Deixe um feedback
        </span>
      </li>
      <li class="footer-nav__item">
        <NuxtLink
          class="footer-nav__link"
          to="/conheca-nossos-autores"
        >
          Conheça nossos autores
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'FooterNav',
  methods: {
    feedback () {
      this.$bvModal.msgBoxOk('ss',
        this.$helpers.getModalOptions(this.$helpers.getString('alertSucessTitle'))
      )
        .then((value) => {
          console.log(value)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer-nav {
    &__list {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__item {
      @include rem("padding", 24px 0);
      border-bottom: 1px solid var(--three);

      &:last-child {
        border-bottom: none;
      }
    }

    &__link{
      cursor: pointer;
      font-weight: 400;
      @include font-computed(16px, 20px);
      /* Light/PSI - 3 */
      color: var(--three);
    }
  }
</style>
