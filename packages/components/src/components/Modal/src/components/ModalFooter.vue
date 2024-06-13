<script setup lang="ts">
import {defineProps} from 'vue';
import {footerProps} from '../props';
import {cancel, submit} from '../config';

const props = defineProps(footerProps);
</script>

<template>
  <div :class="['component-modal-footer']"   v-if="!!footer">
    <el-button>
      {{ cancel.label }}
    </el-button>
    <el-button>
      {{ submit.label }}
    </el-button>
  </div>
</template>
