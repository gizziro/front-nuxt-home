<template>
    <div class="card flex justify-center">
        <Form v-slot="$form" 
        :resolver="resolver"
        :initialValues="initialValues" 
        @submit="onFormSubmit" 
        class="flex flex-col gap-4 w-full sm:w-56">
            <div class="flex flex-col gap-1">
                <InputText name="id" type="text" placeholder="Username" fluid />
                <Message v-if="$form.id?.invalid" severity="error" size="small" variant="simple">{{ $form.id.error?.message }}</Message>
            </div>
            <div class="flex flex-col gap-1">
                <InputText name="password" type="password" placeholder="Password" fluid />
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="로그인" />
        </Form>
    </div>
</template>


<script setup>

definePageMeta({
  middleware: ['guest-only'],
});

import { useToast } from "primevue/usetoast";

const toast = useToast();
const initialValues = ref({
    id: '',
    password: ''
});

const resolver = ref(zodResolver(
    z.object({
        id: z.string().min(1, { message: 'Username is required.' }),
        password: z.string().min(1, { message: 'Password is required.' }),
        // email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' })
    })
));

const onFormSubmit = async ({ values, valid }) => {
    if (valid) 
    {
        console.log(`id : ${values.id}, password : ${values.password}`)
        toast.add({ severity: 'success', summary: '로그인에 성공하였습니다.', life: 3000 });
        await navigateTo({ path: '/' });
    }
};


</script>

<style lang="scss" scoped>

</style>