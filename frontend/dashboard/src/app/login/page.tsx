'use client'
import { useFormStatus } from 'react-dom'
import { signup } from '@/app/actions/auth'

import '@/styles/pages/login.scss'
import { useActionState } from 'react'

export default function Login() {
    const [state, action] = useActionState(signup, undefined)
    const { pending } = useFormStatus()

    return (
        <main>
            <div className="login-container">
                <h1>CINEACH | DASHBOARD</h1>
                
                <div className="form-container">
                    <h2>LOGIN</h2>
                    <span className='divisor' />
                    <form action={action}>
                        <div>
                            <label htmlFor="email">E-mail</label>
                            <input id="email" name="email" placeholder="Digite o seu e-mail" />
                            {state?.errors?.email && <p className="error-message">{state.errors.email}</p>}
                        </div>
                    
                        <div>
                            <label htmlFor="password">Senha</label>
                            <input id="password" name="password" type="password" placeholder='Digite a sua senha' />
                            {state?.errors?.password && <p className="error-message">{state.errors.password}</p>}
                        </div>

                        <button disabled={pending} type="submit">
                            ENTRAR
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
