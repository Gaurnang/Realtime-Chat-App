
function SignupPage() {
  return (
    <div className = "w-full max-w-md p-8 space-y-3 rounded-xl bg-slate-800 text-gray-100">
      <h1 className = "text-2xl font-bold text-center">Sign Up</h1>
      <form action="" className = "space-y-6 ng-untouched ng-pristine ng-valid">
        <div className = "space-y-1 text-sm">
          <label htmlFor="username" className = "block text-gray-400">Username</label>
          <input type="text" name="username" id="username" placeholder = "Username" className = "w-full px-4 py-3 rounded-md bg-gray-900 text-gray-100 focus:border-violet-400"/>
        </div>
        <div className = "space-y-1 text-sm">
          <label htmlFor="email" className = "block text-gray-400">Email</label>
          <input type="email" name="email" id="email" placeholder = "Email" className = "w-full px-4 py-3 rounded-md bg-gray-900 text-gray-100 focus:border-violet-400"/>
        </div>
        <div className = "space-y-1 text-sm">
          <label htmlFor="password" className = "block text-gray-400">Password</label>
          <input type="password" name="password" id="password" placeholder = "Password" className = "w-full px-4 py-3 rounded-md bg-gray-900 text-gray-100 focus:border-violet-400"/>
        </div>
        <button className = "block w-full p-3 text-center rounded-sm text-gray-900 bg-violet-400">Sign Up</button>
      </form>
    </div>
  )
}

export default SignupPage;