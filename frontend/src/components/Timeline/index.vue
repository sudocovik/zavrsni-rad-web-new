<template>
    <v-timeline
        dense
    >
        <slot />
    </v-timeline>
</template>

<script>
export default {
  name: 'Timeline'
}
</script>

<style lang="sass">
.custom-timeline-item > .v-timeline-item__body
    display: flex
    align-items: center
    gap: 25px
</style>
