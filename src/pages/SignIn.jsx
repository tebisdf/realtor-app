import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
export default function SignIn() {
  const navigate = useNavigate();
  //another hook for password
  const [showPassword, setShowPassword] = useState(false); //the false is the initial value
  // create a formData hook
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // get info from formData
  const { email, password } = formData;
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  //to authenticate user
  async function onSubmit(e) {
   e.preventDefault();
   try {
     const auth = getAuth();
     const credentials = await signInWithEmailAndPassword(
       auth,
       email,
       password
       );
       
       console.log(credentials.user)
      if (credentials.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user Credentials");
    }
  }
  return (
    <section>
      <h1 className="text-6xl text-center mt-6 font-bold">Sign in</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-6">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              className="mb-6 w-full px-4 py-2 text-xl text-grey-700 bg-white transition ease-in-out border-grey-300 rounded "
            />
            {/*no adding of () in function but use in functino */}
            <div className="relative mb-6 ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-xl text-grey-700 bg-white transition ease-in-out border-grey-300 rounded "
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={(e) => setShowPassword((prev) => !prev)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            {/* whitespace-nowrap prevent going to the next line */}
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p>
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forget-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              Sign in
            </button>
            <div
              className=" flex  my-4  items-center
          before:border-t  before:flex-1
          before:border-gray-300
          after:border-t  after:flex-1
          after:border-gray-300
          "
            >
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
