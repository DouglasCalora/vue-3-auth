import auth from '../store'

export default async (to, from, next) => {
  // valida se o usuario existe sempre que muda de rota
  auth.dispatch('auth/userValidation')

  const isAuth = auth.getters['auth/isAuth']
  const { name } = to

  if (!isAuth && name !== 'Login') return next({ name: 'Login' })

  if ((isAuth && name === 'Login') || (isAuth && name === 'Logout')) return next({ name: 'Home' })

  next()
}
