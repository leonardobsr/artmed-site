<template>
  <CommomContent body="ContentBody" />
</template>

<script>
export default {
  name: 'TermosUso',
  async asyncData (context) {
    await Promise.all([
      await context.store.dispatch('content/loadTermsUse')
    ])
  }
}
</script>
