<template>
    <div class="date-index">
        <div class="months">
            <span v-for="m in months" :key="m">{{ m }}</span>
        </div>
        <div class="days">
            <span v-for="d in 31" :key="d">{{ String(d).padStart(2, '0') }}</span>
        </div>
    </div>
</template>

<script setup>
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
</script>

<style scoped>
.date-index {
    font-family: 'OMYuPretty';
    text-align: center;
    margin-bottom: 20px;
}

.months span,
.days span {
    margin: 0 4px;
    font-size: 12px;
    color: #aaa;
}
</style>