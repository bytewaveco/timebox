<template>
  <main>
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </main>
</template>

<script lang="ts" setup>
const app = useApp()

app.hook()
</script>

<style lang="scss">
:root {
  --c-text: 0, 0, 0;
  --c-background: 255, 255, 255;
  --c-primary: 1, 102, 255;
}

html,
body {
  margin: 0;
  font-size: 16px;
  font-family: 'Raleway', sans-serif;
  color: rgb(var(--c-text));
  background-color: rgb(var(--c-background));
  width: 100%;
  overflow: hidden;
  overflow-y: overlay;

  #__nuxt {
    width: 100%;

    main {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      width: 60vw;
      max-width: 600px;
      margin: 4rem auto;
    }
  }
}

h1 {
  font-size: 3.5rem;
  margin: 0.5rem 0;
}

h2 {
  font-size: 3rem;
  margin: 0.5rem 0;
}

h3 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
}

h4 {
  font-size: 2rem;
  margin: 0.5rem 0;
}

h5 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

h6 {
  font-size: 1.15rem;
  margin: 0.5rem 0;
}

p {
  margin-top: 0;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--c-primary), 0) rgba(var(--c-primary), 0.15);
}

*::-webkit-scrollbar {
  width: 4px;
}

*::-webkit-scrollbar-track {
  background: rgba(var(--c-primary), 0);
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(var(--c-primary), 0.15);
  border-radius: 0;
  border: none;
}

* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

*:-webkit-autofill,
*:-webkit-autofill:hover,
*:-webkit-autofill:focus,
*:-webkit-autofill:active {
  $box-shadow: 0 0 0 64px rgb(var(--c-background)) inset !important;
  box-shadow: $box-shadow;
  -webkit-box-shadow: $box-shadow;
}

input {
  appearance: none;
  outline: none;
  border: 2px solid rgb(var(--c-primary));
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.25rem;
  appearance: none;
  outline: none;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0.5rem;
  background-color: rgb(var(--c-primary));
  color: rgb(var(--c-background));
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 80px;
  width: fit-content;
  height: fit-content;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.full-width {
  width: 100%;
}
</style>
