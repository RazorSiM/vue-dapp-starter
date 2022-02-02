<template>
  <label
    class="rounded-2xl p-3 flex flex-col gap-3 transition"
    :class="[inputClasses, { [animationClasses]: !ready }]"
  >
    <span class="w-full font-medium text-sm">{{ props.label }}</span>
    <div class="flex items-center">
      <span
        v-if="props.readOnly"
        class="bg-white/10 rounded-md p-1.5 text-sm font-semibold leading-none mr-1.5"
        >USDC</span
      >
      <input
        :readonly="props.readOnly"
        :value="props.modelValue"
        class="w-full text-base leading-[1rem] bg-transparent font-poppins font-semibold focus:(outline-none)"
        type="number"
        :disabled="props.disabled"
        :step="props.step"
        :min="props.min"
        :max="props.max"
        @input="emits('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keydown="handleKeydown($event)"
      />
      <div v-if="!props.readOnly && props.controls" class="flex gap-1">
        <button
          class="border border-white border-opacity-10 rounded h-5 w-5 flex items-center justify-center p-0.2 focus:(outline-none border-gray-500) active:(bg-gray-500)"
          :disabled="
            parseFloat(props.modelValue) <= props.min || props.disabled
          "
          @click="emits('update:modelValue', handleDecrease())"
        >
          <IconPixelarticonsMinus />
        </button>
        <button
          class="border border-white border-opacity-10 rounded h-5 w-5 flex items-center justify-center p-0.2 focus:(outline-none border-gray-500) active:(bg-gray-500)"
          :disabled="
            parseFloat(props.modelValue) >= props.max || props.disabled
          "
          @click="emits('update:modelValue', handleIncrease())"
        >
          <IconPixelarticonsPlus />
        </button>
      </div>
      <div v-if="props.maxButton">
        <button
          class="bg-white/10 rounded-md p-1.5 text-sm font-semibold leading-none mr-1.5 transition focus:(outline-none ring-1 ring-gray-500) active:bg-white/5"
          @click="emits('update:modelValue', props.max.toString())"
        >
          MAX
        </button>
      </div>
    </div>
  </label>
</template>
<script setup lang="ts">
const emits = defineEmits([
  "update:modelValue",
  "update:increase",
  "update:decrease",
]);
const props = defineProps({
  modelValue: {
    type: String,
    default: "1",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "label",
  },
  step: {
    type: Number,
    default: 1,
  },
  toFixed: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10000,
  },
  min: {
    type: Number,
    default: 1,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: false,
  },
  maxButton: {
    type: Boolean,
    default: false,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  onlyIntegers: {
    type: Boolean,
    default: false,
  },
});
const handleKeydown = (event: KeyboardEvent) => {
  if (
    props.onlyIntegers &&
    (event.key === "." ||
      event.key === "," ||
      event.key === "-" ||
      event.key === "+" ||
      event.key === "e")
  ) {
    event.preventDefault();
  }
};
const handleDecrease = () => {
  if (
    parseFloat(props.modelValue) !== NaN &&
    props.modelValue !== "NaN" &&
    props.modelValue !== ""
  ) {
    return (parseFloat(props.modelValue) - props.step).toFixed(props.toFixed);
  }
  return "1";
};
const handleIncrease = () => {
  if (
    parseFloat(props.modelValue) !== NaN &&
    props.modelValue !== "NaN" &&
    props.modelValue !== ""
  ) {
    return (parseFloat(props.modelValue) + props.step).toFixed(props.toFixed);
  }
  return "1";
};
let animationClasses = $ref("");
const { ready, start } = useTimeout(1000, { controls: true });
if (props.animated) {
  watch(
    () => props.modelValue,
    async (value, prevValue) => {
      if (parseFloat(prevValue) > parseFloat(value)) {
        animationClasses =
          "animate-flash animate-duration-1000 bg-green-500/10";
        start();
      } else {
        animationClasses = "animate-flash animate-duration-1000 bg-red-500/10";
        start();
      }
    }
  );
}
let inputClasses = $computed(() => {
  if (props.disabled) {
    return "bg-black/10 border border-white/10 opacity-40";
  }
  if (props.readOnly) {
    return "bg-black/10 border border-white/10";
  }
  if (
    parseFloat(props.modelValue) > props.max ||
    parseFloat(props.modelValue) < props.min
  ) {
    return "border border-red-500 border-opacity-50";
  } else {
    return "border border-white border-opacity-10";
  }
});
</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
