<template>
  <main class="container content__body">
    <b-row>
      <aside class="col col-md-3">
        <SearchFilterCategories @filtered="loadByFilter" />
      </aside>
      <section class="col col-md-9">
        <template v-if="Contents.length > 0">
          <h3 class="filter-categories__label">
            Resultados encontrados
          </h3>
          <CommomNavSection
            :items="Contents"
            property-label="name"
            property-locked="premium"
            property-category="category"
          />
          <infinite-loading v-if="Contents.length >= 20" @infinite="infiniteHandler" />
        </template>
        <template v-else>
          <HomeEmptySection
            style="  display: flex; justify-content: center;"
            icon="icon_search"
            :text="`Nenhum resultado encotrado para ${searchTerm}`"
          />
        </template>
      </section>
    </b-row>
  </main>
</template>

<script>
// TODO: carregar sugestoes

// TODO: colocar na url as categorias e especialidade (funcionais para poder compartilhar link da busca)

// TODO: a partir da pagina de categorias ao efetuar uma busca precisa enviar a cetegoria

// TODO: typeahead enviar categoria e especialidade
// TODO: sugestion enviar categoria e especialidade

// TODO: Pesquisar com filtro de especialidade
import { mapActions } from 'vuex'

export default {
  name: 'Body',
  computed: {
    Categories () {
      return this.$store.state.categories.items
    },
    Contents () {
      return this.$store.state.search.contents
    },
    searchTerm () {
      return this.$store.state.search.searchTerm.slice()
    }
  },
  methods: {
    debounce (func, timeout = 500) {
      let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
      }
    },
    ...mapActions([
      'search/load'
    ]),
    ...mapActions({
      searchLoad: 'search/load'
    }),
    infiniteHandler ($state) {
      this.searchLoad({ searchTerm: this.$route.params.slug || '', loadMore: true })
        .then((data) => {
          if (data.length > 0) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
    },
    loadByFilter () {
      this.debounce(this.searchLoad({ searchTerm: this.$route.params.slug || '', loadMore: false }))
    }
  }
}
</script>

<style lang="scss" scoped>
  .content__body {
    @include rem("margin-top", 12px);
  }
</style>
