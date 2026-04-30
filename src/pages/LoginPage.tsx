import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import backgroundImg from "../assets/BackGround-image-LoginPage.jpg";
import loginSideImg from "../assets/login-Image.jpg";
import signinSideImg from "../assets/SignUp-image.jpg";
import animatedLogo from "../assets/New-LogoLogin-removebg-preview.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ cmpassword, setCmPassword ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, isError ] = useState<string | null >(null);

  useEffect(() => {
    if(error){
      const timer = setTimeout(() => {
        isError(null);
      }, 3000);
      return() => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    isError(null);

    try {
      const response = await fetch('https://devbackend-n4lk.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Error || "Login failed");
      }else{
        navigate("/Dashboard")
      }
      localStorage.setItem('token', data.accessToken);
    } catch (error : unknown) {
      if(error instanceof Error){
        isError(error.message);
      }else{
        isError("An unexpected error occurred")
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    isError(null);

    try {
      const response = await axios.post('https://devbackend-n4lk.onrender.com/api/auth/signin', { email, password }, { timeout: 40000 });

      const data = await response.data;

      if (response.status >= 300) {
        throw new Error(data.Error || "Login failed");
      }else{
        setIsLogin(true);
      }
    } catch (error : unknown) {
      if(error instanceof Error){
        isError(error.message);
      }else{
        isError("An unexpected error occurred")
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6'
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className='flex flex-col md:flex-row items-stretch bg-white rounded-4xl md:rounded-4xl shadow-2xl overflow-hidden max-w-6xl w-full md:h-full'>
        <div className='relative flex-1 md:w-[55%] p-2 flex flex-col justify-center bg-white z-10 
                        md:after:content-[""] md:after:absolute md:after:top-0 md:after:-right-24 
                        md:after:h-full md:after:w-24 md:after:bg-white 
                        md:after:[clip-path:polygon(0_0,0_100%,100%_50%)]'>
          
          <div className='w-full max-w-sm mx-auto'>
            <div className='text-center mb-10'>
              <img src={animatedLogo} className='mx-auto h-[80px]' width={250} alt="Logo"/>
              <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className='text-gray-400 mt-2 font-medium'>
                {isLogin ? 'Please Login to Account' : 'Join us today!'}
              </p>
              {error && <p style={{ color: 'red'}}>{error}</p>}
            </div>

            <form className='flex flex-col space-y-5' onSubmit={isLogin ? handleLogin : handleSignin}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                <input placeholder='Enter your email' className='w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
                       value={email}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                       type='email'
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                <input type="password" placeholder='Enter your password' className='w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
                       value={password}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (<div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
                <input placeholder='Enter your password' className='w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50'
                       value={cmpassword}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setCmPassword(e.target.value)}
                />
              </div>)}

              <button disabled={loading}
              className='bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4 text-lg'
              >
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <p className='mt-10 text-center text-sm text-gray-500'>
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <span 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-blue-600 font-bold ml-2 cursor-pointer hover:underline"
              >
                {isLogin ? 'Register' : 'Login'}
              </span>
            </p>
          </div>
        </div>
        <div className='hidden md:block md:w-[45%]'>
          <img 
            src={isLogin ? loginSideImg : signinSideImg} 
            alt='side' 
            className='w-full h-full object-cover' 
          />
        </div>

      </div>
    </div>
  );
}

export default LoginPage