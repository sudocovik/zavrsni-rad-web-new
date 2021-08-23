<template>
    <v-card class="custom-timeline-item-card">
        <v-card-text>
            <span>
                <slot />
            </span>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'TimelineItemContent'
}
</script>

<style lang="sass">
.custom-timeline-item-card
    flex: auto
</style>
