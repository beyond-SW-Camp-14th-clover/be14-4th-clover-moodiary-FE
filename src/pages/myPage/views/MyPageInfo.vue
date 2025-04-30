<template>
    <div>
        <div class="my-page-inner">
            <form @submit.prevent="updateUser">
                <h1>내 정보</h1>
                <br>
                <div class="my-page-info-row">
                    <h1>이름: </h1>
                    <input v-model="form.name" type="text" required />
                </div>
                <br>
                <div class="my-page-info-row">
                    <h1>이메일: </h1>
                    <input v-model="form.email" type="email" required />
                </div>
                <br>
                <div class="my-page-info-row">
                    <h1>전화번호: </h1>
                    <input v-model="form.phoneNumber" type="text" required />
                </div>
                <br>
                <button type="submit">수정하기</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import axios from 'axios';

    const dummy_user = {
        id: 0,
        name: "꼼곰보",
        email: "rhtjddus@gmail.com",
        phoneNumber: "010-1234-5678",
    };

    const props = defineProps({
        userId: {
            type: Number,
            required: true,
        }
    });

    const form = ref({ ...dummy_user })
    const message = ref('')

    // 설명. 현재 회원 정보 받아오기
    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/user/query/info/${props.userId}`)
            form.value = res.data
        } catch (err) {
            message.value = '사용자 정보를 불러오지 못했습니다. 더미 데이터를 표시합니다.'
            form.value = { ...dummy_user } // 로딩 실패 시 더미 데이터 사용
        }
    }

    const updateUser = async () => {
        try {
            await axios.put(`http://localhost:8080/user/command/update`, form.value)
            message.value = '수정이 완료되었습니다.'
            alert(message.value);
        } catch (err) {
            message.value = '수정 중 오류가 발생했습니다.'
        }
    }

    onMounted(fetchUser)
</script>

<style scoped>
    .my-page-inner {
        padding: 20px 10%;
    }
    .my-page-info-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    input {
        padding: 12px 24px;
        font-size: 16px;
        border: 2px solid #ccc;
        border-radius: 10px;
        width: 70%;
        font-family: var(--font-omyu);
    }
</style>