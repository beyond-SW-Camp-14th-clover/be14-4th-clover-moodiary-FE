<template>
    <div class="regist-my-diary-background">
        <div class="content-container">
            <div class="regist-my-diary-header">
                <div class="date-display">{{ formattedDate }}</div>
            </div>
            <div class="title-row">
                <h3>일기 제목: </h3>
                <input 
                    v-model="diaryTitle"
                    type="text"
                    class="regist-my-diary-title-input"
                />
                <div class="button-group">
                    <button>사진 추가</button>
                    <button>스티커 추가</button>
                </div>
            </div>
            <div class="regist-my-diary-content">
                <div class="regist-my-diary-tagdiv">
                    <h3>감정 태그: </h3>
                    <div class="regist-my-diary-tags">
                        <span 
                            v-for="(tag, index) in tags" 
                            :key="index" 
                            class="tag"
                            @click="removeTag(index)"
                        >
                            #{{ tag }}
                        </span>
                    </div>
                </div>
                <div class="diary-content">
                    <textarea 
                        v-model="diaryContent"
                        @input="handleInput"
                        placeholder="일기의 내용을 입력하세요."
                        class="diary-textarea"
                    ></textarea>
                </div>
            </div>
            <div class="button-container">
                <button>등록</button>
                <button>취소</button>
                <button 
                    :class="{ 'confirm-button': true, 'confirmed': isConfirmed }"
                    @click="showConfirmModal = true"
                >
                    일기 확정
                </button>
            </div>
        </div>
    </div>

    <!-- 모달 컴포넌트 -->
    <ConfirmCheck 
        v-if="showConfirmModal"
        @confirm="handleConfirm"
        @close="showConfirmModal = false"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import ConfirmCheck from '@/modules/myDiary/components/ConfirmCheck.vue';

const selectedDate = ref(new Date());
const diaryContent = ref('');
const diaryTitle = ref('');
const tags = ref([]);
const isConfirmed = ref(false);
const showConfirmModal = ref(false);

const formattedDate = computed(() => {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth() + 1;
    const day = selectedDate.value.getDate();
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.value.getDay()];
    
    return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
});

const handleInput = (event) => {
    const text = event.target.value;
    const lastChar = text[text.length - 1];
    
    if (lastChar === ' ') {
        const words = text.split(' ');
        const lastWord = words[words.length - 2];
        
        if (lastWord && lastWord.startsWith('#')) {
            const tag = lastWord.substring(1);
            if (tag && !tags.value.includes(tag)) {
                tags.value.push(tag);
                const newText = text.slice(0, -(lastWord.length + 1));
                diaryContent.value = newText;
            }
        }
    }
};

const removeTag = (index) => {
    tags.value.splice(index, 1);
};

const handleConfirm = () => {
    isConfirmed.value = true;
    showConfirmModal.value = false;
};
</script>

<style lang="scss" scoped>
.regist-my-diary-background {
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    width: 1413px;
    height: 914px;
    background-color: #FFFFFF;
    padding-left: 100px;
    padding-right: 100px;
    display: flex;
    justify-content: center;
}

.content-container {
    width: 669px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.regist-my-diary-header {
    padding: 20px;
    text-align: center;
}

.date-display {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #535353;
    width: 370px;
    height: 51px;
    background-color: #FAFAFA;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    margin-left: 30px;
    width: 100%;
}

.title-row h3 {
    white-space: nowrap;
    margin: 0;
    padding: 0;
}

.regist-my-diary-title-input {
    width: 379px;
    height: 36px;
    background-color: rgba(247, 242, 235, 0.5); // 수정
    border-radius: 5px;
    border: none;
    padding: 0 15px;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #535353;
    outline: none;
    position: relative;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(247, 242, 235, 0.5); // 수정
        z-index: -1;
        border-radius: 5px;
    }

    &::placeholder {
        color: #535353;
        opacity: 0.5;
    }

    &::-webkit-input-placeholder {
        color: #535353;
        opacity: 0.5;
    }

    &:-ms-input-placeholder {
        color: #535353;
        opacity: 0.5;
    }
}

.button-group {
    display: flex;
    gap: 10px;
    margin-left: 10px;
}

.button-group button {
    width: 80px;
    height: 30px;
    background-color: #E9D2AF;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    color: #535353;
}

.title-row h3,
.regist-my-diary-tagdiv h3 {
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #000000;
    white-space: nowrap;
    margin-left: 15px;
}

.regist-my-diary-content {
    width: 669px;
    height: 565px;
    margin-top: 20px;
    margin-bottom: 35px;
    position: relative;
}

.regist-my-diary-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #F7F2EB;
    opacity: 0.5;
    z-index: 0;
}

.regist-my-diary-tagdiv {
    position: relative;
    z-index: 1;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.regist-my-diary-tagdiv h3 {
    white-space: nowrap;
}

.regist-my-diary-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
}

.tag {
    height: 28px;
    background-color: #E2EFFF;
    color: #535353;
    padding: 0 12px;
    border-radius: 4px;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;

    &:hover {
        opacity: 0.8;
    }
}

.diary-content {
    padding: 20px;
    position: relative;
    z-index: 1;
}

.diary-textarea {
    width: 100%;
    height: 400px;
    padding: 15px;
    border: none;
    background: transparent;
    font-family: 'Ownglyph PDH', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #535353;
    line-height: 1.6;
    resize: none;
    outline: none;

}

.button-container {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.button-container button {
    width: 122px;
    height: 46px;
    background-color: #E9D2AF;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #535353;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
}

.confirm-button {
    background-color: #EFEFED !important;
    
    &.confirmed {
        background-color: #E9D2AF !important;
    }
}
</style>