<template>
  <div>
    <input
      v-model="hours"
      class="time-inputs"
      placeholder="00"
      @keydown="preventNonNumber" />
    : <input v-model="minutes" placeholder="00" @keydown="preventNonNumber" /> :
    <input v-model="seconds" placeholder="00" @keydown="preventNonNumber" />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: Partial<{
      hours: string | number
      minutes: string | number
      seconds: string | number
    }>
  }>(),
  {
    modelValue: () => ({
      hours: 0,
      minutes: 0,
      seconds: 0,
    }),
  },
)
const emits = defineEmits(['update:modelValue'])
const hours = ref(String(props.modelValue?.hours ?? ''))
const minutes = ref(String(props.modelValue?.minutes ?? ''))
const seconds = ref(String(props.modelValue?.seconds ?? ''))

function preventNonNumber(event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    return
  }

  if (isNaN(Number(event.key))) {
    event.preventDefault()
  }
}

function noIsNaN(value: string | number) {
  if (typeof value === 'string' && value === '') {
    return 0
  }

  return isNaN(Number(value)) ? 0 : parseInt(String(value))
}

watch(hours, (updatedValue) => {
  const update = {
    hours: noIsNaN(updatedValue),
    minutes: noIsNaN(minutes.value),
    seconds: noIsNaN(seconds.value),
  }
  let isAdjusted = false

  if (update.hours < 0) {
    hours.value = '0'
    isAdjusted = true
  }

  if (!isAdjusted) {
    emits('update:modelValue', update)
  }
})

watch(minutes, (updatedValue) => {
  const update = {
    hours: noIsNaN(hours.value),
    minutes: noIsNaN(updatedValue),
    seconds: noIsNaN(seconds.value),
  }
  let isAdjusted = false

  if (update.minutes > 59) {
    minutes.value = '59'
    isAdjusted = true
  } else if (update.minutes < 0) {
    minutes.value = '0'
    isAdjusted = true
  }

  if (!isAdjusted) {
    emits('update:modelValue', update)
  }
})

watch(seconds, (updatedValue) => {
  const update = {
    hours: noIsNaN(hours.value),
    minutes: noIsNaN(minutes.value),
    seconds: noIsNaN(updatedValue),
  }
  let isAdjusted = false

  if (update.seconds > 59) {
    seconds.value = '59'
    isAdjusted = true
  } else if (update.seconds < 0) {
    seconds.value = '0'
    isAdjusted = true
  }

  if (!isAdjusted) {
    emits('update:modelValue', update)
  }
})
</script>
<style lang="scss" scoped>
div {
  width: fit-content;
  margin: 0 auto;

  input {
    width: 2ch;
    box-sizing: content-box;
  }
}
</style>
