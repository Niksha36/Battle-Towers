<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['close']);
const isVisible = ref(false);

function openSettings() {
    isVisible.value = true;
}

function closeSettings() {
    isVisible.value = false;
    emit('close');
}
</script>

<template>
    <div v-if="isVisible" class="background-wrapper">
        <div class="leave-the-game-dialog">
            <h2>Выйти из игры</h2>
            <span>Вы уверены что хотите покинуть игру? Ваш прогресс будет утерен безвозвратно.</span>
            <div class="buttons-wrapper">
                <button @click="openSettings" class="submit-button">Да</button>
                <button @click="closeSettings" class="cancel-button">Нет</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.background-wrapper {
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.leave-the-game-dialog {
}
.button-wrapper {
    display: flex;
    justify-content: space-between;
}
</style>
