import { z } from 'zod'
 
export const SignupFormSchema = z.object({
	email: z.string().email({ message: 'E-mail inválido.' }).trim(),
	password: z
		.string()
		.min(8, { message: 'A senha precisa ter pelo menos 8 digitos.' })
		.trim(),
})
 
export type FormState =
	| {
		errors?: {
			email?: string[]
			password?: string[]
		}
		message?: string
		}
	| undefined