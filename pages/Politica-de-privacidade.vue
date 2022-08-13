<template>
  <CommomContent body="ContentBody" />
</template>

<script>
export default {
  name: 'PoliticaPrivacidade',
  async asyncData (context) {
    await Promise.all([
      await context.store.dispatch('content/loadPolicyPrivacy')
    ])
  }
}
</script>
