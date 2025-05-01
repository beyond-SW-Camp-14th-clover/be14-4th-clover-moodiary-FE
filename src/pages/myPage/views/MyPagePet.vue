<template>
    <div class="pet-change-container">
        <h1>펫 변경</h1>
        <div class="pet-display">
            <button class="arrow-btn" @click="prevPet">◀</button>
            <div class="pet-image">
                <img :src="currentPetImage" alt="현재 선택된 펫">
            </div>
            <button class="arrow-btn" @click="nextPet">▶</button>
        </div>
        <div class="button-group">
            <button class="select-btn" @click="selectPet">선택</button>
            <button class="cancel-btn" @click="cancelSelection">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['select-pet', 'close'])

const currentPetIndex = ref(1)
const totalPets = 11

const currentPetImage = computed(() => {
    return new URL(`/src/assets/pets/pet${currentPetIndex.value}.png`, import.meta.url).href
})

const prevPet = () => {
    currentPetIndex.value = currentPetIndex.value === 1 ? totalPets : currentPetIndex.value - 1
}

const nextPet = () => {
    currentPetIndex.value = currentPetIndex.value === totalPets ? 1 : currentPetIndex.value + 1
}

const selectPet = () => {
    // Pets 컴포넌트의 changePet 함수 호출
    const petsComponent = document.querySelector('.pets-container')
    if (petsComponent && petsComponent.__vueParentComponent) {
        const petsInstance = petsComponent.__vueParentComponent.exposed
        if (petsInstance && petsInstance.changePet) {
            petsInstance.changePet(currentPetIndex.value)
        }
    }
    emit('select-pet', currentPetIndex.value)
    emit('close')
}

const cancelSelection = () => {
    currentPetIndex.value = 1
    emit('close')
}
</script>

<style scoped>
.pet-change-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.pet-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
}

.arrow-btn {
    background: none;
    border: none;
    font-size: 40px;
    cursor: pointer;
    padding: 20px;
    margin: 0;
    line-height: 1;
    color: #000;
    text-decoration: none;
    box-shadow: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.arrow-btn:focus {
    outline: none;
}

.arrow-btn:hover {
    color: #666;
}

.pet-image {
    width: 130px;
    height: 130px;

    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pet-image img {
    max-width: 100%;
    max-height: 100%;
}

.button-group {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.select-btn, .cancel-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    box-shadow: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: background-color 0.3s ease;
}

.select-btn {
    background-color: #4CAF50;
    color: white;
}

.select-btn:hover {
    background-color: #45a049;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
}

.cancel-btn:hover {
    background-color: #d32f2f;
}

.select-btn:focus, .cancel-btn:focus {
    outline: none;
}
</style>