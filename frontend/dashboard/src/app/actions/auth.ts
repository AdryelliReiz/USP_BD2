import { redirect } from 'next/navigation'
import { deleteSession } from '@/app/lib/session'
import { createSession } from '@/app/lib/session'
import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import api from '@/services/api'
 
export async function logout() {
    await deleteSession()
    redirect('/login')
}

export async function signup(state: FormState, formData: FormData) {
    // Valide os campos do formulário
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    // Se algum campo não for válido, retorne os erros
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    // Envie os dados do formulário para a API
    const {data, status} = await api.post('/admin/login/', { email, senha: password });

    // Se a API retornar um erro, retorne a mensagem de erro
    if (status !== 200) {
        return {
            message: data.message,
        }
    }

    const access_token = data.access;

    await createSession(access_token)
    redirect('/dashboard')
}