<template>
  <input
    :value="props.modelValue"
    class="py-1 pl-2 rounded-lg w-full text-opacity-40 transition bg-light-900 focus:(outline-none bg-light-700 border-light-900 text-opacity-100) dark:( bg-gray-900 text-white border-2 border-gray-800) dark:focus:(outline-none bg-gray-800 border-gray-900 text-opacity-100)"
    :type="props.type"
    :placeholder="props.placeholder"
    @input="emits('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts" setup>
// import {PropType} from "vue"
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

const emits = defineEmits(["update:modelValue"]);
</script>
