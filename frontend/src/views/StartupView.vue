<template>
  <v-app>
    <v-container
      fluid
      class="fill-height"
    >
      <v-row
        no-gutters
        align="center"
        justify="center"
      >
        <v-progress-circular
          color="primary"
          size="80"
          width="8"
          indeterminate
        />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'StartupView'
}
</script>
