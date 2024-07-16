<template>
    <Popup
        ref="popRef"
        :title="formData.type.includes('edit') ? '编辑章节' : '新增章节'"
        title_tips="全文生成效果受章节数和概要内容影响，请谨慎修改"
        width="500px"
        async
        @confirm="submit"
        @close="$emit('close')"
    >
        <div>
            <ElForm
                ref="formRef"
                label-position="top"
                :model="formData"
                :rules="rules"
            >
                <ElFormItem
                    label="插入位置"
                    v-if="!formData.type.includes('edit')"
                    prop="position"
                >
                    <ElRadioGroup v-model="formData.position">
                        <ElRadio label="after">本章之后</ElRadio>
                        <ElRadio label="before">本章之前</ElRadio>
                    </ElRadioGroup>
                </ElFormItem>
                <ElFormItem label="章节标题" prop="title">
                    <ElInput v-model="formData.title"></ElInput>
                </ElFormItem>
                <ElFormItem
                    label="章节概要"
                    v-if="!formData.type.includes('Parents')"
                    prop="summary"
                >
                    <ElInput
                        type="textarea"
                        v-model="formData.summary"
                    ></ElInput>
                </ElFormItem>
            </ElForm>
        </div>
    </Popup>
</template>
<script setup lang="ts">
import {
    ElForm,
    ElFormItem,
    ElRadio,
    ElRadioGroup,
    ElInput
} from 'element-plus'
import type { FormRules } from 'element-plus'

const emits = defineEmits(['submit', 'close'])

const popRef = shallowRef()

const formRef = ref<InstanceType<typeof ElForm>>()

const formData = ref({
    type: '',
    PIndex: '',
    SIndex: '',
    position: 'after',
    title: '',
    summary: ''
})

const open = (type: string, options: any) => {
    popRef.value.open()
    console.log(options)
    if (type == 'addParents') {
        ;[formData.value.PIndex, formData.value.type] = [options.PIndex, type]
    } else if (type == 'editParents') {
        ;[formData.value.PIndex, formData.value.type, formData.value.title] = [
            options.PIndex,
            type,
            options.title
        ]
    } else if (type == 'addSon') {
        ;[formData.value.PIndex, formData.value.type, formData.value.SIndex] = [
            options.PIndex,
            type,
            options.SIndex
        ]
    } else if (type == 'editSon') {
        ;[
            formData.value.PIndex,
            formData.value.type,
            formData.value.SIndex,
            formData.value.title,
            formData.value.summary
        ] = [
            options.PIndex,
            type,
            options.SIndex,
            options.name,
            options.abstract
        ]
    }
}

const rules = ref<FormRules>({
    position: [{ required: true, trigger: 'blur' }],
    title: [{ required: true, trigger: 'blur', message: '请输入章节标题' }],
    summary: [{ required: true, trigger: 'blur', message: '请输入章节概要' }]
})

//提交
const submit = async () => {
    await formRef.value?.validate()
    popRef.value.close()
    emits('submit', formData.value)
}

defineExpose({
    open
})
</script>

<style scoped lang="scss"></style>
