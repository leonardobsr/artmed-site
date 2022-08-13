<template>
  <b-form
    class="search"
    novalidate
    @submit.stop.prevent="goToSearch"
  >
    <b-form-group
      id="query-group"
      class="search__input-group"
      :class="{ 'search__input-group--small': !isIndex, 'search__input-group--open': (hasResult && hasFocus) }"
      label-for="email"
    >
      <b-input-group>
        <b-input-group-prepend>
          <CommomSvgIcon svg="icon_search" class="search__btn search__input-group__btn search__input-group__btn--icon" />
        </b-input-group-prepend>

        <b-form-input
          id="query"
          v-model="$v.searchTerm.$model"
          type="text"
          class="search__form-control"
          :placeholder="placeholder"
          debounce="300"
          aria-autocomplete="both"
          aria-haspopup="false"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          aria-label="Pesquisar"
          required
          @focus="hasFocus = true"
        />

        <b-input-group-append>
          <b-button
            v-if="showClear"
            variant="none"
            class="search__btn search__input-group__btn search__input-group__btn--clear"
            @click="clear()"
          >
            <b-icon icon="x" />
          </b-button>
          <b-button
            v-if="!isIndex"
            class="search__btn search__input-group__btn search__input-group__btn--search"
            type="submit"
            variant="none"
          >
            Buscar
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <div v-if="hasResult && hasFocus" class="search__sugestion-container">
        <div class="search__sugestion-box">
          <div class="search__sugestion-box__divider" />
          <ul class="search__sugestion-box__list" role="listbox">
            <li
              v-for="(typeAhead, index) in typeAheadList"
              :key="index"
              class="search__sugestion-box__list-item"
              role="presentation"
            >
              <div class="search__sugestion-box__list-item-container">
                <div class="search__sugestion-box__list-item-icon" />
                <div class="search__sugestion-box__list-item-text-container" role="option">
                  <div class="search__sugestion-box__list-item-text">
                    <NuxtLink
                      class="search__sugestion-box__list-item-text__line search__sugestion-box__list-item-text__line--one"
                      :to="{ name: 'busca-slug', params: { slug: $helpers.formatToSlug(typeAhead) } }"
                    >
                      {{ typeAhead }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </b-form-group>
  </b-form>
</template>

<script>
import { mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { minLength } from 'vuelidate/lib/validators'

export default {
  name: 'Search',
  mixins: [validationMixin],
  props: {
    isIndex: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasFocus: false,
      hasResult: false,
      showClear: false
    }
  },
  computed: {
    searchTerm: {
      get () {
        return this.$store.state.search.searchTerm
      },
      set (value) {
        this.$store.commit('search/SET_SEARCHTERM', value)
      }
    },
    typeAheadList () {
      return this.$store.state.search.typeAheadList
    },
    placeholder () {
      return (this.$store.state.content.category) ? `Pesquisar em ${this.$store.state.content.category.name}` : 'Pesquisar'
    }
  },
  watch: {
    searchTerm: {
      handler (val, oldVal) {
        if (val !== null && val !== '') {
          const hasSearchTerm = (val.length > 0)
          this.showClear = hasSearchTerm
          if (hasSearchTerm && this.hasFocus) { this.loadTypeAhead(val) }
        } else {
          this.clear()
          this.showClear = false
        }
      },
      deep: true
    },
    hasFocus: {
      handler (val, oldVal) {
        if (val !== null && val !== '') {
          const hasSearchTerm = (this.searchTerm.length > 0)
          if (val && hasSearchTerm) { this.loadTypeAhead(this.searchTerm) }
        }
      },
      deep: true
    },
    typeAheadList: {
      handler (val, oldVal) {
        this.hasResult = (val !== null && val.length > 0 && this.searchTerm.length > 0)
      },
      deep: true
    }
  },
  validations: {
    searchTerm: {
      minLength: minLength(1)
    }
  },
  beforeDestroy () {
    if (this.$route.name !== 'busca' && this.$route.name !== 'busca-slug') {
      this.clear()
    }
  },
  methods: {
    clear () {
      this.$store.commit('search/SET_TYPEAHEADLIST', [])
      this.$store.commit('search/SET_SEARCHTERM', '')
    },
    ...mapActions({
      loadTypeAhead: 'search/loadTypeAhead'
    }),
    goToSearch () {
      if (this.searchTerm === undefined || this.searchTerm === '') { return }
      let route = { name: 'busca-slug', params: { slug: this.$helpers.formatToSlug(this.searchTerm) } }
      if (this.$router.currentRoute.name === 'categorias-id') {
        route = { name: 'busca-slug', params: { slug: this.$helpers.formatToSlug(this.searchTerm) }, query: { categorias: this.$router.currentRoute.params.id } }
      }
      this.$router.push(route)
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: relative;

    &__input-group,
    &__form-control,
    &__btn {
      color: var(--three);
      background: var(--background-fill);
      border: none;
      @include rem("border-radius", 12px);
    }

    &__input-group {
      border: 1px solid var(--three);
      box-shadow: none;
      @include rem("border-radius", 12px);
      z-index: 3;
      margin: 0 auto;

      & .input-group-prepend,
      & .input-group-append {
        align-items: center;
      }

      &__btn {
        display: inline-block;
        height: auto;
        @include rem("font-size", 16.8px);
        display: flex;
        height: 20px;
        @include rem("margin-left", 12px);

        &--clear {
          padding: 0;
        }

        &--icon {
          &::v-deep svg {
            @include rem("width", 20px);
            @include rem("height", 20px);
            path {
              fill: var(--three);
            }
          }
        }

        &--clear {
          display: flex;
          align-items: center;
          justify-content: center;
          @include rem("width", 20px);
          @include rem("height", 20px);
          @include rem("font-size", 26px);
          @include rem("margin", 0);
          @include rem("margin-right", 10px);
        }

        &--search {
          display: flex;
          align-items: center;
          color: var(--background-fill);
          background: var(--three);
          @include rem("height", 50px);
          @include rem("border-top-right-radius", 10px);
          @include rem("border-bottom-right-radius", 10px);
        }
      }

      &--open {
        border-bottom: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        & .search__sugestion-box__divider {
          @include rem("margin", 0 7px 0 20px);
        }
      }

      & .input-group {
        align-items: center;
      }

      &:not(.search__input-group--small) {
        @include media-breakpoint-up(sm) {
          @include rem("margin-bottom", 30px);
        }
      }
    }

    &__form-control {
      background-color: transparent;
      color: var(--three);
      word-wrap: break-word;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      // @include rem("margin-top", 6px);
      // padding: 0;
      font-weight: 400;
      @include font-computed(24px, 24px);

      &::-webkit-input-placeholder { /* Edge */
        color: var(--three);
      }

      &:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: var(--three);
      }

      &::placeholder {
        color: var(--three);
      }

      &:focus {
        box-shadow: none;
      }
    }

    &__sugestion-container {
      position: absolute;
      width: 100%;
      text-align: left;
      @include rem("margin-top", -1px);
      z-index: 3;
      cursor: default;
      -webkit-user-select: none;
    }

    &__sugestion-box {
      background: #fff;
      display: flex;
      flex-direction: column;
      list-style-type: none;
      margin: 0;
      padding: 0;
      border: 1px solid var(--three);
      @include rem("border-radius", 0 0 12px 12px);
      @include rem("padding-bottom", 4px);
      overflow: hidden;
      @include rem("left", -1px);
      position: relative;
      border-top: none;

      &__divider {
        border-bottom: 1px solid var(--three);
        @include rem("margin", 0 7px 0 20px);
      }

      &__list {
        margin: 0;
        padding: 0;
        list-style: none;
        flex: auto;
        @include rem("padding-bottom", 8px);
      }

      &__list-item {
        display: flex;
        align-items: center;
        min-width: 0;
        padding: 0;

        &-container {
          flex: auto;
          display: flex;
          align-items: center;
          @include rem("margin", 0 20px 0 14px);
          @include rem("padding-top", 12px);
        }

        &-icon {
          -webkit-mask-image: url("~/assets/images/icon_search.svg");
          mask-image: url("~/assets/images/icon_search.svg");
          background-color: #000000;
          @include rem("background-size", 20px);
          @include rem("min-height", 20px);
          @include rem("min-width", 20px);
          @include rem("height", 20px);
          @include rem("width", 20px);
          display: flex;
          align-items: center;
          @include rem("margin", 0 13px 0 6px);
        }

        &-text-container {
          display: flex;
          flex: auto;
          flex-direction: column;
          min-width: 0;
          @include rem("padding", 3px 0);
        }

        &-text {
          display: flex;
          flex: auto;
          flex-direction: column;
          @include rem("padding-right", 8px);

          &__line {
            font-weight: 400;
            word-break: break-word;
            color: #212121;
            @include font-computed(20px,24px);
          }
        }

        &:hover {
          cursor: pointer;

          * {
            color: var(--three);
          }

          .search__sugestion-box__list-item-icon {
            background-color: var(--three);
          }
        }
      }
    }
  }
</style>
